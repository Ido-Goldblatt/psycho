'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <main>
        {children}
      </main>
    </div>
  );
} 