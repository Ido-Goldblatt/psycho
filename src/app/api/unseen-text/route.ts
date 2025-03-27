import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UnseenText } from '@/models/UnseenText';

// GET all unseen text questions
export async function GET() {
  try {
    await connectToDatabase();
    const unseenTexts = await UnseenText.find({}).sort({ createdAt: -1 });
    return NextResponse.json(unseenTexts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch unseen text questions' },
      { status: 500 }
    );
  }
}

// POST new unseen text question
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const unseenText = await UnseenText.create(body);
    return NextResponse.json(unseenText, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create unseen text question' },
      { status: 500 }
    );
  }
} 