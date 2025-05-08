import { NextResponse } from 'next/server';
import { scrapeRemoteOK } from '@/lib/scrapers/remoteok';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { board, title, limit = 3 } = body;

    if (!board || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: board and title' },
        { status: 400 }
      );
    }

    if (limit > 10) {
      return NextResponse.json(
        { error: 'Limit cannot exceed 10' },
        { status: 400 }
      );
    }

    let jobs = [];
    switch (board.toLowerCase()) {
      case 'remoteok':
        jobs = await scrapeRemoteOK(title, limit);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid job board specified' },
          { status: 400 }
        );
    }

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error processing job scraping request:', error);
    return NextResponse.json(
      { error: 'Failed to scrape jobs' },
      { status: 500 }
    );
  }
} 