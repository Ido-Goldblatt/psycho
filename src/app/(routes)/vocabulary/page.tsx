'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Word {
  _id: string;
  english: string;
  hebrew: string;
  example: string;
  category: string;
  difficulty: string;
  status?: 'new' | 'learning' | 'known' | 'skip';
  lastReviewed?: Date;
  nextReviewDate?: Date;
}

// Add difficulty options
const DIFFICULTY_OPTIONS = ['all', 'easy', 'medium', 'hard'] as const;
type Difficulty = typeof DIFFICULTY_OPTIONS[number];

// Helper function to format difficulty for display
const formatDifficulty = (difficulty: string): string => {
  const map: Record<string, string> = {
    'all': 'הכל',
    'easy': 'קל',
    'medium': 'בינוני',
    'hard': 'קשה'
  };
  return map[difficulty.toLowerCase()] || difficulty;
};

// Temporary sample words
const sampleWords: Word[] = [
  {
    _id: '1',
    english: "Abandon",
    hebrew: "לנטוש",
    example: "The crew had to abandon the sinking ship.",
    category: "Nouns",
    difficulty: "Easy"
  },
  {
    _id: '2',
    english: "Brilliant",
    hebrew: "מבריק",
    example: "She came up with a brilliant solution to the problem.",
    category: "Adjectives",
    difficulty: "Medium"
  },
  {
    _id: '3',
    english: "Cautious",
    hebrew: "זהיר",
    example: "Be cautious when driving in bad weather.",
    category: "Adverbs",
    difficulty: "Easy"
  },
  {
    _id: '4',
    english: "Diligent",
    hebrew: "חרוץ",
    example: "The diligent student studied every day.",
    category: "Adjectives",
    difficulty: "Medium"
  },
  {
    _id: '5',
    english: "Eager",
    hebrew: "להוט",
    example: "The eager puppy wagged its tail.",
    category: "Adjectives",
    difficulty: "Easy"
  }
];

export default function VocabularyPage() {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [relatedWords, setRelatedWords] = useState<Word[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('all');
  const router = useRouter();

  const fetchWords = async (page: number = 1, append: boolean = false) => {
    if (isFetching) return;
    
    try {
      setIsFetching(true);
      setError(null);
      if (!append) {
        setLoading(true);
      }
      
      const response = await fetch(`/api/words?page=${page}&limit=20&difficulty=${selectedDifficulty}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch words');
      }
      
      if (append) {
        setWords(prev => [...prev, ...data.words]);
      } else {
        setWords(data.words);
        if (data.words.length > 0) {
          setCurrentWord(data.words[0]);
        }
      }
      
      setHasMore(data.hasMore);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching words:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch words');
      if (!append) {
        setWords([]);
        setCurrentWord(null);
      }
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchWords(1, false);
  }, [selectedDifficulty]); // Refetch when difficulty changes

  const handleAction = async (action: 'known' | 'learning' | 'skip') => {
    if (!currentWord) return;

    try {
      setError(null);

      // Save the user's progress
      const progressResponse = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wordId: currentWord._id,
          status: action === 'known' ? 'learned' : action === 'learning' ? 'in_progress' : 'not_started',
          isCorrect: action === 'known',
          nextReview: action === 'learning' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null,
        }),
      });

      if (!progressResponse.ok) {
        if (progressResponse.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error('Failed to save progress');
      }

      // Remove current word from list
      const nextWords = words.filter(w => w._id !== currentWord._id);
      setWords(nextWords);
      
      // If we're running low on words and there are more to fetch, load the next page
      if (nextWords.length < 5 && hasMore && !isLoadingMore && !isFetching) {
        setIsLoadingMore(true);
        await fetchWords(currentPage + 1, true);
      }
      
      setCurrentWord(nextWords[0] || null);
      setShowTranslation(false);
    } catch (error) {
      console.error('Error updating word status:', error);
      setError(error instanceof Error ? error.message : 'Failed to update word status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] px-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">שגיאה!</h2>
        <p className="text-gray-600 text-center mb-8">{error}</p>
        <button
          onClick={() => fetchWords(1, false)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          נסה שוב
        </button>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Difficulty Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold text-gray-900">רמת קושי</h3>
              
            </div>
            <div className="flex gap-3">
              {DIFFICULTY_OPTIONS.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDifficulty === difficulty
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {formatDifficulty(difficulty)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center h-[50vh] px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">כל הכבוד!</h2>
          <p className="text-gray-600 text-center mb-8">סיימת את כל המילים להיום. חזור מאוחר יותר לתרגול נוסף.</p>
          <button
            onClick={() => {
              setCurrentPage(1);
              setSelectedDifficulty('all');
              fetchWords(1, false);
            }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            רענן מילים
          </button>
        </div>

        {/* Study Tips */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">טיפים ללימוד</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">📝</span>
              כתוב משפט משלך עם המילה
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔄</span>
              חזור על המילה במרווחי זמן קבועים
            </li>
            <li className="flex items-start">
              <span className="mr-2">🎯</span>
              נסה להשתמש במילה בשיחה או בכתיבה היום
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔍</span>
              חפש דוגמאות נוספות לשימוש במילה
            </li>
          </ul>
        </div>

        {/* Progress Section */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">התקדמות</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>מילים שנלמדו היום</span>
                  <span>5/20</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-indigo-600 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>רצף ימים</span>
                  <span>3 ימים</span>
                </div>
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3].map((day) => (
                    <div key={day} className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      ✓
                    </div>
                  ))}
                  {[4, 5].map((day) => (
                    <div key={day} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                      ·
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Difficulty Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-semibold text-gray-900">רמת קושי</h3>
            
          </div>
          <div className="flex gap-3">
            {DIFFICULTY_OPTIONS.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDifficulty === difficulty
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {formatDifficulty(difficulty)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[50vh] px-4">
          <h2 className="text-2xl font-bold text-red-600 mb-4">שגיאה!</h2>
          <p className="text-gray-600 text-center mb-8">{error}</p>
          <button
            onClick={() => fetchWords(1, false)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            נסה שוב
          </button>
        </div>
      ) : !currentWord ? (
        <div className="max-w-4xl mx-auto py-8 px-4">
          {/* Difficulty Selector */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold text-gray-900">רמת קושי</h3>
                <a
                  href="/quiz"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  תרגול סימולציה
                </a>
              </div>
              <div className="flex gap-3">
                {DIFFICULTY_OPTIONS.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedDifficulty === difficulty
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {formatDifficulty(difficulty)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center h-[50vh] px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">כל הכבוד!</h2>
            <p className="text-gray-600 text-center mb-8">סיימת את כל המילים להיום. חזור מאוחר יותר לתרגול נוסף.</p>
            <button
              onClick={() => {
                setCurrentPage(1);
                setSelectedDifficulty('all');
                fetchWords(1, false);
              }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              רענן מילים
            </button>
          </div>

          {/* Study Tips */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">טיפים ללימוד</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">📝</span>
                כתוב משפט משלך עם המילה
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔄</span>
                חזור על המילה במרווחי זמן קבועים
              </li>
              <li className="flex items-start">
                <span className="mr-2">🎯</span>
                נסה להשתמש במילה בשיחה או בכתיבה היום
              </li>
              <li className="flex items-start">
                <span className="mr-2">🔍</span>
                חפש דוגמאות נוספות לשימוש במילה
              </li>
            </ul>
          </div>

          {/* Progress Section */}
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">התקדמות</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>מילים שנלמדו היום</span>
                    <span>5/20</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-indigo-600 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>רצף ימים</span>
                    <span>3 ימים</span>
                  </div>
                  <div className="flex justify-center space-x-1">
                    {[1, 2, 3].map((day) => (
                      <div key={day} className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        ✓
                      </div>
                    ))}
                    {[4, 5].map((day) => (
                      <div key={day} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        ·
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Word Card */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-indigo-600 mb-3">{currentWord.english}</h2>
                  <div className="flex justify-center space-x-4 mb-4">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                      {currentWord.category}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                      {currentWord.difficulty}
                    </span>
                  </div>
                  
                  {!showTranslation ? (
                    <button
                      onClick={() => setShowTranslation(true)}
                      className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      הצג תרגום
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <h3 className="text-2xl text-gray-800">{currentWord.hebrew}</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-lg text-gray-700 italic">"{currentWord.example}"</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <button
                    onClick={() => handleAction('skip')}
                    className="py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    דלג
                  </button>
                  <button
                    onClick={() => handleAction('learning')}
                    className="py-3 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                  >
                    לתרגול
                  </button>
                  <button
                    onClick={() => handleAction('known')}
                    className="py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    יודע
                  </button>
                </div>
              </div>

              {/* Study Tips */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">טיפים ללימוד</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">📝</span>
                    כתוב משפט משלך עם המילה
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🔄</span>
                    חזור על המילה במרווחי זמן קבועים
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🎯</span>
                    נסה להשתמש במילה בשיחה או בכתיבה היום
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🔍</span>
                    חפש דוגמאות נוספות לשימוש במילה
                  </li>
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Related Words */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">מילים קשורות</h3>
                <div className="space-y-3">
                  {currentWord.category === 'Literature' && (
                    <>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800">Prose</p>
                        <p className="text-sm text-gray-600">פרוזה, כתיבה</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800">Sonnet</p>
                        <p className="text-sm text-gray-600">סונטה</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800">Verse</p>
                        <p className="text-sm text-gray-600">שיר, פסוק</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Usage Examples */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">דוגמאות שימוש</h3>
                <div className="space-y-3 text-gray-700">
                  <p>• The elegiac poetry of the 19th century</p>
                  <p>• An elegiac tribute to fallen soldiers</p>
                  <p>• The music had an elegiac quality</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Section - Moved to Bottom */}
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">התקדמות</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>מילים שנלמדו היום</span>
                    <span>5/20</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-indigo-600 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>רצף ימים</span>
                    <span>3 ימים</span>
                  </div>
                  <div className="flex justify-center space-x-1">
                    {[1, 2, 3].map((day) => (
                      <div key={day} className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        ✓
                      </div>
                    ))}
                    {[4, 5].map((day) => (
                      <div key={day} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        ·
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 