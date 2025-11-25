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
    await dbConnect();
    const notificationJson = await request.json();

    // Verify notification signature (optional but recommended)
    // const statusResponse = await apiClient.transaction.notification(notificationJson);
    // For simplicity in this demo, we'll use the notificationJson directly but in prod use the SDK verification
    const statusResponse = notificationJson;

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction Status: ${transactionStatus}. Fraud Status: ${fraudStatus}`);

    // Handle Midtrans Dashboard Test Notifications
    if (orderId.startsWith('payment_notif_test_')) {
      console.log('Midtrans test notification received. Ignoring database update.');
      return NextResponse.json({ status: 'ok', message: 'Test notification received' });
    }

    let orderStatus = 'pending';

    if (transactionStatus == 'capture') {
      if (fraudStatus == 'challenge') {
        // TODO: set transaction status on your database to 'challenge'
        orderStatus = 'challenge';
      } else if (fraudStatus == 'accept') {
        // TODO: set transaction status on your database to 'success'
        orderStatus = 'paid';
      }
    } else if (transactionStatus == 'settlement') {
      // TODO: set transaction status on your database to 'success'
      orderStatus = 'paid';
    } else if (transactionStatus == 'cancel' ||
      transactionStatus == 'deny' ||
      transactionStatus == 'expire') {
      // TODO: set transaction status on your database to 'failure'
      orderStatus = 'failed';
    } else if (transactionStatus == 'pending') {
      // TODO: set transaction status on your database to 'pending' / waiting payment
      orderStatus = 'pending';
    }

    // Update order in database
    // Update order in database
    // Handle both original orderId and retried orderId (which has a timestamp suffix)
    let order = await Order.findOne({ orderId: orderId });

    if (!order && orderId.includes('-')) {
      // Try removing the last part (timestamp suffix added during retry)
      // Format: ORD-{timestamp}-{random}-{retryTimestamp}
      const originalOrderId = orderId.substring(0, orderId.lastIndexOf('-'));
      console.log(`Order not found with ID ${orderId}. Trying original ID: ${originalOrderId}`);
      order = await Order.findOne({ orderId: originalOrderId });
    }

    if (order) {
      order.payment.status = orderStatus;
      order.payment.transactionTime = new Date();
      order.payment.paymentType = statusResponse.payment_type;
      
      // Extract payment details based on payment type
      const paymentDetails: any = {};
      
      if (statusResponse.va_numbers && statusResponse.va_numbers.length > 0) {
        paymentDetails.bank = statusResponse.va_numbers[0].bank;
        paymentDetails.vaNumber = statusResponse.va_numbers[0].va_number;
      } else if (statusResponse.permata_va_number) {
        paymentDetails.bank = 'permata';
        paymentDetails.vaNumber = statusResponse.permata_va_number;
      } else if (statusResponse.bill_key && statusResponse.biller_code) {
        paymentDetails.bank = 'mandiri';
        paymentDetails.billKey = statusResponse.bill_key;
        paymentDetails.billerCode = statusResponse.biller_code;
      } else if (statusResponse.payment_type === 'qris') {
        paymentDetails.issuer = statusResponse.issuer || 'gopay'; // Default to gopay if issuer not present
        paymentDetails.acquirer = statusResponse.acquirer;
      } else if (statusResponse.payment_type === 'gopay') {
        paymentDetails.issuer = 'gopay';
      } else if (statusResponse.payment_type === 'shopeepay') {
        paymentDetails.issuer = 'shopeepay';
      }

      order.payment.paymentDetails = paymentDetails;
      
      // If it's a retry, we might want to update the transactionId to the new one if not already
      // But usually the retry logic already updated it.
      
      await order.save();
      console.log(`Order ${order.orderId} updated to ${orderStatus}`);
    } else {
      console.error(`Order not found for notification: ${orderId}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 'ok' });

  } catch (error: any) {
    console.error('Error handling notification:', error);
    return NextResponse.json(
      { error: 'Failed to handle notification' },
      { status: 500 }
    );
  }
}
