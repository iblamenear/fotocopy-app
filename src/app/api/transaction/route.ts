import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { config } from '@/lib/config';

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: config.MIDTRANS_SERVER_KEY,
  clientKey: config.MIDTRANS_CLIENT_KEY,
});

export async function POST(request: Request) {
  try {
    console.log('Transaction API called');
    await dbConnect();
    const body = await request.json();
    const { items, customer, delivery, totalAmount, userId } = body;

    // Create a unique order ID
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Calculate gross amount (ensure it matches totalAmount)
    // Midtrans requires integer for gross_amount
    const grossAmount = Math.round(totalAmount);

    // Prepare Midtrans parameter
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: customer.name,
        email: customer.email,
        phone: customer.phone,
        billing_address: {
          first_name: customer.name,
          phone: customer.phone,
          address: customer.address,
        },
        shipping_address: {
          first_name: customer.name,
          phone: customer.phone,
          address: customer.address,
        },
      },
      item_details: [
        ...items.map((item: any) => ({
          id: item.id || 'ITEM',
          price: item.price,
          quantity: 1, // Assuming 1 for simplicity as per our cart logic
          name: item.fileName.substring(0, 50), // Midtrans name limit
        })),
        {
          id: 'SHIPPING',
          price: delivery.price,
          quantity: 1,
          name: `Delivery: ${delivery.method}`,
        },
        {
          id: 'SERVICE_FEE',
          price: 1000,
          quantity: 1,
          name: 'Service Fee',
        }
      ]
    };

    // Create transaction token
    const transaction = await snap.createTransaction(parameter);

    // Save order to database
    const newOrder = new Order({
      orderId,
      userId, // Save userId if present
      customer,
      items,
      delivery,
      totalAmount,
      payment: {
        method: 'midtrans',
        status: 'pending',
        transactionId: transaction.token,
      },
    });

    await newOrder.save();

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      orderId: orderId
    });

  } catch (error: any) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction', details: error.message },
      { status: 500 }
    );
  }
}
