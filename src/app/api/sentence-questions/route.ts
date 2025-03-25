import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SentenceQuestion from '@/models/SentenceQuestion';

const sampleQuestions = [
  {
    beforeBlank: 'The',
    afterBlank: '"experimental science" was first used in the 13th century by the philosopher Roger Bacon.',
    options: [
      { id: 1, text: 'term' },
      { id: 2, text: 'section' },
      { id: 3, text: 'task' },
      { id: 4, text: 'signal' }
    ],
    correctOptionId: 1,
    difficulty: 'medium',
    category: 'Science History'
  },
  {
    beforeBlank: 'It is said that men are four times more likely to be',
    afterBlank: 'by lightning than women are.',
    options: [
      { id: 1, text: 'swept' },
      { id: 2, text: 'sworn' },
      { id: 3, text: 'struck' },
      { id: 4, text: 'shrunk' }
    ],
    correctOptionId: 3,
    difficulty: 'medium',
    category: 'Natural Phenomena'
  },
  {
    beforeBlank: 'Nineteenth-century scientist Joseph Henry\'s greatest',
    afterBlank: 'to the field of physics was his work on electromagnetism.',
    options: [
      { id: 1, text: 'extravagance' },
      { id: 2, text: 'correspondence' },
      { id: 3, text: 'exploitation' },
      { id: 4, text: 'contribution' }
    ],
    correctOptionId: 4,
    difficulty: 'hard',
    category: 'Science History'
  }
];

export async function GET() {
  try {
    await connectDB();
    let questions = await SentenceQuestion.find().exec();
    
    // If no questions exist, seed the database with sample questions
    if (questions.length === 0) {
      questions = await SentenceQuestion.insertMany(sampleQuestions);
    }
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Failed to fetch sentence questions:', error);
    return NextResponse.json({ error: 'Failed to fetch sentence questions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    
    // Handle single question creation
    if (!Array.isArray(body)) {
      const question = await SentenceQuestion.create({
        beforeBlank: body.beforeBlank,
        afterBlank: body.afterBlank,
        options: body.options,
        correctOptionId: body.correctOptionId,
        difficulty: body.difficulty,
        category: body.category,
      });
      return NextResponse.json(question);
    }
    
    // Handle batch question creation
    const questions = await SentenceQuestion.insertMany(body);
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Failed to create sentence question(s):', error);
    return NextResponse.json({ error: 'Failed to create sentence question(s)' }, { status: 500 });
  }
} 