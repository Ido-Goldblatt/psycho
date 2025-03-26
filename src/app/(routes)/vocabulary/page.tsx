'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const fetchWords = async (page: number = 1, append: boolean = false) => {
    // Prevent duplicate requests
    if (isFetching) return;
    
    try {
      setIsFetching(true);
      setError(null);
      if (!append) {
        setLoading(true);
      }
      
      console.log('Fetching words from API...', { page, append });
      const response = await fetch(`/api/words?page=${page}&limit=20`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch words');
      }
      
      console.log('Fetched words:', data);
      
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
    // Only fetch on initial mount
    fetchWords(1, false);
  }, []); // Empty dependency array to run only once

  const handleAction = async (action: 'known' | 'learning' | 'skip') => {
    if (!currentWord) return;

    try {
      setError(null);
      // Save the user's response
      const response = await fetch(`/api/words/${currentWord._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update word status');
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
      <div className="flex flex-col items-center justify-center h-[50vh] px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">כל הכבוד!</h2>
        <p className="text-gray-600 text-center mb-8">סיימת את כל המילים להיום. חזור מאוחר יותר לתרגול נוסף.</p>
        <button
          onClick={() => {
            setCurrentPage(1);
            fetchWords(1, false);
          }}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          רענן מילים
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-4 px-4">
      <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-4"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-indigo-600 mb-3">{currentWord.english}</h2>
              
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
                  className="space-y-2"
                >
                  <p className="text-lg text-gray-800">{currentWord.hebrew}</p>
                  <p className="text-sm text-gray-600 italic">{currentWord.example}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between gap-3">
          <button
            onClick={() => handleAction('skip')}
            className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            דלג
          </button>
          <button
            onClick={() => handleAction('learning')}
            className="flex-1 py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
          >
            לתרגול
          </button>
          <button
            onClick={() => handleAction('known')}
            className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
          >
            יודע
          </button>
        </div>
      </div>
    </div>
  );
} 