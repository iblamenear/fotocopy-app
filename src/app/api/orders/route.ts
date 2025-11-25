import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('orderId');

    let query: any = {};
    
    if (orderId) {
      query.orderId = orderId;
      
      // Security Check for Single Order
      // We need to fetch the order first to check ownership
      // Optimization: We can just query with the security conditions if we want, 
      // but finding first then checking is clearer for the logic flow described.
      // However, to avoid fetching data the user shouldn't see, let's fetch first.
      const order = await Order.findOne({ orderId });
      
      if (!order) {
         return NextResponse.json([]); // Or 404, but keeping consistent with "search" style
      }

      // If order belongs to a user (not guest)
      if (order.userId) {
        if (!session) {
          return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }
        
        const isOwner = session.user.id === order.userId;
        const isAdminOrCourier = ['admin', 'courier'].includes(session.user.role);

        if (!isOwner && !isAdminOrCourier) {
          return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }
      }
      
      // If we passed checks, return the order (as an array to match previous behavior)
      return NextResponse.json([order]);
    }

    if (userId) {
      // Security Check for User Orders List
      if (!session) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const isOwner = session.user.id === userId;
      const isAdminOrCourier = ['admin', 'courier'].includes(session.user.role);

      if (!isOwner && !isAdminOrCourier) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      query.userId = userId;
    }

    if (status) {
      if (status === 'active') {
        // Fetch orders that are NOT completed or failed
        query['payment.status'] = { $in: ['paid', 'pending', 'processing', 'shipped'] };
      } else {
        query['payment.status'] = status;
      }
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    
    // Debug logging
    console.log('Fetched orders count:', orders.length);
    if (orders.length > 0) {
      console.log('Sample order payment details:', JSON.stringify(orders[0].payment, null, 2));
    }

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { orderId, status, paymentDetails, paymentType } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData['payment.status'] = status;
    if (paymentDetails) updateData['payment.paymentDetails'] = paymentDetails;
    if (paymentType) updateData['payment.paymentType'] = paymentType;

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: orderId },
      updateData,
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
