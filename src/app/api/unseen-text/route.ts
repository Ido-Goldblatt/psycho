import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UnseenText } from '@/models/UnseenText';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get a random unseen text
    const unseenText = await UnseenText.findOne();
    
    if (!unseenText || unseenText.length === 0) {
      return NextResponse.json(
        { error: 'No unseen texts found' },
        { status: 404 }
      );
    }

    // Remove the answer field from questions before sending to client
    const sanitizedUnseenText = unseenText.toObject();
    sanitizedUnseenText.questions = sanitizedUnseenText.questions.map((q: any) => ({
      question: q.question,
      options: q.options
    }));

    return NextResponse.json(sanitizedUnseenText);
  } catch (error) {
    console.error('Error fetching unseen text:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unseen text' },
      { status: 500 }
    );
  }
} 