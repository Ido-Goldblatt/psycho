import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UnseenEnglishQuestion } from '@/models/UnseenEnglishQuestion';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    // Get the specific unseen question by ID
    const unseenQuestion = await UnseenEnglishQuestion.findById(params.id)
      .select('_id passage questions')
      .lean();

    if (!unseenQuestion) {
      return NextResponse.json(
        { error: 'Unseen question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(unseenQuestion);
  } catch (error) {
    console.error('Error fetching unseen question:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unseen question' },
      { status: 500 }
    );
  }
} 