import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { TimeTrackingProvider } from '@/components/TimeTrackingProvider'
import TimeTrackingLayout from '@/components/TimeTrackingLayout'

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
      >
        <TimeTrackingProvider>
          <TimeTrackingLayout>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </TimeTrackingLayout>
        </TimeTrackingProvider>
      </body>
    </html>
  )
}
