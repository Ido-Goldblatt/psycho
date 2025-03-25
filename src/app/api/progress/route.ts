import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Progress from '@/models/Progress';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    
    const progress = await Progress.create({
      userId: body.userId,
      wordId: body.wordId,
      status: body.status || (body.isCorrect ? 'learned' : 'in_progress'),
      nextReview: body.nextReview ? new Date(body.nextReview) : null,
      isCorrect: body.isCorrect,
    });
    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await connectDB();
    const progress = await Progress.find({ userId })
      .populate('wordId')
      .sort({ createdAt: -1 })
      .exec();

    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    
    const progress = await Progress.findByIdAndUpdate(
      body.id,
      {
        $set: {
          status: body.status || (body.isCorrect ? 'learned' : 'in_progress'),
          nextReview: body.nextReview ? new Date(body.nextReview) : null,
          isCorrect: body.isCorrect,
        },
        $inc: { reviewCount: 1 }
      },
      { new: true }
    );
    
    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
} 