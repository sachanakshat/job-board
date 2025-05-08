import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { Job } from '@/lib/models/Job';

export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    await connectDB();
    const job = await Job.findOne({ jobId: params.jobId });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job status' },
      { status: 500 }
    );
  }
} 