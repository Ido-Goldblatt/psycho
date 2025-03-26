import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Progress from '@/models/Progress';
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
      Progress.find({ userId }).sort({ createdAt: -1 })
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

    for (const entry of progressEntries) {
      const currentDate = new Date(entry.createdAt);
      
      if (!lastDate) {
        currentStreak = 1;
        lastDate = currentDate;
        continue;
      }

      const dayDiff = Math.floor((lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff <= 1) {
        currentStreak++;
      } else {
        if (currentStreak > streak) {
          streak = currentStreak;
        }
        currentStreak = 1;
      }
      
      lastDate = currentDate;
    }

    if (currentStreak > streak) {
      streak = currentStreak;
    }

    // Calculate practice history (last 7 days)
    const practiceHistory = [];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayEntries = progressEntries.filter(p => {
        const entryDate = new Date(p.createdAt);
        return entryDate >= date && entryDate < nextDate;
      });

      if (dayEntries.length > 0) {
        practiceHistory.push({
          date: date.toISOString(),
          correct: dayEntries.filter(p => p.isCorrect).length,
          total: dayEntries.length
        });
      }
    }

    return NextResponse.json({
      totalWords,
      learnedWords,
      inProgressWords,
      averageScore,
      streak,
      lastPracticeDate: progressEntries[0]?.createdAt || null,
      practiceHistory: practiceHistory.reverse()
    });
  } catch (error) {
    console.error('Error fetching progress stats:', error);
    return NextResponse.json({ error: 'Failed to fetch progress stats' }, { status: 500 });
  }
} 