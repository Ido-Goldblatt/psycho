import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import MistakenWord from '@/models/MistakenWord';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { wordId, word, correctAnswer, userAnswer, quizType } = await req.json();

    if (!wordId || !word || !correctAnswer || !userAnswer || !quizType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if this word was already marked as mistaken for this user
    const existingMistake = await MistakenWord.findOne({
      userId: userId,
      wordId: wordId,
    });

    if (existingMistake) {
      // Update attempts count
      existingMistake.attempts += 1;
      await existingMistake.save();
    } else {
      // Create new mistaken word entry
      await MistakenWord.create({
        userId: userId,
        wordId,
        word,
        correctAnswer,
        userAnswer,
        quizType,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving mistaken word:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const mistakenWords = await MistakenWord.find({
      userId: userId,
    }).sort({ timestamp: -1 });

    return NextResponse.json(mistakenWords);
  } catch (error) {
    console.error('Error fetching mistaken words:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 