import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { config } from '@/lib/config';

const apiClient = new midtransClient.Snap({
  isProduction: false,
  serverKey: config.MIDTRANS_SERVER_KEY,
  clientKey: config.MIDTRANS_CLIENT_KEY,
});

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    await dbConnect();

    // 1. Get status from Midtrans
    let statusResponse;
    try {
      statusResponse = await apiClient.transaction.status(orderId);
    } catch (midtransError: any) {
      console.error('Midtrans API Error:', midtransError);
      return NextResponse.json({ error: 'Failed to fetch status from Midtrans' }, { status: 502 });
    }

    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Manual status check for ${orderId}: ${transactionStatus}`);

    // 2. Determine internal status
    let orderStatus = 'pending';
    if (transactionStatus == 'capture') {
      if (fraudStatus == 'challenge') {
        orderStatus = 'challenge';
      } else if (fraudStatus == 'accept') {
        orderStatus = 'paid';
      }
    } else if (transactionStatus == 'settlement') {
      orderStatus = 'paid';
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
      orderStatus = 'failed';
    } else if (transactionStatus == 'pending') {
      orderStatus = 'pending';
    }

    // 3. Update database
    const order = await Order.findOne({ orderId: orderId });
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Only update if status changed
    if (order.payment.status !== orderStatus) {
      order.payment.status = orderStatus;
      order.payment.transactionTime = new Date();
      
      // Update payment details if available
      if (statusResponse.payment_type) {
         order.payment.paymentType = statusResponse.payment_type;
      }
      
      await order.save();
    }

    return NextResponse.json({ 
      status: 'ok', 
      orderStatus: orderStatus,
      midtransStatus: transactionStatus
    });

  } catch (error: any) {
    console.error('Error checking payment status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
