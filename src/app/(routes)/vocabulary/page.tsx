'use client';

import { useState } from 'react';

interface Word {
  english: string;
  hebrew: string;
  example: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const sampleWords: Word[] = [
  {
    english: 'Ephemeral',
    hebrew: 'חולף, זמני',
    example: 'Social media trends are often ephemeral, lasting only a few days.',
    category: 'Time & Duration',
    difficulty: 'hard'
  },
  {
    english: 'Pragmatic',
    hebrew: 'מעשי, תכליתי',
    example: 'We need a pragmatic approach to solve this problem.',
    category: 'Personality',
    difficulty: 'medium'
  },
  {
    english: 'Ambiguous',
    hebrew: 'דו-משמעי, לא ברור',
    example: 'The contract terms were ambiguous and needed clarification.',
    category: 'Description',
    difficulty: 'medium'
  }
];

export default function VocabularyPage() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [reviewMode, setReviewMode] = useState<'learn' | 'review'>('learn');

  const categories = ['all', ...new Set(sampleWords.map(word => word.category))];
  const filteredWords = selectedCategory === 'all' 
    ? sampleWords 
    : sampleWords.filter(word => word.category === selectedCategory);

  const currentWord = filteredWords[currentWordIndex];

  const nextWord = () => {
    setShowTranslation(false);
    setCurrentWordIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const previousWord = () => {
    setShowTranslation(false);
    setCurrentWordIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">אוצר מילים</h1>
        <div className="flex gap-4">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={() => setReviewMode(mode => mode === 'learn' ? 'review' : 'learn')}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
          >
            {reviewMode === 'learn' ? 'מעבר למצב חזרה' : 'מעבר למצב למידה'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-medium text-gray-500">
            {currentWordIndex + 1} / {filteredWords.length}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${currentWord.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              currentWord.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'}`}>
            {currentWord.difficulty}
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

          <div className="flex justify-between mt-8">
            <button
              onClick={previousWord}
              className="px-6 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← מילה קודמת
            </button>
            <button
              onClick={nextWord}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              מילה הבאה →
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">סטטיסטיקה</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">מילים שנלמדו</span>
              <span className="text-gray-800 font-medium">3/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '3%' }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">מילים לחזרה היום</span>
              <span className="text-gray-800 font-medium">2</span>
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