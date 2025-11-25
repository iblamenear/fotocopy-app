import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();

    const usersToSeed = [
      {
        name: 'Admin User',
        email: 'admin@fotocopy.com',
        password: 'admin123',
        role: 'admin',
      },
      {
        name: 'Kurir User',
        email: 'kurir@fotocopy.com',
        password: 'kurir123',
        role: 'courier',
      },
    ];

    const results = [];

    for (const userData of usersToSeed) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await User.create({
          ...userData,
          password: hashedPassword,
        });
        results.push(`Created ${userData.role}: ${userData.email}`);
      } else {
        results.push(`Skipped ${userData.role}: ${userData.email} (already exists)`);
      }
    }

    return NextResponse.json({ 
      message: 'Seeding complete', 
      results 
    });

  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}
