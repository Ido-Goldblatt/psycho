import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const words = await prisma.word.findMany({
      include: {
        progress: true,
      },
    });
    return NextResponse.json(words);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch words' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const word = await prisma.word.create({
      data: {
        english: body.english,
        hebrew: body.hebrew,
        example: body.example,
        category: body.category,
        difficulty: body.difficulty,
      },
    });
    return NextResponse.json(word);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create word' }, { status: 500 });
  }
} 