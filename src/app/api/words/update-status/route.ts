import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { wordId, status } = await request.json();
    
    if (!wordId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const result = await db.collection('words').updateOne(
      { _id: new ObjectId(wordId) },
      { 
        $set: { 
          status,
          lastReviewed: new Date(),
          nextReview: status === 'learning' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null // Set next review for 24h later if status is 'learning'
        } 
      }
    );

    if (result.modifiedCount === 0) {
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