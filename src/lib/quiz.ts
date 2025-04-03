export async function trackMistakenWord(wordId: string, word: string, correctAnswer: string, userAnswer: string, quizType: string) {
  try {
    await fetch('/api/mistaken-words', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wordId,
        word,
        correctAnswer,
        userAnswer,
        quizType,
      }),
    });
  } catch (error) {
    console.error('Error tracking mistaken word:', error);
  }
} 