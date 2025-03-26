import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Word from '@/models/Word';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { status } = await request.json();
    
    const word = await Word.findByIdAndUpdate(
      params.id,
      { 
        $set: { 
          status,
          lastReviewed: new Date(),
          nextReviewDate: calculateNextReviewDate(status)
        }
      },
      { new: true }
    );

    if (!word) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }

    return NextResponse.json(word);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update word' }, { status: 500 });
  }
}

function calculateNextReviewDate(status: string): Date {
  const now = new Date();
  switch (status) {
    case 'known':
      // Review in 7 days
      return new Date(now.setDate(now.getDate() + 7));
    case 'learning':
      // Review in 1 day
      return new Date(now.setDate(now.getDate() + 1));
    case 'skip':
      // Review in 3 days
      return new Date(now.setDate(now.getDate() + 3));
    default:
      return now;
  }
} 