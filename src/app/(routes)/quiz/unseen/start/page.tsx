'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface StartSettings {
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function UnseenTextStartPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<StartSettings>({
    timeLimit: 15,
    difficulty: 'medium'
  });

  const handleStart = () => {
    // Store settings in sessionStorage for the quiz page to access
    sessionStorage.setItem('unseenTextSettings', JSON.stringify(settings));
    router.push('/quiz/unseen');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">הגדרות טקסט לא מוכר</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                מגבלת זמן (דקות)
              </label>
              <select
                value={settings.timeLimit}
                onChange={(e) => setSettings(prev => ({ ...prev, timeLimit: Number(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="5">5 דקות</option>
                <option value="10">10 דקות</option>
                <option value="15">15 דקות</option>
                <option value="20">20 דקות</option>
                <option value="30">30 דקות</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                רמת קושי
              </label>
              <select
                value={settings.difficulty}
                onChange={(e) => setSettings(prev => ({ ...prev, difficulty: e.target.value as StartSettings['difficulty'] }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="easy">קל</option>
                <option value="medium">בינוני</option>
                <option value="hard">קשה</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                onClick={handleStart}
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
              >
                התחל
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 