'use client';

import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useState } from 'react';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: string;
  width?: number;
}

export default function PDFViewer({ file, width }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <Document
      file={file}
      className="w-full flex flex-col items-center"
      onLoadSuccess={onDocumentLoadSuccess}
      loading={
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      }
      error={
        <div className="text-center text-gray-600">
          Error loading PDF. <a href={file} className="text-indigo-600 hover:underline">Download</a> instead.
        </div>
      }
    >
      {Array.from(new Array(numPages), (el, index) => (
        <Page 
          key={`page_${index + 1}`}
          pageNumber={index + 1} 
          className="mb-4"
          width={width || (typeof window !== 'undefined' ? window.innerWidth > 1280 ? 1280 : window.innerWidth : 800)}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          scale={1.0}
        />
      ))}
    </Document>
  );
} 