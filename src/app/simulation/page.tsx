'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SimulationState {
  answers: { [key: number]: number };
  timeLeft: number;
  isFinished: boolean;
  isMapView: boolean;
}

export default function SimulationMode() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [simulationState, setSimulationState] = useState<SimulationState>({
    answers: {},
    timeLeft: 45 * 60, // 45 minutes in seconds
    isFinished: false,
    isMapView: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await fetch('/api/auth/me');
        if (!userResponse.ok) {
          router.push('/login');
          return;
        }
        const userData = await userResponse.json();
        setUser(userData.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    if (!simulationState.isFinished && simulationState.timeLeft > 0) {
      const timer = setInterval(() => {
        setSimulationState((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
          isFinished: prev.timeLeft <= 1,
        }));
      }, 1000);
      return () => clearInterval(timer);
    } else if (simulationState.timeLeft <= 0) {
      handleSubmit();
    }
  }, [simulationState.timeLeft, simulationState.isFinished]);

  const handleAnswer = (questionNumber: number, answer: number) => {
    setSimulationState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionNumber]: answer,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setSimulationState((prev) => ({ ...prev, isFinished: true }));

    try {
      await fetch('/api/simulation-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          answers: simulationState.answers,
          timeSpent: 45 * 60 - simulationState.timeLeft,
        }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleView = () => {
    setSimulationState(prev => ({
      ...prev,
      isMapView: !prev.isMapView
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Navigation - Always visible */}
      <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">PsychoPrep</Link>
          <div className="flex items-center gap-8">
            <Link href="/" className="text-gray-600">אזור מילים</Link>
            <Link href="/" className="text-gray-600">תרגול</Link>
            <Link href="/" className="text-gray-600">התקדמות</Link>
          </div>
        </div>
      </nav>

      {/* Controls Bar */}
      <div className="fixed top-[56px] left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center backdrop-blur-sm bg-white/20">
          <button
            onClick={handleSubmit}
            disabled={simulationState.isFinished}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
          >
            הגש מבחן
          </button>
          <div className="text-gray-800">
            זמן נותר: {formatTime(simulationState.timeLeft)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pt-[90px] pb-[180px]">
        <div className="px-16 py-4">
          <p className="text-gray-700 mb-8 text-right">
            בחלק זה מוצגים משפטים עם מילה או מילים חסרות. עבור כל שאלה, בחר את התשובה המתאימה ביותר להשלמת המשפט.
          </p>
          
          {/* Questions */}
          {Array.from({ length: 22 }, (_, i) => (
            <div key={i} className="mb-6">
              <div className="flex justify-end gap-2 mb-2">
                <p className="font-semibold">{i + 1}.</p>
              </div>
              <p className="text-gray-800 text-right">
                זוהי שאלה מספר {i + 1}. התשובה _____ היא התשובה הנכונה.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Answer Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-between items-center px-4 py-1 border-b">
          <p className="text-sm text-gray-600">
            שאלות שנענו: {Object.keys(simulationState.answers).length}/22
          </p>
          <button
            onClick={toggleView}
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
          >
            {simulationState.isMapView ? 'תצוגת רשת' : 'תצוגת מפה'}
          </button>
        </div>

        {simulationState.isMapView ? (
          // Map View
          <div className="p-4 grid grid-cols-11 gap-2">
            {Array.from({ length: 22 }, (_, i) => (
              <div key={i} className="relative">
                <div className="text-xs font-medium mb-1 text-center">{i + 1}</div>
                <div className="grid grid-rows-4 gap-1">
                  {['א', 'ב', 'ג', 'ד'].map((option, j) => (
                    <button
                      key={option}
                      onClick={() => !simulationState.isFinished && handleAnswer(i + 1, j + 1)}
                      disabled={simulationState.isFinished}
                      className={`h-6 flex items-center justify-center text-xs rounded
                        ${simulationState.answers[i + 1] === j + 1
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                        } ${simulationState.isFinished ? 'cursor-not-allowed' : ''}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Grid View
          <div className="overflow-x-auto whitespace-nowrap px-4 py-2">
            <div className="flex gap-1 min-w-max">
              {Array.from({ length: 22 }, (_, i) => (
                <div key={i} className="flex flex-col items-center w-10">
                  <span className="text-xs font-medium mb-1">{i + 1}</span>
                  {['א', 'ב', 'ג', 'ד'].map((option, j) => (
                    <button
                      key={option}
                      onClick={() => !simulationState.isFinished && handleAnswer(i + 1, j + 1)}
                      disabled={simulationState.isFinished}
                      className={`w-8 h-7 mb-1 flex items-center justify-center text-sm rounded
                        ${simulationState.answers[i + 1] === j + 1
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                        } ${simulationState.isFinished ? 'cursor-not-allowed' : ''}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 