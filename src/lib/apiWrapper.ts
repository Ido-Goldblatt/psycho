import { NextRequest, NextResponse } from 'next/server';
import { logNon200Response } from './errorHandler';

export async function withErrorLogging(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const response = await handler(req);
      
      // If the response is not successful (not in 200-299 range)
      if (response.status < 200 || response.status >= 300) {
        return logNon200Response(
          req,
          response,
          `Request returned status ${response.status}`
        );
      }
      
      return response;
    } catch (error) {
      // If the handler throws an error, return a 500 response
      const errorResponse = NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
      
      return logNon200Response(
        req,
        errorResponse,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };
} 