import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { status } = await request.json();
    
    // Get or create user
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        email: session.user.email,
        name: session.user.name || null,
      },
    });

    // Get or create word
    const word = await prisma.word.upsert({
      where: { id: params.id },
      update: {},
      create: {
        id: params.id,
        english: '', // These will be populated by your word creation process
        hebrew: '',
        example: '',
        category: '',
        difficulty: '',
      },
    });

    // Update or create user word status
    const userWord = await prisma.userWord.upsert({
      where: {
        userId_wordId: {
          userId: user.id,
          wordId: word.id,
        },
      },
      update: {
        status,
        lastReviewed: new Date(),
        nextReviewDate: status === 'learning' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null, // 24 hours from now for learning words
      },
      create: {
        userId: user.id,
        wordId: word.id,
        status,
        lastReviewed: new Date(),
        nextReviewDate: status === 'learning' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null,
      },
    });

    return NextResponse.json(userWord);
  } catch (error) {
    console.error('Error updating word status:', error);
    return NextResponse.json(
      { error: 'Failed to update word status' },
      { status: 500 }
    );
  }
} 