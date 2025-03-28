import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import TimeSpent from '@/models/TimeSpent';
import { getCurrentUserId } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let timeSpent: number;
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      const body = await request.json();
      timeSpent = body.timeSpent;
    } else if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      timeSpent = parseInt(formData.get('timeSpent') as string);
    } else {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    await connectToDatabase();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const timeSpentDoc = await TimeSpent.findOneAndUpdate(
      {
        userId,
        date: today
      },
      {
        $inc: { timeSpent },
        lastActive: new Date()
      },
      {
        upsert: true,
        new: true
      }
    );

    return NextResponse.json(timeSpentDoc);
  } catch (error) {
    console.error('Error updating time spent:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const timeSpentDoc = await TimeSpent.findOne({
      userId,
      date: today
    });

    return NextResponse.json(timeSpentDoc || { timeSpent: 0 });
  } catch (error) {
    console.error('Error fetching time spent:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 