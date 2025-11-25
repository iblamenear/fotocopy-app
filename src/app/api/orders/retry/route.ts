import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import midtransClient from 'midtrans-client';
import { config } from '@/lib/config';

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: config.MIDTRANS_SERVER_KEY,
  clientKey: config.MIDTRANS_CLIENT_KEY,
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await request.json();

    await dbConnect();

    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify ownership
    if (order.userId !== (session.user as any).id && (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (order.payment.status !== 'pending') {
      return NextResponse.json({ error: 'Order is not pending' }, { status: 400 });
    }

    // Generate NEW Order ID for Midtrans (Midtrans doesn't allow reusing Order IDs)
    // We keep the original orderId in our DB, but send a new one to Midtrans
    // Actually, to keep it simple and consistent, let's append a timestamp suffix for the transaction
    // But we need to be careful. If we change the orderId sent to Midtrans, notifications might mismatch.
    // A better approach for "Change Payment Method" in Midtrans Snap is just to get a NEW token for the SAME order details.
    // Snap allows re-creating transaction for same order_id IF it's not paid yet? 
    // Midtrans documentation says: "You can't re-use the same Order ID for a new transaction".
    // So we MUST generate a new unique order ID for the payment gateway.
    
    const newTransactionOrderId = `${orderId}-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: newTransactionOrderId, // Use new unique ID for this attempt
        gross_amount: Math.round(order.totalAmount),
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone,
      },
      item_details: order.items.map((item: any) => ({
        id: item.id || 'ITEM',
        price: item.price,
        quantity: 1,
        name: item.fileName.substring(0, 50),
      })).concat([
        {
          id: 'SHIPPING',
          price: (order.delivery as any).price || 0,
          quantity: 1,
          name: `Delivery: ${(order.delivery as any).method}`,
        },
        {
          id: 'SERVICE_FEE',
          price: 1000,
          quantity: 1,
          name: 'Service Fee',
        }
      ])
    };

    const transaction = await snap.createTransaction(parameter);

    // Update the order with the new transaction token
    // We don't necessarily need to change our DB orderId, just the transaction token.
    // However, for tracking, we might want to store the "active" midtrans order id.
    // For now, let's just update the token so the frontend can open Snap.
    
    order.payment.transactionId = transaction.token;
    await order.save();

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });

  } catch (error: any) {
    console.error('Retry payment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
