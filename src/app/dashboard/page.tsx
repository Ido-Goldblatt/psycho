'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Word {
  _id: string;
  english: string;
  hebrew: string;
  example: string;
  category: string;
  difficulty: string;
}

interface Progress {
  _id: string;
  wordId: Word;
  status: string;
  nextReview: string | null;
  reviewCount: number;
}

interface DailyGoal {
  minutes: number;
  completed: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [words, setWords] = useState<Word[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>({ minutes: 30, completed: 15 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch('/api/auth/me');
        if (!userResponse.ok) {
          router.push('/login');
          return;
        }
        const userData = await userResponse.json();
        setUser(userData.user);

        const [wordsResponse, progressResponse] = await Promise.all([
          fetch('/api/words'),
          fetch(`/api/progress?userId=${userData.user.id}`)
        ]);

        const wordsData = await wordsResponse.json();
        const progressData = await progressResponse.json();

        setWords(wordsData);
        setProgress(progressData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const stats = {
    totalWords: words.length,
    learnedWords: progress.filter(p => p.status === 'learned').length,
    inProgress: progress.filter(p => p.status === 'in_progress').length,
    nextReview: progress.filter(p => p.nextReview && new Date(p.nextReview) > new Date()).length,
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            שלום, {user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">הנה סיכום ההתקדמות שלך להיום</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/dashboard/learn" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-6 text-center transition-colors duration-200">
            <h3 className="text-lg font-semibold">התחל ללמוד</h3>
            <p className="mt-1 text-sm text-indigo-100">מילים חדשות מחכות לך</p>
          </Link>
          <Link href="/dashboard/review" className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-6 text-center transition-colors duration-200">
            <h3 className="text-lg font-semibold">חזרה</h3>
            <p className="mt-1 text-sm text-green-100">{stats.nextReview} מילים לחזרה</p>
          </Link>
          <Link href="/dashboard/words" className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-6 text-center transition-colors duration-200">
            <h3 className="text-lg font-semibold">אוצר מילים</h3>
            <p className="mt-1 text-sm text-purple-100">צפה בכל המילים שלך</p>
          </Link>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Daily Goal */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">מטרה יומית</h2>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                    התקדמות
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-indigo-600">
                    {Math.round((dailyGoal.completed / dailyGoal.minutes) * 100)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                <div 
                  style={{ width: `${(dailyGoal.completed / dailyGoal.minutes) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                ></div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                {dailyGoal.completed} מתוך {dailyGoal.minutes} דקות של למידה
              </p>
            </div>
          </div>

          {/* Learning Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">סטטיסטיקות</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">{stats.learnedWords}</p>
                <p className="text-sm text-gray-600">מילים שנלמדו</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
                <p className="text-sm text-gray-600">בתהליך למידה</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">פעילות אחרונה</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {progress.slice(0, 5).map((item) => (
              <div key={item._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.wordId.english}</p>
                    <p className="text-sm text-gray-500">{item.wordId.hebrew}</p>
                  </div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.status === 'learned' ? 'bg-green-100 text-green-800' :
                    item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status === 'learned' ? 'נלמד' : 
                     item.status === 'in_progress' ? 'בתהליך' : 
                     'לא התחיל'}
                  </span>
                </div>
                {item.nextReview && (
                  <p className="mt-1 text-xs text-gray-500">
                    חזרה הבאה: {new Date(item.nextReview).toLocaleDateString('he-IL')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 