import mongoose from 'mongoose';

export interface IJob {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  board: string;
  title: string;
  limit: number;
  result?: any;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new mongoose.Schema<IJob>({
  jobId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    required: true
  },
  board: { type: String, required: true },
  title: { type: String, required: true },
  limit: { type: Number, required: true },
  result: { type: mongoose.Schema.Types.Mixed },
  error: { type: String },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
});

export const Job = mongoose.models.Job || mongoose.model<IJob>('Job', jobSchema); 