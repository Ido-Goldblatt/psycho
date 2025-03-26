'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

interface Stats {
  totalWords: number;
  learnedWords: number;
  inProgressWords: number;
  averageScore: number;
  streak: number;
}

export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalWords: 0,
    learnedWords: 0,
    inProgressWords: 0,
    averageScore: 0,
    streak: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userResponse = await fetch('/api/auth/me');
        if (!userResponse.ok) {
          router.push('/login');
          return;
        }
        const userData = await userResponse.json();

        const statsResponse = await fetch(`/api/progress/stats?userId=${userData.user.id}`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50" dir="rtl">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 pt-16">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
          ברוכים הבאים לפלטפורמת לימוד האנגלית
        </h1>
        <p className="text-lg text-center text-gray-600 mb-16">
          בחר את מצב הלמידה שלך כדי להתחיל
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Link href="/vocabulary" className="block">
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">אוצר מילים</h2>
              <p className="text-sm text-gray-600 mb-4">למד מילים חדשות</p>
              <div className="text-3xl font-bold text-purple-600">{stats.learnedWords}</div>
              <div className="text-sm text-gray-600">ימי למידה רצופים</div>
            </div>
          </Link>

          <Link href="/practice" className="block">
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">תרגול</h2>
              <p className="text-sm text-gray-600 mb-4">תרגל את הידע שלך</p>
              <div className="text-3xl font-bold text-green-600">{stats.averageScore}%</div>
              <div className="text-sm text-gray-600">דיוק ממוצע</div>
            </div>
          </Link>

          <Link href="/progress" className="block">
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">התקדמות</h2>
              <p className="text-sm text-gray-600 mb-4">צפה בהתקדמות שלך</p>
              <div className="text-3xl font-bold text-indigo-600">{stats.streak}</div>
              <div className="text-sm text-gray-600">מילים שנלמדו</div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
