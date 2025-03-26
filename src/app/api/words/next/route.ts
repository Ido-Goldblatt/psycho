import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Connecting to database...');
    const { db } = await connectToDatabase();
    console.log('Connected to database successfully');
    
    // Get words that are either:
    // 1. New (never reviewed)
    // 2. Due for review (learning status and past nextReview time)
    const words = await db.collection('words')
      .find({
        $or: [
          { status: 'new' },
          {
            status: 'learning',
            nextReview: { $lte: new Date() }
          }
        ]
      })
      .limit(10) // Get 10 words at a time
      .toArray();

    console.log(`Found ${words.length} words`);

    if (words.length === 0) {
      // If no words found, try to get any words regardless of status
      const allWords = await db.collection('words')
        .find({})
        .limit(10)
        .toArray();
      
      console.log(`Found ${allWords.length} words in total`);
      return NextResponse.json({ words: allWords });
    }

    return NextResponse.json({ words });
  } catch (error) {
    console.error('Error in /api/words/next:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 