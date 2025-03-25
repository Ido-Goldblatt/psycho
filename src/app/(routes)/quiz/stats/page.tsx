'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { NextPage } from 'next';

interface Progress {
  totalWords: number;
  learnedWords: number;
  inProgressWords: number;
  averageScore: number;
  streak: number;
  lastPracticeDate: string;
  practiceHistory: {
    date: string;
    correct: number;
    total: number;
  }[];
}

const StatsPage: NextPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<Progress>({
    totalWords: 0,
    learnedWords: 0,
    inProgressWords: 0,
    averageScore: 0,
    streak: 0,
    lastPracticeDate: '',
    practiceHistory: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userResponse = await fetch('/api/auth/me');
        if (!userResponse.ok) {
          router.push('/login');
          return;
        }

        const progressResponse = await fetch('/api/progress/stats');
        if (progressResponse.ok) {
          const data = await progressResponse.json();
          setProgress(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">סטטיסטיקות למידה</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Overall Progress Card */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">התקדמות כללית</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">מילים שנלמדו</span>
                  <span className="font-semibold">{progress.learnedWords}/{progress.totalWords}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.learnedWords / progress.totalWords) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">מילים בתהליך</span>
                  <span className="font-semibold">{progress.inProgressWords}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-yellow-500 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.inProgressWords / progress.totalWords) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Card */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">הישגים</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-indigo-50 rounded-xl">
                <div className="text-3xl font-bold text-indigo-600 mb-1">{progress.streak}</div>
                <div className="text-gray-600">ימי למידה רצופים</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-1">{progress.averageScore}%</div>
                <div className="text-gray-600">ציון ממוצע</div>
              </div>
            </div>
          </div>
        </div>

        {/* Practice History */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">היסטוריית תרגול</h2>
          <div className="space-y-4">
            {progress.practiceHistory.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl">
                <div className="text-gray-600">{new Date(session.date).toLocaleDateString('he-IL')}</div>
                <div className="flex items-center space-x-4">
                  <div className="text-green-600 font-semibold">
                    {session.correct}/{session.total} תשובות נכונות
                  </div>
                  <div className="text-gray-600">
                    {Math.round((session.correct / session.total) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage; 