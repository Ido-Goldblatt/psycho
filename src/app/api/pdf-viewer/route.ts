import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filePath = searchParams.get('file');

    if (!filePath) {
      return new NextResponse('File path is required', { status: 400 });
    }

    // Remove any leading slashes and normalize the path
    const normalizedPath = filePath.replace(/^\/+/, '');
    const fullPath = join(process.cwd(), normalizedPath);

    try {
      const fileBuffer = await readFile(fullPath);

      // Set the appropriate headers for PDF
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline',
        },
      });
    } catch (error) {
      console.error('Error reading PDF file:', error);
      return new NextResponse('PDF file not found', { status: 404 });
    }
  } catch (error) {
    console.error('Error serving PDF:', error);
    return new NextResponse('Failed to serve PDF', { status: 500 });
  }
} 