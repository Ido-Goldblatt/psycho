import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { PDFDocument, PDFPage } from 'pdf-lib';

declare global {
  var simulationConfig: {
    answerCount: number;
    timeLimit: number;
    filePath: string;
  } | undefined;
}

interface Question {
  id: number;
  text: string;
  options: string[];
}

export async function GET() {
  try {
    if (!global.simulationConfig?.filePath) {
      throw new Error('No file path configured');
    }

    const filePath = join(process.cwd(), global.simulationConfig.filePath);
    const pdfBytes = await readFile(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Extract text from the PDF
    const pages = pdfDoc.getPages();
    const text = await Promise.all(pages.map(async (page: PDFPage) => {
      const { width, height } = page.getSize();
      const textContent = await page.getTextContent();
      return textContent;
    }));

    // Process the text content to extract questions
    // This is a placeholder - you'll need to implement the actual question extraction logic
    // based on your PDF structure
    const questions: Question[] = text.map((content: string, index: number) => ({
      id: index + 1,
      text: content, // You'll need to parse this properly based on your PDF structure
      options: ['א', 'ב', 'ג', 'ד'],
    }));

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error reading questions:', error);
    return NextResponse.json(
      { error: 'Failed to load questions' },
      { status: 500 }
    );
  }
} 