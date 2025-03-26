import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <Link href="/" className="text-2xl font-bold text-indigo-600">
        PsychoPrep
      </Link>
      <div className="flex gap-6">
        <Link href="/vocabulary" className="text-gray-700 hover:text-gray-900">אוצר מילים</Link>
        <Link href="/practice" className="text-gray-700 hover:text-gray-900">תרגול</Link>
        <Link href="/progress" className="text-gray-700 hover:text-gray-900">התקדמות</Link>
      </div>
    </nav>
  );
} 