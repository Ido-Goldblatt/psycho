import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SimulationProgress from '@/models/SimulationProgress';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    
    const progress = await SimulationProgress.create({
      userId: body.userId,
      score: body.score,
      totalQuestions: body.totalQuestions,
      answers: body.answers,
      timeSpent: body.timeSpent,
    });
    
    return NextResponse.json(progress);
  } catch (error) {
    console.error('Failed to save simulation progress:', error);
    return NextResponse.json({ error: 'Failed to save simulation progress' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await connectDB();
    const progress = await SimulationProgress.find({ userId })
      .sort({ createdAt: -1 })
      .exec();

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Failed to fetch simulation progress:', error);
    return NextResponse.json({ error: 'Failed to fetch simulation progress' }, { status: 500 });
  }
} 