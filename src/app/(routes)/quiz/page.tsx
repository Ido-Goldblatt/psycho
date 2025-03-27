'use client';

import { useRouter } from 'next/navigation';

interface QuizMode {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const quizModes: QuizMode[] = [
  {
    id: 'practice',
    title: 'תרגול חופשי',
    description: 'תרגול אוצר מילים עם הגדרות מותאמות אישית ומשוב מיידי.',
    icon: '📚',
    color: 'bg-blue-500',
  },
  {
    id: 'review',
    title: 'חזרה ושינון',
    description: 'חזרה על מילים שנלמדו ומעקב אחר ההתקדמות לאורך זמן.',
    icon: '🔄',
    color: 'bg-green-500',
  },
  {
    id: 'sentence',
    title: 'השלמת משפטים',
    description: 'השלם משפטים על ידי בחירת המילה או הביטוי הנכון.',
    icon: '✍️',
    color: 'bg-purple-500',
  },
  {
    id: 'simulation',
    title: 'סימולציה',
    description: 'חוויה של מבחן מלא עם מגבלות זמן.',
    icon: '⏱️',
    color: 'bg-red-500',
  },
  {
    id: 'unseen',
    title: 'טקסט לא מוכר',
    description: 'קרא קטעים וענה על שאלות הבנה.',
    icon: '📖',
    color: 'bg-yellow-500',
  },
];

export default function QuizPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">מצבי תרגול</h1>
          <p className="text-lg text-gray-600">
            בחר מצב תרגול כדי להתחיל לתרגל את האנגלית שלך
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizModes.map((mode) => (
            <div
              key={mode.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => router.push(`/quiz/${mode.id}`)}
            >
              <div className={`${mode.color} p-6 text-white`}>
                <div className="text-4xl mb-4">{mode.icon}</div>
                <h2 className="text-2xl font-bold mb-2">{mode.title}</h2>
                <p className="text-white/90">{mode.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 