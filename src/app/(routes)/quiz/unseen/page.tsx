'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UnseenQuestion {
  _id: string;
  passage: string;
  questions: {
    question: string;
    options: {
      text: string;
      value: string;
    }[];
    answer: string;
  }[];
}

export default function UnseenSelection() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [unseenQuestions, setUnseenQuestions] = useState<UnseenQuestion[]>([]);

  useEffect(() => {
    fetchUnseenQuestions();
  }, []);

  const fetchUnseenQuestions = async () => {
    try {
      const response = await fetch('/api/unseen');
      if (!response.ok) throw new Error('Failed to fetch unseen questions');
      const data = await response.json();
      setUnseenQuestions(data);
    } catch (error) {
      console.error('Error fetching unseen questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Select an Unseen Passage</h2>
        
        {unseenQuestions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No unseen passages available.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {unseenQuestions.map((unseen) => (
              <div
                key={unseen._id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-indigo-500 transition-colors cursor-pointer"
                onClick={() => router.push(`/quiz/unseen/${unseen._id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {unseen.passage.substring(0, 100)}...
                    </h3>
                    <p className="text-sm text-gray-600">
                      {unseen.questions.length} questions
                    </p>
                  </div>
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 