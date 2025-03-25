'use client';

import { useState, useEffect } from 'react';

interface Word {
  _id: string;
  english: string;
  hebrew: string;
  example: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function VocabularyPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [reviewMode, setReviewMode] = useState<'learn' | 'review'>('learn');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRandomMode, setIsRandomMode] = useState(false);

  useEffect(() => {
    async function fetchWords() {
      try {
        const response = await fetch('/api/words');
        if (!response.ok) {
          throw new Error('Failed to fetch words');
        }
        const data = await response.json();
        setWords(data);
        setError(null);
      } catch (err) {
        setError('Failed to load vocabulary words. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchWords();
  }, []);

  const categories = ['all', ...new Set(words.map(word => word.category))];
  const filteredWords = selectedCategory === 'all' 
    ? words 
    : words.filter(word => word.category === selectedCategory);

  const getRandomWordIndex = () => {
    return Math.floor(Math.random() * filteredWords.length);
  };

  const currentWord = filteredWords[currentWordIndex];

  const nextWord = () => {
    setShowTranslation(false);
    if (isRandomMode) {
      setCurrentWordIndex(getRandomWordIndex());
    } else {
      setCurrentWordIndex((prev) => (prev + 1) % filteredWords.length);
    }
  };

  const previousWord = () => {
    setShowTranslation(false);
    if (!isRandomMode) {
      setCurrentWordIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
    }
  };

  const toggleRandomMode = () => {
    setIsRandomMode(!isRandomMode);
    if (!isRandomMode) {
      setCurrentWordIndex(getRandomWordIndex());
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vocabulary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-gray-800 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-800 mb-4">No vocabulary words found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">מילון מונחים</h1>
        <div className="flex gap-4">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'כל הקטגוריות' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={toggleRandomMode}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isRandomMode 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isRandomMode ? 'לפי סדר' : 'אקראי'}
          </button>
          <button
            onClick={() => setReviewMode(mode => mode === 'learn' ? 'review' : 'learn')}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
          >
            {reviewMode === 'learn' ? 'מצב חזרה' : 'מצב למידה'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-medium text-gray-500">
            {isRandomMode ? 'מילה אקראית' : `מילה ${currentWordIndex + 1} מתוך ${filteredWords.length}`}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${currentWord.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              currentWord.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'}`}>
            {currentWord.difficulty === 'easy' ? 'קל' : 
             currentWord.difficulty === 'medium' ? 'בינוני' : 'מתקדם'}
          </span>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-indigo-600 mb-4">{currentWord.english}</h2>
            
            {reviewMode === 'learn' ? (
              <div className="space-y-4">
                <p className="text-xl text-gray-800">{currentWord.hebrew}</p>
                <p className="text-gray-600 italic">{currentWord.example}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {!showTranslation ? (
                  <button
                    onClick={() => setShowTranslation(true)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    הצג תרגום
                  </button>
                ) : (
                  <div className="space-y-4 animate-fade-in">
                    <p className="text-xl text-gray-800">{currentWord.hebrew}</p>
                    <p className="text-gray-600 italic">{currentWord.example}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4">
            {!isRandomMode && (
              <button
                onClick={previousWord}
                className="px-6 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← הקודם
              </button>
            )}
            <button
              onClick={nextWord}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {isRandomMode ? 'מילה חדשה' : 'הבא →'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">התקדמות</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">מילים שנלמדו</span>
              <span className="text-gray-800 font-medium">{words.length}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full" 
                style={{ width: `${Math.min((words.length / 100) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">מילים לחזרה</span>
              <span className="text-gray-800 font-medium">{Math.floor(words.length * 0.2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">קטגוריות</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.filter(cat => cat !== 'all').map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-3 rounded-lg text-sm font-medium transition-colors
                  ${selectedCategory === category 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 