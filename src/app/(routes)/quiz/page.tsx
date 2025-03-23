'use client';

import { useState } from 'react';

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState('5:00');

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">תרגול</h1>
        <div className="text-lg font-medium text-gray-600">
          שאלה {currentQuestion} מתוך 10
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-medium text-gray-700">ניקוד: {score}</span>
          <span className="text-lg font-medium text-gray-700">זמן נותר: {timeLeft}</span>
        </div>

        <div className="space-y-6">
          <div className="text-xl text-gray-800 mb-6">
            בחר את התרגום הנכון למילה: "Ephemeral"
          </div>

          <div className="space-y-4">
            {[
              'קבוע, יציב',
              'חולף, זמני',
              'מהיר, זריז',
              'איטי, מתון'
            ].map((answer, index) => (
              <button
                key={index}
                className="w-full text-right p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {answer}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            disabled={currentQuestion === 1}
            className="px-6 py-3 text-base font-medium rounded-lg border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            שאלה קודמת
          </button>
          <button
            className="px-6 py-3 text-base font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            שאלה הבאה
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">סטטיסטיקה</h2>
          <div className="space-y-3">
            <p className="text-gray-600">תשובות נכונות: {score}/10</p>
            <p className="text-gray-600">זמן שנותר: {timeLeft}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentQuestion / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">טיפים לפתרון</h2>
          <ul className="space-y-2 text-gray-600 list-disc list-inside">
            <li>קרא את השאלה בעיון לפני שתענה</li>
            <li>שים לב להקשר ולדוגמאות</li>
            <li>אם אינך בטוח, נסה לפסול תשובות שבוודאות אינן נכונות</li>
            <li>נהל את הזמן שלך בחוכמה</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 