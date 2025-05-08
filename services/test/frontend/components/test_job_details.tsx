import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobDetails from '../../frontend/components/JobDetails';

describe('JobDetails', () => {
  const mockJob = {
    job_id: 'test-1',
    url: 'https://example.com/job/1',
    board_type: 'indeed',
    status: 'completed',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:30:00Z',
    result: {
      title: 'Software Engineer',
      company: 'Example Corp',
      location: 'Remote',
      description: 'Job description here',
      salary: '$100k - $150k',
      posted_date: '2024-03-19',
      requirements: ['5+ years experience', 'Python', 'React']
    }
  };

  it('renders job details correctly', () => {
    render(<JobDetails job={mockJob} />);

    // Check basic job info
    expect(screen.getByText(mockJob.job_id)).toBeInTheDocument();
    expect(screen.getByText(mockJob.url)).toBeInTheDocument();
    expect(screen.getByText(mockJob.board_type)).toBeInTheDocument();
    expect(screen.getByText(mockJob.status)).toBeInTheDocument();

    // Check result details
    expect(screen.getByText(mockJob.result.title)).toBeInTheDocument();
    expect(screen.getByText(mockJob.result.company)).toBeInTheDocument();
    expect(screen.getByText(mockJob.result.location)).toBeInTheDocument();
    expect(screen.getByText(mockJob.result.description)).toBeInTheDocument();
    expect(screen.getByText(mockJob.result.salary)).toBeInTheDocument();
    expect(screen.getByText(mockJob.result.posted_date)).toBeInTheDocument();

    // Check requirements
    mockJob.result.requirements.forEach(req => {
      expect(screen.getByText(req)).toBeInTheDocument();
    });
  });

  it('shows loading state', () => {
    render(<JobDetails job={mockJob} isLoading={true} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(<JobDetails job={mockJob} error="Failed to load job details" />);
    expect(screen.getByText(/failed to load job details/i)).toBeInTheDocument();
  });

  it('handles missing result data', () => {
    const jobWithoutResult = {
      ...mockJob,
      status: 'pending',
      result: null
    };

    render(<JobDetails job={jobWithoutResult} />);
    expect(screen.getByText(/no results yet/i)).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(<JobDetails job={mockJob} />);
    expect(screen.getByText(/mar 20, 2024 10:00 am/i)).toBeInTheDocument();
    expect(screen.getByText(/mar 20, 2024 10:30 am/i)).toBeInTheDocument();
  });

  it('shows status badge with correct color', () => {
    render(<JobDetails job={mockJob} />);
    const statusBadge = screen.getByText(mockJob.status);
    expect(statusBadge).toHaveClass('bg-green-100', 'text-green-800');
  });
}); 