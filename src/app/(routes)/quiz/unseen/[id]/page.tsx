'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface QuestionOption {
  text: string;
  value: string;
}

interface Question {
  question: string;
  options: QuestionOption[];
  answer: string;
}

interface UnseenQuestion {
  _id: string;
  passage: string;
  questions: Question[];
}

interface QuizState {
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  showResult: boolean;
  streak: number;
  timeLeft: number;
  correctAnswers: number;
  incorrectAnswers: number;
  isComplete: boolean;
}

export default function UnseenTraining({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [unseenQuestion, setUnseenQuestion] = useState<UnseenQuestion | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: null,
    currentQuestionIndex: 0,
    score: 0,
    totalQuestions: 0,
    showResult: false,
    streak: 0,
    timeLeft: 60,
    correctAnswers: 0,
    incorrectAnswers: 0,
    isComplete: false,
  });

  useEffect(() => {
    fetchUnseenQuestion();
  }, [params.id]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!quizState.showResult && !quizState.isComplete && quizState.timeLeft > 0) {
      timer = setInterval(() => {
        setQuizState((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (quizState.timeLeft === 0 && !quizState.showResult) {
      handleTimeUp();
    }
    return () => clearInterval(timer);
  }, [quizState.timeLeft, quizState.showResult, quizState.isComplete]);

  const fetchUnseenQuestion = async () => {
    try {
      const response = await fetch(`/api/unseen/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch unseen question');
      const data = await response.json();
      setUnseenQuestion(data);
      setQuizState(prev => ({
        ...prev,
        currentQuestion: data.questions[0],
        totalQuestions: data.questions.length,
        timeLeft: 60,
      }));
    } catch (error) {
      console.error('Error fetching unseen question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (selectedValue: string) => {
    if (!quizState.currentQuestion) return;

    const isCorrect = selectedValue === quizState.currentQuestion.answer;
    const newScore = isCorrect ? quizState.score + (100 / quizState.totalQuestions) : quizState.score;
    const newStreak = isCorrect ? quizState.streak + 1 : 0;
    const newCorrectAnswers = isCorrect ? quizState.correctAnswers + 1 : quizState.correctAnswers;
    const newIncorrectAnswers = isCorrect ? quizState.incorrectAnswers : quizState.incorrectAnswers + 1;

    setQuizState((prev) => ({
      ...prev,
      score: newScore,
      streak: newStreak,
      correctAnswers: newCorrectAnswers,
      incorrectAnswers: newIncorrectAnswers,
      showResult: true,
    }));

    // Move to next question after a delay
    setTimeout(() => {
      if (quizState.currentQuestionIndex < quizState.totalQuestions - 1) {
        setQuizState((prev) => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          currentQuestion: unseenQuestion?.questions[prev.currentQuestionIndex + 1] || null,
          showResult: false,
          timeLeft: 60,
        }));
      } else {
        setQuizState((prev) => ({
          ...prev,
          isComplete: true,
        }));
      }
    }, 2000);
  };

  const handleTimeUp = () => {
    if (!quizState.currentQuestion) return;

    setQuizState((prev) => ({
      ...prev,
      incorrectAnswers: prev.incorrectAnswers + 1,
      showResult: true,
    }));

    // Move to next question after a delay
    setTimeout(() => {
      if (quizState.currentQuestionIndex < quizState.totalQuestions - 1) {
        setQuizState((prev) => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          currentQuestion: unseenQuestion?.questions[prev.currentQuestionIndex + 1] || null,
          showResult: false,
          timeLeft: 60,
        }));
      } else {
        setQuizState((prev) => ({
          ...prev,
          isComplete: true,
        }));
      }
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!unseenQuestion || !quizState.currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Question Not Found</h2>
          <p className="text-gray-600">
            The requested unseen question could not be found.
          </p>
          <button
            onClick={() => router.push('/quiz/unseen')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Selection
          </button>
        </div>
      </div>
    );
  }

  if (quizState.isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Quiz Complete!</h2>
            
            <div className="mb-8">
              <div className="text-6xl font-bold text-indigo-600 mb-2">{Math.round(quizState.score)}%</div>
              <p className="text-gray-600 text-xl">
                {quizState.correctAnswers} correct answers out of {quizState.totalQuestions} questions
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-600 mb-1">{quizState.correctAnswers}</div>
                <div className="text-green-800">Correct Answers</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-red-600 mb-1">{quizState.incorrectAnswers}</div>
                <div className="text-red-800">Incorrect Answers</div>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/quiz/unseen')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Unseen English</h2>
            <p className="text-gray-600">
              Score: {Math.round(quizState.score)}% ({quizState.correctAnswers}/{quizState.totalQuestions})
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
              style={{ width: `${(quizState.currentQuestionIndex / quizState.totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Passage:</h3>
            <p className="text-gray-700 leading-relaxed">{unseenQuestion.passage}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Question {quizState.currentQuestionIndex + 1} of {quizState.totalQuestions}
            </h3>
            <p className="text-lg text-gray-700 mb-6">{quizState.currentQuestion.question}</p>

            <div className="grid grid-cols-1 gap-4">
              {quizState.currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !quizState.showResult && handleAnswer(option.value)}
                  disabled={quizState.showResult}
                  className={`p-4 rounded-lg text-left transition-all duration-200 ${
                    quizState.showResult
                      ? option.value === quizState.currentQuestion?.answer
                        ? 'bg-green-100 text-green-800 border-2 border-green-500'
                        : 'bg-gray-100 text-gray-800'
                      : 'bg-white border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                  }`}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 