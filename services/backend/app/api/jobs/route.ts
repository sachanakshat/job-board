import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { connectDB } from '@/lib/db/mongodb';
import { Job } from '@/lib/models/Job';
import { jobQueue } from '@/lib/queue/jobProcessor';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { board, title, limit = 10 } = body;

    if (!board || !title) {
      return NextResponse.json(
        { error: 'Board and title are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const jobId = uuidv4();
    const job = new Job({
      jobId,
      status: 'pending',
      board,
      title,
      limit,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await job.save();

    // Add job to queue
    await jobQueue.add('scrape', {
      jobId,
      board,
      title,
      limit
    });

    return NextResponse.json({ jobId });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const jobs = await Job.find().sort({ createdAt: -1 });
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
} 