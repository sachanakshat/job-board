import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobList from '../../frontend/components/JobList';

describe('JobList Pagination', () => {
  const mockJobs = Array.from({ length: 25 }, (_, i) => ({
    job_id: `test-${i + 1}`,
    url: `https://example.com/job/${i + 1}`,
    board_type: 'indeed',
    status: i % 2 === 0 ? 'completed' : 'pending',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z'
  }));

  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('renders pagination controls', () => {
    render(
      <JobList
        jobs={mockJobs}
        currentPage={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows correct number of jobs per page', () => {
    render(
      <JobList
        jobs={mockJobs}
        currentPage={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    // Default page size is 10
    const jobRows = screen.getAllByRole('row').slice(1); // Exclude header row
    expect(jobRows).toHaveLength(10);
  });

  it('calls onPageChange when clicking page number', () => {
    render(
      <JobList
        jobs={mockJobs}
        currentPage={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('disables previous button on first page', () => {
    render(
      <JobList
        jobs={mockJobs}
        currentPage={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <JobList
        jobs={mockJobs}
        currentPage={3}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('enables navigation buttons on middle pages', () => {
    render(
      <JobList
        jobs={mockJobs}
        currentPage={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it('shows current page indicator', () => {
    render(
      <JobList
        jobs={mockJobs}
        currentPage={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const currentPageButton = screen.getByText('2');
    expect(currentPageButton).toHaveClass('bg-blue-500', 'text-white');
  });

  it('handles empty job list', () => {
    render(
      <JobList
        jobs={[]}
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText(/no jobs found/i)).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <JobList
        jobs={mockJobs}
        currentPage={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
        isLoading={true}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
}); 