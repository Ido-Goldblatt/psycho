import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Word from '@/models/Word';
import VocabularyProgress from '@/models/VocabularyProgress';
import { getCurrentUserId } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const difficulty = searchParams.get('difficulty') || 'all';
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Build query based on difficulty
    const query: any = {};
    if (difficulty !== 'all') {
      query.difficulty = { $regex: new RegExp(`^${difficulty}$`, 'i') };
    }

    // Get user's progress to exclude words they've already learned
    const userProgress = await VocabularyProgress.find({
      userId,
      status: { $in: ['learned', 'in_progress'] }
    , lastReviewed: { $ne: (new Date()).toISOString().split('T')[0] }
    });
    const learnedWordIds = userProgress.map(p => p.wordId);
    query._id = { $nin: learnedWordIds };

    const totalWords = await Word.countDocuments(query);
    const totalPages = Math.ceil(totalWords / limit);
    const skip = (page - 1) * limit;

    const words = await Word.find(query)
      .sort({ difficulty: 1 })
      .skip(skip)
      .limit(limit);
    console.log('Query:', {
      filters: query,
      pagination: { page, limit, skip },
      excludedWords: learnedWordIds.length,
      totalWords,
      totalPages
    });

    console.log('Results:', {
      wordsReturned: words.length,
      firstWord: words[0] ? { 
        english: words[0].english,
        difficulty: words[0].difficulty 
      } : null,
      lastWord: words[words.length-1] ? {
        english: words[words.length-1].english,
        difficulty: words[words.length-1].difficulty
      } : null
    });
    return NextResponse.json({
      words,
      currentPage: page,
      totalPages,
      hasMore: page < totalPages
    });

  } catch (error) {
    console.error('Error fetching words:', error);
    return NextResponse.json(
      { error: 'Failed to fetch words' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { words } = await request.json();
    await connectDB();

    const createdWords = await Word.insertMany(words);
    return NextResponse.json({
      message: 'Words created successfully',
      words: createdWords
    });
  } catch (error) {
    console.error('Error creating words:', error);
    return NextResponse.json(
      { error: 'Failed to create words' },
      { status: 500 }
    );
  }
}
  
