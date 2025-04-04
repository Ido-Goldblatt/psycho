import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ErrorModel from '@/models/Error';
import { verifyToken } from '@/lib/auth';

async function logErrorToDB(errorData: {
  statusCode: number;
  path: string;
  method: string;
  message: string;
  stack?: string;
  user?: string | null;
  requestBody?: any;
  queryParams?: any;
  headers?: any;
}) {
  try {
    // Log to console first
    console.log('=== Error Logging Start ===');
    console.log('Error Data:', JSON.stringify(errorData, null, 2));
    
    // Connect to DB
    const db = await connectDB();
    console.log('DB Connection Status:', db ? 'Connected' : 'Failed');

    // Create error document
    const errorDoc = await ErrorModel?.create(errorData);
    console.log('Error Document Created:', errorDoc?._id);
    console.log('=== Error Logging End ===');
  } catch (error: any) {
    console.error('Error Logging Failed:', {
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
      name: error?.name || 'Unknown error type'
    });
  }
}

// Server-side error handler
export async function handleApiError(
  error: Error,
  request: Request,
  statusCode: number = 500
) {
  console.log('=== API Error Handling Start ===');
  console.log('Request URL:', request.url);
  console.log('Request Method:', request.method);
  console.log('Error Status Code:', statusCode);
  console.log('Error Message:', error.message);

  const token = request.headers.get('cookie')?.split(';')
    .find(c => c.trim().startsWith('auth-token='))
    ?.split('=')[1];

  const userId = token ? verifyToken(token)?.userId : null;
  console.log('User ID:', userId);

  let requestBody = null;
  try {
    const clonedRequest = request.clone();
    requestBody = await clonedRequest.json();
    console.log('Request Body:', requestBody);
  } catch (error: any) {
    console.log('No Request Body or Invalid JSON:', error?.message || 'Unknown error');
  }

  const errorData = {
    statusCode,
    path: new URL(request.url).pathname,
    method: request.method,
    message: error.message,
    stack: error.stack,
    user: userId,
    requestBody,
    queryParams: Object.fromEntries(new URL(request.url).searchParams),
    headers: Object.fromEntries(request.headers),
  };

  await logErrorToDB(errorData);
  console.log('=== API Error Handling End ===');

  return NextResponse.json(
    { error: error.message || 'An unexpected error occurred' },
    { status: statusCode }
  );
}

// Client-side error handler
export async function handleClientError(error: Error, path: string) {
  console.log('=== Client Error Handling Start ===');
  console.log('Error Path:', path);
  console.log('Error Message:', error.message);

  const errorData = {
    statusCode: 500,
    path,
    method: 'GET',
    message: error.message,
    stack: error.stack,
    user: null,
    requestBody: null,
    queryParams: {},
    headers: {},
  };

  await logErrorToDB(errorData);
  console.log('=== Client Error Handling End ===');
}

export async function logNon200Response(
  request: Request,
  response: NextResponse,
  message: string
) {
  console.log('=== Non-200 Response Logging Start ===');
  console.log('Response Status:', response.status);
  console.log('Request URL:', request.url);
  console.log('Request Method:', request.method);

  if (response.status >= 200 && response.status < 300) {
    console.log('Skipping logging - Response is successful');
    return response;
  }

  const token = request.headers.get('cookie')?.split(';')
    .find(c => c.trim().startsWith('auth-token='))
    ?.split('=')[1];

  const userId = token ? verifyToken(token)?.userId : null;
  console.log('User ID:', userId);

  let requestBody = null;
  try {
    const clonedRequest = request.clone();
    requestBody = await clonedRequest.json();
    console.log('Request Body:', requestBody);
  } catch (error: any) {
    console.log('No Request Body or Invalid JSON:', error?.message || 'Unknown error');
  }

  const errorData = {
    statusCode: response.status,
    path: new URL(request.url).pathname,
    method: request.method,
    message: message,
    user: userId,
    requestBody,
    queryParams: Object.fromEntries(new URL(request.url).searchParams),
    headers: Object.fromEntries(request.headers),
  };

  await logErrorToDB(errorData);
  console.log('=== Non-200 Response Logging End ===');

  return response;
} 