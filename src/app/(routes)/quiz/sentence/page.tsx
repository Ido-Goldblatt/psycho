'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Option {
  id: number;
  text: string;
}

interface Question {
  _id: string;
  sentence: string;
  options: Option[];
  correctOptionId: number;
  beforeBlank: string;
  afterBlank: string;
}

interface QuizState {
  currentQuestion: Question | null;
  score: number;
  totalQuestions: number;
  showResult: boolean;
  streak: number;
  timeLeft: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

export default function SentenceCompletionMode() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: null,
    score: 0,
    totalQuestions: 0,
    showResult: false,
    streak: 0,
    timeLeft: 45, // More time for reading sentences
    correctAnswers: 0,
    incorrectAnswers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndQuestions = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch('/api/auth/me');
        if (!userResponse.ok) {
          router.push('/login');
          return;
        }
        const userData = await userResponse.json();
        setUser(userData.user);

        // Fetch questions
        const response = await fetch('/api/sentence-questions');
        const data = await response.json();
        if (data && data.length > 0) {
          setQuestions(data);
          startNewQuestion(data);
        } else {
          console.error('No questions found in database');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndQuestions();
  }, [router]);

  useEffect(() => {
    if (quizState.timeLeft > 0 && !quizState.showResult) {
      const timer = setInterval(() => {
        setQuizState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearInterval(timer);
    } else if (quizState.timeLeft === 0 && !quizState.showResult) {
      handleAnswer(null);
    }
  }, [quizState.timeLeft, quizState.showResult]);

  const startNewQuestion = (questionList: Question[]) => {
    const currentQuestion = questionList[Math.floor(Math.random() * questionList.length)];
    
    setQuizState((prev) => ({
      ...prev,
      currentQuestion,
      showResult: false,
      timeLeft: 45,
    }));
  };

  const handleAnswer = async (selectedOptionId: number | null) => {
    if (!user || !quizState.currentQuestion) return;
    
    const isCorrect = selectedOptionId === quizState.currentQuestion.correctOptionId;
    const newScore = Math.round((quizState.correctAnswers + (isCorrect ? 1 : 0)) / (quizState.totalQuestions + 1) * 100);
    const newStreak = isCorrect ? quizState.streak + 1 : 0;

    setQuizState((prev) => ({
      ...prev,
      score: newScore,
      totalQuestions: prev.totalQuestions + 1,
      showResult: true,
      streak: newStreak,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      incorrectAnswers: prev.incorrectAnswers + (isCorrect ? 0 : 1),
    }));

    // Post progress
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          questionId: quizState.currentQuestion._id,
          isCorrect,
          type: 'sentence',
          status: isCorrect ? 'learned' : 'in_progress',
          nextReview: isCorrect 
            ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            : new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error posting progress:', error);
    }

    // Wait 2 seconds before showing next question
    setTimeout(() => {
      startNewQuestion(questions);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Questions Available</h2>
          <p className="text-gray-600">
            There are currently no sentence completion questions available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sentence Completion</h2>
            <p className="text-gray-600">
              Score: {quizState.score}% ({quizState.correctAnswers}/{quizState.totalQuestions})
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-indigo-600">Streak: {quizState.streak}</p>
            <p className="text-sm text-gray-500">Time: {quizState.timeLeft}s</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${quizState.score}%` }}
            ></div>
          </div>
        </div>

        {quizState.currentQuestion && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-xl text-gray-900 mb-8 leading-relaxed">
                {quizState.currentQuestion.beforeBlank}
                <span className="mx-2 px-4 py-1 bg-gray-100 rounded">_____</span>
                {quizState.currentQuestion.afterBlank}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {quizState.currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => !quizState.showResult && handleAnswer(option.id)}
                  disabled={quizState.showResult}
                  className={`p-4 rounded-lg text-left transition-all duration-200 ${
                    quizState.showResult
                      ? option.id === quizState.currentQuestion?.correctOptionId
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                      : 'bg-white border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                  }`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 