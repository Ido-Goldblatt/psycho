'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Word {
  _id: string;
  hebrew: string;
  english: string;
  example: string;
  category: string;
  difficulty: string;
}

interface SentenceQuestion {
  _id: string;
  beforeBlank: string;
  afterBlank: string;
  options: {
    id: number;
    text: string;
  }[];
  correctOptionId: number;
  category: string;
  difficulty: string;
}

interface Progress {
  _id: string;
  wordId?: string;
  questionId?: string;
  type: 'vocabulary' | 'sentence';
  isCorrect: boolean;
  createdAt: string;
}

interface QuizState {
  currentItem: Word | SentenceQuestion | null;
  options: (string | { id: number; text: string; })[];
  score: number;
  totalQuestions: number;
  showResult: boolean;
  streak: number;
  timeLeft: number;
  correctAnswers: number;
  incorrectAnswers: number;
  type: 'vocabulary' | 'sentence';
}

export default function ReviewMode() {
  const router = useRouter();
  const [items, setItems] = useState<(Word | SentenceQuestion)[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    currentItem: null,
    options: [],
    score: 0,
    totalQuestions: 0,
    showResult: false,
    streak: 0,
    timeLeft: 30,
    correctAnswers: 0,
    incorrectAnswers: 0,
    type: 'vocabulary',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch('/api/auth/me');
        if (!userResponse.ok) {
          router.push('/login');
          return;
        }
        const userData = await userResponse.json();
        setUser(userData.user);

        // Fetch both words and sentence questions
        const [wordsResponse, sentenceResponse, progressResponse] = await Promise.all([
          fetch('/api/words'),
          fetch('/api/sentence-questions'),
          fetch(`/api/progress?userId=${userData.user.id}`)
        ]);

        const wordsData = await wordsResponse.json();
        const sentenceData = await sentenceResponse.json();
        const progressData = await progressResponse.json();

        // Combine words and sentence questions
        const allItems = [...wordsData, ...sentenceData];
        
        // Filter items that need review
        const itemsToReview = allItems.filter(item => {
          const itemProgress = progressData.filter((p: Progress) => 
            (p.wordId === item._id && 'hebrew' in item) || 
            (p.questionId === item._id && 'beforeBlank' in item)
          );

          if (itemProgress.length === 0) return true;

          const recentAttempts = itemProgress
            .sort((a: Progress, b: Progress) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, 3);

          const hasRecentIncorrect = recentAttempts.some((p: Progress) => !p.isCorrect);
          const lastAttempt = recentAttempts[0];
          const hoursSinceLastAttempt = lastAttempt ? 
            (Date.now() - new Date(lastAttempt.createdAt).getTime()) / (1000 * 60 * 60) : 
            Infinity;

          return hasRecentIncorrect || hoursSinceLastAttempt >= 24;
        });

        setItems(itemsToReview);
        setProgress(progressData);

        if (itemsToReview.length > 0) {
          startNewQuestion(itemsToReview);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  const startNewQuestion = (itemList: (Word | SentenceQuestion)[]) => {
    const currentItem = itemList[Math.floor(Math.random() * itemList.length)];
    const type = 'hebrew' in currentItem ? 'vocabulary' : 'sentence';
    
    let options;
    if (type === 'vocabulary') {
      const word = currentItem as Word;
      const otherWords = itemList.filter(item => 
        'hebrew' in item && item._id !== word._id
      ) as Word[];
      options = [word.english];
      
      // Add 3 random incorrect options
      for (let i = 0; i < 3 && otherWords.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * otherWords.length);
        options.push(otherWords[randomIndex].english);
        otherWords.splice(randomIndex, 1);
      }
    } else {
      const question = currentItem as SentenceQuestion;
      options = question.options;
    }

    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    setQuizState((prev) => ({
      ...prev,
      currentItem,
      options,
      showResult: false,
      timeLeft: type === 'sentence' ? 45 : 30,
      type,
    }));
  };

  const handleAnswer = async (selectedAnswer: string | number | null) => {
    if (!user || !quizState.currentItem) return;

    let isCorrect = false;
    if (quizState.type === 'vocabulary') {
      const word = quizState.currentItem as Word;
      isCorrect = selectedAnswer === word.english;
    } else {
      const question = quizState.currentItem as SentenceQuestion;
      isCorrect = selectedAnswer === question.correctOptionId;
    }

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
          wordId: quizState.type === 'vocabulary' ? quizState.currentItem._id : undefined,
          questionId: quizState.type === 'sentence' ? quizState.currentItem._id : undefined,
          type: quizState.type,
          isCorrect,
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
      startNewQuestion(items);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Items to Review</h2>
          <p className="text-gray-600 mb-6">
            Great job! You don't have any items that need review right now. Try practicing some new items.
          </p>
          <Link 
            href="/quiz/practice"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Practice Mode
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Review Mode</h2>
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

        {quizState.currentItem && (
          <div className="space-y-6">
            <div className="text-center">
              {quizState.type === 'vocabulary' ? (
                <>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {(quizState.currentItem as Word).hebrew}
                  </h3>
                  <p className="text-gray-600 italic">
                    {(quizState.currentItem as Word).example}
                  </p>
                </>
              ) : (
                <p className="text-xl text-gray-900 mb-8 leading-relaxed">
                  {(quizState.currentItem as SentenceQuestion).beforeBlank}
                  <span className="mx-2 px-4 py-1 bg-gray-100 rounded">_____</span>
                  {(quizState.currentItem as SentenceQuestion).afterBlank}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {quizState.options.map((option, index) => {
                const optionValue = typeof option === 'string' ? option : option.text;
                const optionId = typeof option === 'string' ? option : option.id;
                
                return (
                  <button
                    key={index}
                    onClick={() => !quizState.showResult && handleAnswer(optionId)}
                    disabled={quizState.showResult}
                    className={`p-4 rounded-lg text-left transition-all duration-200 ${
                      quizState.showResult
                        ? (quizState.type === 'vocabulary' 
                            ? optionValue === (quizState.currentItem as Word).english
                            : optionId === (quizState.currentItem as SentenceQuestion).correctOptionId)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        : 'bg-white border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                    }`}
                  >
                    {optionValue}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 