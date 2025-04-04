import { NextResponse } from 'next/server';
import { logNon200Response } from '@/lib/errorHandler';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600">The page you are looking for does not exist.</p>
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: '404 - Page Not Found',
  };
}

// This will be called when a 404 error occurs
export async function notFound() {
  // Get the current URL path
  const path = '/'; // Default path
  
  // Create a request object
  const request = new Request(`http://localhost:3000${path}`, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });

  // Create a response object
  const response = new NextResponse(null, { status: 404 });

  // Log the 404 error
  await logNon200Response(request, response, `Page not found: ${path}`);

  return response;
} 