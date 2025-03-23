import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-indigo-600 mb-6">
          ברוכים הבאים ל-PsychoPrep
        </h1>
        <p className="text-2xl text-gray-600 mb-12">
          הדרך שלך להצלחה במבחן הפסיכומטרי
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/vocabulary" 
            className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 transition-transform">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">אוצר מילים</h2>
            <p className="text-gray-600">למד מילים חדשות ושפר את אוצר המילים שלך</p>
          </Link>
          
          <Link href="/quiz" 
            className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 transition-transform">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">תרגול</h2>
            <p className="text-gray-600">תרגל שאלות ומבחנים אמיתיים</p>
          </Link>
          
          <Link href="/dashboard" 
            className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 transition-transform">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">התקדמות</h2>
            <p className="text-gray-600">עקוב אחר ההתקדמות שלך וזהה תחומים לשיפור</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
