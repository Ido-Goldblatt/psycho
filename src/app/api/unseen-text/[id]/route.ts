import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { UnseenText } from '@/models/UnseenText';

// GET single unseen text question
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const unseenText = await UnseenText.findById(params.id);
    
    if (!unseenText) {
      return NextResponse.json(
        { error: 'Unseen text question not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(unseenText);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch unseen text question' },
      { status: 500 }
    );
  }
}

// PUT update unseen text question
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const unseenText = await UnseenText.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!unseenText) {
      return NextResponse.json(
        { error: 'Unseen text question not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(unseenText);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update unseen text question' },
      { status: 500 }
    );
  }
}

// DELETE unseen text question
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const unseenText = await UnseenText.findByIdAndDelete(params.id);
    
    if (!unseenText) {
      return NextResponse.json(
        { error: 'Unseen text question not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Unseen text question deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete unseen text question' },
      { status: 500 }
    );
  }
} 