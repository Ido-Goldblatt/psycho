import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

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
    const { db } = await connectToDatabase();
    
    // Clear existing words
    await db.collection('words').deleteMany({});
    
    // Insert sample words
    const result = await db.collection('words').insertMany(sampleWords);

    return NextResponse.json({ 
      message: 'Database seeded successfully',
      insertedCount: result.insertedCount 
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 