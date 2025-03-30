import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Word from '@/models/Word';

const sampleWords = [
  {
    english: "Abandon",
    hebrew: "לנטוש",
    example: "The crew had to abandon the sinking ship.",
    status: "new"
  },
  {
    english: "Brilliant",
    hebrew: "מבריק",
    example: "She came up with a brilliant solution to the problem.",
    status: "new"
  },
  {
    english: "Cautious",
    hebrew: "זהיר",
    example: "Be cautious when driving in bad weather.",
    status: "new"
  },
  {
    english: "Diligent",
    hebrew: "חרוץ",
    example: "The diligent student studied every day.",
    status: "new"
  },
  {
    english: "Eager",
    hebrew: "להוט",
    example: "The eager puppy wagged its tail.",
    status: "new"
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    
    // Clear existing words
    await Word.deleteMany({});
    
    // Insert sample words
    const result = await Word.insertMany(sampleWords);

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      insertedCount: result.length 
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 