'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  name: string;
  email: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ברוכים הבאים לפלטפורמת לימוד האנגלית
          </h1>
          <p className="text-xl text-gray-600">
            בחר את מצב הלמידה שלך כדי להתחיל
          </p>
        </div>

        {/* Learning Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link href="/learn/vocabulary" className="group">
            <div className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-200 hover:scale-105">
              <div className="text-indigo-600 text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">אוצר מילים</h3>
              <p className="text-gray-600">למד מילים חדשות והרחב את אוצר המילים שלך</p>
            </div>
          </Link>

          <Link href="/learn/grammar" className="group">
            <div className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-200 hover:scale-105">
              <div className="text-indigo-600 text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">דקדוק</h3>
              <p className="text-gray-600">שפר את הדקדוק שלך עם תרגילים אינטראקטיביים</p>
            </div>
          </Link>

          <Link href="/learn/conversation" className="group">
            <div className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-200 hover:scale-105">
              <div className="text-indigo-600 text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">שיחה</h3>
              <p className="text-gray-600">תרגל שיחה באנגלית עם תרחישים מהחיים</p>
            </div>
          </Link>
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">התקדמות הלמידה שלך</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">0</div>
              <div className="text-gray-600">מילים נלמדו</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">0</div>
              <div className="text-gray-600">תרגילים הושלמו</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">0</div>
              <div className="text-gray-600">דקות למידה</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">0</div>
              <div className="text-gray-600">שיעורים הושלמו</div>
            </div>
          </div>
        </div>

        {/* Daily Goal Progress */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">מטרת יומית</h2>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-indigo-600 h-4 rounded-full" style={{ width: '0%' }}></div>
          </div>
          <p className="text-center text-gray-600 mt-2">0/30 דקות של למידה היום</p>
        </div>
      </div>
    </div>
  );
}
