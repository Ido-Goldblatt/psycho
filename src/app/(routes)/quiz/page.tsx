'use client';

import Link from 'next/link';

export default function QuizHome() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="text-center max-w-3xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          תרגול אוצר מילים
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          בחר את מצב התרגול המועדף עליך
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            href="/quiz/practice"
            className="group p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:border-indigo-200 hover:bg-white/80 transition-all duration-300"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">תרגול חופשי</h2>
              <p className="text-gray-600 text-center">
                תרגול מילים חדשות ומעקב אחר ההתקדמות. מתאים לאימון יומיומי ולמידת מילים חדשות
              </p>
            </div>
          </Link>

          <Link
            href="/quiz/review"
            className="group p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:border-green-200 hover:bg-white/80 transition-all duration-300"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">חזרה ושינון</h2>
              <p className="text-gray-600 text-center">
                התמקדות במילים שדורשות חזרה. חיזוק הזיכרון ושיפור היכולת
              </p>
            </div>
          </Link>

          <Link
            href="/quiz/stats"
            className="group p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:border-purple-200 hover:bg-white/80 transition-all duration-300"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">סטטיסטיקות</h2>
              <p className="text-gray-600 text-center">
                צפייה בהתקדמות הלמידה, מעקב אחר שיפורים וזיהוי תחומים לשיפור
              </p>
            </div>
          </Link>

          <div className="group p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">בקרוב</h2>
              <p className="text-gray-600 text-center">
                מצב אתגר עם מגבלת זמן ורמות קושי. עקבו אחר העדכונים!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 