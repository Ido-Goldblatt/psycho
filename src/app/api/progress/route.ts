import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import VocabularyProgress from '@/models/VocabularyProgress';
import { getCurrentUserId } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    // Update or create progress entry
    const progress = await VocabularyProgress.findOneAndUpdate(
      {
        userId,
        wordId: body.wordId,
      },
      {
        status: body.status,
        isCorrect: body.isCorrect,
        nextReview: body.nextReview,
        lastReviewed: new Date(),
        $inc: { reviewCount: 1 },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Failed to save progress:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const userId = getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const progress = await VocabularyProgress.find({ userId })
      .populate('wordId')
      .sort({ createdAt: -1 })
      .exec();

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    
    const progress = await VocabularyProgress.findByIdAndUpdate(
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