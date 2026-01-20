import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Request, Response } from 'express';

// Handler for both Vercel and Express
export default async function handler(
  req: VercelRequest | Request,
  res: VercelResponse | Response,
) {
  if (req.method !== 'GET') {
    return (res as any).status(405).json({ message: 'Method not allowed' });
  }

  return (res as any).status(200).json({
    status: 'healthy',
    service: 'spana-email-service',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}
