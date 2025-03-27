import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import VocabularyProgress from '@/models/VocabularyProgress';
import Word from '@/models/Word';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await connectDB();

    // Get all words and progress for the user
    const [words, progressEntries] = await Promise.all([
      Word.find(),
      VocabularyProgress.find({ userId }).sort({ createdAt: -1 })
    ]);

    // Calculate total words
    const totalWords = words.length;

    // Calculate learned and in-progress words
    const learnedWords = progressEntries.filter(p => p.status === 'learned').length;
    const inProgressWords = progressEntries.filter(p => p.status === 'in_progress').length;

    // Calculate average score from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentProgress = progressEntries.filter(p => new Date(p.createdAt) > thirtyDaysAgo);
    const averageScore = recentProgress.length > 0
      ? Math.round((recentProgress.filter(p => p.isCorrect).length / recentProgress.length) * 100)
      : 0;

    // Calculate learning streak
    let streak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;

    // Sort progress entries by date
    const sortedProgress = [...progressEntries].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Calculate streak
    for (const entry of sortedProgress) {
      const entryDate = new Date(entry.createdAt);
      const entryDay = entryDate.toDateString();

      if (!lastDate) {
        lastDate = entryDate;
        currentStreak = 1;
        streak = 1;
      } else {
        const lastDay = lastDate.toDateString();
        if (entryDay === lastDay) {
          continue; // Skip same-day entries
        }

        const daysDiff = Math.floor((lastDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          currentStreak++;
          streak = Math.max(streak, currentStreak);
        } else {
          break; // Streak broken
        }
      }
    }

    return NextResponse.json({
      totalWords,
      learnedWords,
      inProgressWords,
      averageScore,
      streak,
      recentProgress: recentProgress.length
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
} 