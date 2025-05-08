import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import JobList from '../../frontend/components/JobList';

describe('JobList', () => {
  const mockJobs = [
    {
      job_id: 'test-1',
      url: 'https://example.com/job/1',
      board_type: 'indeed',
      status: 'pending',
      created_at: '2024-03-20T10:00:00Z',
      updated_at: '2024-03-20T10:00:00Z'
    },
    {
      job_id: 'test-2',
      url: 'https://example.com/job/2',
      board_type: 'linkedin',
      status: 'completed',
      created_at: '2024-03-20T11:00:00Z',
      updated_at: '2024-03-20T11:30:00Z',
      result: {
        title: 'Software Engineer',
        company: 'Example Corp',
        location: 'Remote'
      }
    }
  ];

  const mockOnDelete = jest.fn();
  const mockOnRefresh = jest.fn();

  beforeEach(() => {
    mockOnDelete.mockClear();
    mockOnRefresh.mockClear();
  });

  it('renders the job list with all jobs', () => {
    render(
      <JobList
        jobs={mockJobs}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
      />
    );

    // Check table headers
    expect(screen.getByText(/job id/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/created at/i)).toBeInTheDocument();
    expect(screen.getByText(/actions/i)).toBeInTheDocument();

    // Check job rows
    mockJobs.forEach(job => {
      expect(screen.getByText(job.job_id)).toBeInTheDocument();
      expect(screen.getByText(job.status)).toBeInTheDocument();
    });
  });

  it('shows empty state when no jobs', () => {
    render(
      <JobList
        jobs={[]}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
      />
    );

    expect(screen.getByText(/no jobs found/i)).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', async () => {
    render(
      <JobList
        jobs={mockJobs}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
      />
    );

    // Click delete button for first job
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    // Verify confirmation dialog
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    // Verify onDelete was called
    expect(mockOnDelete).toHaveBeenCalledWith(mockJobs[0].job_id);
  });

  it('calls onRefresh when refresh button is clicked', async () => {
    render(
      <JobList
        jobs={mockJobs}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
      />
    );

    // Click refresh button
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);

    // Verify onRefresh was called
    expect(mockOnRefresh).toHaveBeenCalled();
  });

  it('shows job details when expand button is clicked', async () => {
    render(
      <JobList
        jobs={mockJobs}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
      />
    );

    // Click expand button for second job (has result)
    const expandButtons = screen.getAllByRole('button', { name: /expand/i });
    fireEvent.click(expandButtons[1]);

    // Verify job details are shown
    expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/example corp/i)).toBeInTheDocument();
    expect(screen.getByText(/remote/i)).toBeInTheDocument();
  });

  it('shows loading state during refresh', async () => {
    render(
      <JobList
        jobs={mockJobs}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
        isLoading={true}
      />
    );

    // Verify loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh/i })).toBeDisabled();
  });

  it('shows error state when refresh fails', async () => {
    render(
      <JobList
        jobs={mockJobs}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
        error="Failed to load jobs"
      />
    );

    // Verify error message
    expect(screen.getByText(/failed to load jobs/i)).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(
      <JobList
        jobs={mockJobs}
        onDelete={mockOnDelete}
        onRefresh={mockOnRefresh}
      />
    );

    // Check formatted dates
    expect(screen.getByText(/mar 20, 2024 10:00 am/i)).toBeInTheDocument();
    expect(screen.getByText(/mar 20, 2024 11:00 am/i)).toBeInTheDocument();
  });
}); 