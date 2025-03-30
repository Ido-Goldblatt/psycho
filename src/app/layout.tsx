import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PsychoPrep - הכנה למבחן הפסיכומטרי',
  description: 'Learn and practice for the Israeli SAT (Psychometric) exam',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body 
        className={`${inter.className} min-h-screen bg-gray-50`}
        suppressHydrationWarning
        style={{alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column'}}
      >
          <Navbar />
          <main className="container  px-4 py-8" style={{width: '90%', maxWidth: '1280px' }}>
            {children}
          </main>
      </body>
    </html>
  )
}
