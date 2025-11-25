import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, phone, image, address } = await request.json();

    await dbConnect();

    console.log('Updating profile for:', session.user.email);
    console.log('Update data payload:', { name, phone, address, imageLength: image?.length });

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { name, phone, image, address },
      { new: true }
    );
    
    console.log('Updated user result:', updatedUser ? 'Success' : 'Not Found');
    if (updatedUser) {
      console.log('Updated address in DB:', updatedUser.address);
    }

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        image: updatedUser.image,
        address: updatedUser.address,
        role: updatedUser.role,
      }
    });

  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
        address: user.address,
        role: user.role,
      }
    });

  } catch (error: any) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
