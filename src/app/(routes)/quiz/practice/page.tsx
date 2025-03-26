'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Word {
  _id: string;
  hebrew: string;
  english: string;
  example: string;
  category: string;
  difficulty: string;
}

interface QuizConfig {
  questionCount: number;
  timePerQuestion: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'all';
  categories: string[];
}

interface QuizState {
  currentWord: Word | null;
  options: Word[];
  score: number;
  questionIndex: number;
  totalQuestions: number;
  showResult: boolean;
  streak: number;
  timeLeft: number;
  correctAnswers: number;
  incorrectAnswers: number;
  showCorrectAnswer: boolean;
  isComplete: boolean;
  filteredWords: Word[];
}

export default function PracticeMode() {
  const router = useRouter();
  const [words, setWords] = useState<Word[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [config, setConfig] = useState<QuizConfig>({
    questionCount: 10,
    timePerQuestion: 30,
    difficulty: 'all',
    categories: [],
  });

  const [quizState, setQuizState] = useState<QuizState>({
    currentWord: null,
    options: [],
    score: 0,
    questionIndex: 0,
    totalQuestions: 0,
    showResult: false,
    streak: 0,
    timeLeft: 30,
    correctAnswers: 0,
    incorrectAnswers: 0,
    showCorrectAnswer: false,
    isComplete: false,
    filteredWords: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Function to generate a meaningful sentence with the word
  const generateSentence = (word: Word): string => {
    if (word.example && word.example.trim().length > 0) {
      // If the example already contains the word, highlight it
      if (word.example.includes(word.hebrew)) {
        return word.example.replace(word.hebrew, `<strong>${word.hebrew}</strong>`);
      }
      // Otherwise, add the word at the beginning
      return `<strong>${word.hebrew}</strong> - ${word.example}`;
    }
    
    // Default sentences if no example is provided
    const sentences = [
      `המילה <strong>${word.hebrew}</strong> היא חלק חשוב באוצר המילים.`,
      `תוכל להשתמש במילה <strong>${word.hebrew}</strong> במגוון הקשרים.`,
      `<strong>${word.hebrew}</strong> היא מילה שימושית בשפה האנגלית.`,
    ];
    
    return sentences[Math.floor(Math.random() * sentences.length)];
  };

  useEffect(() => {
    const fetchUserAndWords = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch('/api/auth/me');
        if (!userResponse.ok) {
          router.push('/login');
          return;
        }
        const userData = await userResponse.json();
        setUser(userData.user);

        // Fetch words
        const response = await fetch('/api/words');
        const data = await response.json();
        if (data && data.length > 0) {
          setWords(data);
          
          // Extract unique categories
          const categories = [...new Set(data.map((word: Word) => word.category))];
          setAvailableCategories(categories.filter((c): c is string => Boolean(c)));
        } else {
          console.error('No words found in database');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndWords();
  }, [router]);

  useEffect(() => {
    if (!isConfiguring && quizState.timeLeft > 0 && !quizState.showResult && !quizState.isComplete) {
      const timer = setInterval(() => {
        setQuizState((prev) => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearInterval(timer);
    } else if (!isConfiguring && quizState.timeLeft === 0 && !quizState.showResult && !quizState.isComplete) {
      handleAnswer(null);
    }
  }, [quizState.timeLeft, quizState.showResult, isConfiguring, quizState.isComplete]);

  const startQuiz = () => {
    // Filter words based on configuration
    let filteredWords = [...words];
    
    if (config.difficulty !== 'all') {
      filteredWords = filteredWords.filter(word => word.difficulty === config.difficulty);
    }
    
    if (config.categories.length > 0) {
      filteredWords = filteredWords.filter(word => config.categories.includes(word.category));
    }

    // Ensure we have enough words for the quiz
    if (filteredWords.length < 4) {
      alert('לא מספיק מילים זמינות עבור הקטגוריות והרמות שנבחרו. אנא שנו את ההגדרות או הוסיפו מילים נוספות.');
      return;
    }

    // If we have fewer words than requested questions, adjust question count
    const questionCount = Math.min(config.questionCount, filteredWords.length);
    
    setQuizState({
      currentWord: null,
      options: [],
      score: 0,
      questionIndex: 0,
      totalQuestions: questionCount,
      showResult: false,
      streak: 0,
      timeLeft: config.timePerQuestion,
      correctAnswers: 0,
      incorrectAnswers: 0,
      showCorrectAnswer: false,
      isComplete: false,
      filteredWords,
    });
    
    setIsConfiguring(false);
    startNewQuestion(filteredWords, 0, questionCount);
  };

  const startNewQuestion = (wordList: Word[], currentIndex: number, totalQuestions: number) => {
    if (currentIndex >= totalQuestions) {
      // Quiz is complete
      setQuizState(prev => ({
        ...prev,
        isComplete: true
      }));
      return;
    }
    
    // Get a random word for this question
    const availableWords = [...wordList];
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const currentWord = availableWords[randomIndex];
    availableWords.splice(randomIndex, 1);
    
    // Get incorrect options
    const otherWords = words.filter((word) => word._id !== currentWord._id);
    const options = [currentWord];
    
    // Add 3 random incorrect options
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * otherWords.length);
      options.push(otherWords[randomIndex]);
      otherWords.splice(randomIndex, 1);
    }

    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    setQuizState((prev) => ({
      ...prev,
      currentWord,
      options,
      questionIndex: currentIndex,
      showResult: false,
      showCorrectAnswer: false,
      timeLeft: config.timePerQuestion,
    }));
  };

  const handleAnswer = async (selectedWord: Word | null) => {
    if (!user) return;
    
    const isCorrect = selectedWord?._id === quizState.currentWord?._id;
    const newScore = Math.round((quizState.correctAnswers + (isCorrect ? 1 : 0)) / (quizState.questionIndex + 1) * 100);
    const newStreak = isCorrect ? quizState.streak + 1 : 0;

    setQuizState((prev) => ({
      ...prev,
      score: newScore,
      showResult: true,
      showCorrectAnswer: true,
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
          wordId: quizState.currentWord?._id,
          isCorrect,
          status: isCorrect ? 'learned' : 'in_progress',
          nextReview: isCorrect 
            ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Review in 24 hours if correct
            : new Date(Date.now() + 30 * 60 * 1000).toISOString(), // Review in 30 minutes if incorrect
        }),
      });
    } catch (error) {
      console.error('Error posting progress:', error);
    }

    // Wait 3 seconds before showing next question
    setTimeout(() => {
      startNewQuestion(
        quizState.filteredWords, 
        quizState.questionIndex + 1,
        quizState.totalQuestions
      );
    }, 3000);
  };

  const resetQuiz = () => {
    setIsConfiguring(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!words || words.length < 4) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">אין מספיק מילים</h2>
          <p className="text-gray-600">
            יש להוסיף לפחות 4 מילים לאוצר המילים לפני התחלת החידון.
          </p>
        </div>
      </div>
    );
  }

  if (isConfiguring) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">הגדרות החידון</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">מספר שאלות</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={config.questionCount}
                  onChange={(e) => setConfig({...config, questionCount: parseInt(e.target.value)})}
                >
                  <option value={5}>5 שאלות</option>
                  <option value={10}>10 שאלות</option>
                  <option value={15}>15 שאלות</option>
                  <option value={20}>20 שאלות</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">זמן לכל שאלה (שניות)</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={config.timePerQuestion}
                  onChange={(e) => setConfig({...config, timePerQuestion: parseInt(e.target.value)})}
                >
                  <option value={15}>15 שניות</option>
                  <option value={30}>30 שניות</option>
                  <option value={45}>45 שניות</option>
                  <option value={60}>60 שניות</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">רמת קושי</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={config.difficulty}
                  onChange={(e) => setConfig({...config, difficulty: e.target.value as 'easy' | 'medium' | 'hard' | 'all'})}
                >
                  <option value="all">כל הרמות</option>
                  <option value="easy">קל</option>
                  <option value="medium">בינוני</option>
                  <option value="hard">קשה</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">קטגוריות</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableCategories.map((category) => (
                    <label key={category} className="flex items-center space-x-2 space-x-reverse p-2 border border-gray-200 rounded-lg">
                      <input 
                        type="checkbox"
                        checked={config.categories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setConfig({...config, categories: [...config.categories, category]});
                          } else {
                            setConfig({...config, categories: config.categories.filter(c => c !== category)});
                          }
                        }}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">אם לא נבחרו קטגוריות, יוצגו מילים מכל הקטגוריות</p>
              </div>
              
              <button
                onClick={startQuiz}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition duration-200"
              >
                התחל את החידון
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizState.isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">סיכום החידון</h2>
            
            <div className="mb-8">
              <div className="text-6xl font-bold text-indigo-600 mb-2">{quizState.score}%</div>
              <p className="text-gray-600 text-xl">
                {quizState.correctAnswers} תשובות נכונות מתוך {quizState.totalQuestions} שאלות
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-600 mb-1">{quizState.correctAnswers}</div>
                <div className="text-green-800">תשובות נכונות</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-red-600 mb-1">{quizState.incorrectAnswers}</div>
                <div className="text-red-800">תשובות שגויות</div>
              </div>
            </div>
            
            <div className="space-x-4 space-x-reverse">
              <button
                onClick={resetQuiz}
                className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition duration-200"
              >
                חידון חדש
              </button>
              <button
                onClick={() => router.push('/quiz')}
                className="py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition duration-200"
              >
                חזרה לעמוד הראשי
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-sm font-medium text-gray-500">שאלה {quizState.questionIndex + 1} מתוך {quizState.totalQuestions}</div>
              <h2 className="text-2xl font-bold text-gray-900">ציון: {quizState.score}%</h2>
            </div>
            <div className="text-right">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className={`text-2xl font-bold ${quizState.timeLeft < 10 ? 'text-red-600' : 'text-indigo-600'}`}>
                  {quizState.timeLeft}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-indigo-600 transition-all duration-300"
                style={{ width: `${(quizState.questionIndex / quizState.totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>

          {quizState.currentWord && (
            <div className="space-y-6">
              <div className="text-center bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {quizState.currentWord.hebrew}
                </h3>
                {quizState.showCorrectAnswer && (
                  <p 
                    className="text-gray-600"
                    dangerouslySetInnerHTML={{ __html: generateSentence(quizState.currentWord) }}
                  ></p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {quizState.options.map((option) => (
                  <button
                    key={option._id}
                    onClick={() => !quizState.showResult && handleAnswer(option)}
                    disabled={quizState.showResult}
                    className={`p-4 rounded-xl text-center transition-all duration-200 ${
                      quizState.showResult
                        ? option._id === quizState.currentWord?._id
                          ? 'bg-green-100 text-green-800 border-2 border-green-500'
                          : quizState.showResult && option._id === quizState.options.find(o => 
                              o._id === option._id && o._id !== quizState.currentWord?._id
                            )?._id
                            ? 'bg-red-100 text-red-800 border-2 border-red-500'
                            : 'bg-white border border-gray-200 text-gray-400'
                        : 'bg-white border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50'
                    }`}
                  >
                    {option.english}
                  </button>
                ))}
              </div>

              {quizState.showCorrectAnswer && (
                <div className="mt-4 p-4 bg-indigo-50 rounded-xl">
                  <div className="font-medium text-indigo-800">המילה הנכונה:</div>
                  <div className="flex justify-between">
                    <div className="text-gray-800">{quizState.currentWord.hebrew}</div>
                    <div className="font-bold text-gray-800">{quizState.currentWord.english}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 