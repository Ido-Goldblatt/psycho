'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center px-2 py-2"
            >
              <span className="text-2xl font-bold text-indigo-600">PsychoPrep</span>
            </Link>
          </div>
          
          <div className="flex space-x-8 items-center">
            <Link 
              href="/vocabulary" 
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${isActive('/vocabulary') 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'}`}
            >
              אוצר מילים
            </Link>
            <Link 
              href="/quiz" 
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${isActive('/quiz') 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'}`}
            >
              תרגול
            </Link>
            <Link 
              href="/simulation" 
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${isActive('/simulation') 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'}`}
            >
              סימולציה
            </Link>
            <Link 
              href="/dashboard" 
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${isActive('/dashboard') 
                  ? 'text-indigo-600 bg-indigo-50' 
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'}`}
            >
              התקדמות
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 