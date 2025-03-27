import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UnseenEnglishQuestion } from '@/models/UnseenEnglishQuestion';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get all unseen questions
    const unseenQuestions = await UnseenEnglishQuestion.find({})
      .select('_id passage questions')
      .lean();

    if (!unseenQuestions || unseenQuestions.length === 0) {
      return NextResponse.json(
        { error: 'No unseen questions available' },
        { status: 404 }
      );
    }

    return NextResponse.json(unseenQuestions);
  } catch (error) {
    console.error('Error fetching unseen questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unseen questions' },
      { status: 500 }
    );
  }
} 