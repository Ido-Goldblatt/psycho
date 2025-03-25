'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  beforeBlank: string;
  afterBlank: string;
  options: Option[];
  correctOptionId: number;
}

interface SimulationState {
  answers: { [key: number]: number | null };
  showResults: boolean;
  timeLeft: number;
  isFinished: boolean;
}

export default function SimulationMode() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [simulationState, setSimulationState] = useState<SimulationState>({
    answers: {},
    showResults: false,
    timeLeft: 45 * 60, // 45 minutes in seconds
    isFinished: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sample questions - in production, these would come from the API
  const questions: Question[] = Array.from({ length: 22 }, (_, i) => ({
    id: i + 1,
    beforeBlank: `This is question number ${i + 1}. The`,
    afterBlank: 'is the correct answer.',
    options: [
      { id: 1, text: `Option A for question ${i + 1}` },
      { id: 2, text: `Option B for question ${i + 1}` },
      { id: 3, text: `Option C for question ${i + 1}` },
      { id: 4, text: `Option D for question ${i + 1}` },
    ],
    correctOptionId: Math.floor(Math.random() * 4) + 1, // Random correct answer for demo
  }));

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
      setSimulationState((prev) => ({ ...prev, isFinished: true }));
    }
  }, [simulationState.timeLeft, simulationState.isFinished]);

  const handleAnswer = (questionId: number, optionId: number) => {
    setSimulationState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: optionId,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setSimulationState((prev) => ({ ...prev, isFinished: true }));

    // Calculate score
    const score = questions.reduce((acc, question) => {
      return acc + (simulationState.answers[question.id] === question.correctOptionId ? 1 : 0);
    }, 0);

    // Post progress
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          type: 'simulation',
          score,
          totalQuestions: questions.length,
          answers: simulationState.answers,
          timeSpent: 45 * 60 - simulationState.timeLeft,
        }),
      });
    } catch (error) {
      console.error('Error posting progress:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-4 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Simulation Mode</h2>
            <p className="text-gray-600">
              Complete all questions within the time limit
            </p>
          </div>
          <div className="text-right">
            <p className={`text-lg font-semibold ${simulationState.timeLeft < 300 ? 'text-red-600' : 'text-indigo-600'}`}>
              Time Left: {formatTime(simulationState.timeLeft)}
            </p>
            <p className="text-sm text-gray-500">
              Questions Answered: {Object.keys(simulationState.answers).length}/22
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {questions.map((question) => (
            <div key={question.id} className="border-b pb-6 last:border-b-0">
              <div className="mb-4">
                <p className="text-lg text-gray-900 mb-2">
                  <span className="font-semibold">Question {question.id}.</span>
                </p>
                <p className="text-lg text-gray-900">
                  {question.beforeBlank}
                  <span className="mx-2 px-4 py-1 bg-gray-100 rounded">_____</span>
                  {question.afterBlank}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => !simulationState.isFinished && handleAnswer(question.id, option.id)}
                    disabled={simulationState.isFinished}
                    className={`p-3 rounded-lg text-left transition-all duration-200 ${
                      simulationState.answers[question.id] === option.id
                        ? 'bg-indigo-100 border-indigo-500'
                        : 'bg-white border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                    } ${
                      simulationState.isFinished
                        ? option.id === question.correctOptionId
                          ? 'bg-green-100 text-green-800 border-green-500'
                          : simulationState.answers[question.id] === option.id
                          ? 'bg-red-100 text-red-800 border-red-500'
                          : ''
                        : ''
                    }`}
                  >
                    <span className="font-medium">{String.fromCharCode(64 + option.id)}.</span> {option.text}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={simulationState.isFinished}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
          >
            Submit Test
          </button>
        </div>

        {simulationState.isFinished && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Results</h3>
            <p className="text-lg text-gray-700">
              Score: {questions.reduce((acc, q) => acc + (simulationState.answers[q.id] === q.correctOptionId ? 1 : 0), 0)}/22
            </p>
            <p className="text-gray-600">
              Time taken: {formatTime(45 * 60 - simulationState.timeLeft)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 