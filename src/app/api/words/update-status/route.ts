import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Word from '@/models/Word';

export async function POST(request: Request) {
  try {
    const { wordId, status } = await request.json();
    
    if (!wordId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    const result = await Word.findByIdAndUpdate(
      wordId,
      { 
        status,
        lastReviewed: new Date(),
        nextReview: status === 'learning' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null // Set next review for 24h later if status is 'learning'
      },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Word not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating word status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 