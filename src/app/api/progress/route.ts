import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const progress = await prisma.progress.create({
      data: {
        userId: body.userId,
        wordId: body.wordId,
        status: body.status,
        nextReview: body.nextReview ? new Date(body.nextReview) : null,
      },
    });
    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const progress = await prisma.progress.findMany({
      where: {
        userId: userId,
      },
      include: {
        word: true,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const progress = await prisma.progress.update({
      where: {
        id: body.id,
      },
      data: {
        status: body.status,
        nextReview: body.nextReview ? new Date(body.nextReview) : null,
        reviewCount: {
          increment: 1,
        },
      },
    });
    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
} 