import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobList from '../../frontend/components/JobList';

describe('JobList Sorting', () => {
  const mockJobs = [
    {
      job_id: 'test-1',
      url: 'https://example.com/job/1',
      board_type: 'indeed',
      status: 'completed',
      created_at: '2024-03-20T10:00:00Z',
      updated_at: '2024-03-20T10:30:00Z'
    },
    {
      job_id: 'test-2',
      url: 'https://example.com/job/2',
      board_type: 'linkedin',
      status: 'pending',
      created_at: '2024-03-20T11:00:00Z',
      updated_at: '2024-03-20T11:00:00Z'
    },
    {
      job_id: 'test-3',
      url: 'https://example.com/job/3',
      board_type: 'glassdoor',
      status: 'failed',
      created_at: '2024-03-20T09:00:00Z',
      updated_at: '2024-03-20T09:15:00Z'
    }
  ];

  const mockOnSort = jest.fn();

  beforeEach(() => {
    mockOnSort.mockClear();
  });

  it('renders sortable column headers', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSort={mockOnSort}
        sortField="created_at"
        sortDirection="desc"
      />
    );

    expect(screen.getByText(/job id/i)).toHaveAttribute('aria-sort');
    expect(screen.getByText(/status/i)).toHaveAttribute('aria-sort');
    expect(screen.getByText(/created at/i)).toHaveAttribute('aria-sort');
  });

  it('calls onSort when clicking sortable column', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSort={mockOnSort}
        sortField="created_at"
        sortDirection="desc"
      />
    );

    const statusHeader = screen.getByText(/status/i);
    fireEvent.click(statusHeader);

    expect(mockOnSort).toHaveBeenCalledWith('status', 'asc');
  });

  it('toggles sort direction on same column', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSort={mockOnSort}
        sortField="created_at"
        sortDirection="desc"
      />
    );

    const createdHeader = screen.getByText(/created at/i);
    fireEvent.click(createdHeader);

    expect(mockOnSort).toHaveBeenCalledWith('created_at', 'asc');
  });

  it('shows sort direction indicator', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSort={mockOnSort}
        sortField="created_at"
        sortDirection="desc"
      />
    );

    const createdHeader = screen.getByText(/created at/i);
    expect(createdHeader).toHaveAttribute('aria-sort', 'descending');
  });

  it('sorts jobs by created date', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSort={mockOnSort}
        sortField="created_at"
        sortDirection="desc"
      />
    );

    const jobRows = screen.getAllByRole('row').slice(1); // Exclude header row
    const firstJobId = jobRows[0].querySelector('td')?.textContent;
    expect(firstJobId).toBe('test-2'); // Most recent job
  });

  it('sorts jobs by status', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSort={mockOnSort}
        sortField="status"
        sortDirection="asc"
      />
    );

    const jobRows = screen.getAllByRole('row').slice(1); // Exclude header row
    const firstJobStatus = jobRows[0].querySelector('td:nth-child(2)')?.textContent;
    expect(firstJobStatus).toBe('completed');
  });

  it('sorts jobs by job board', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSort={mockOnSort}
        sortField="board_type"
        sortDirection="asc"
      />
    );

    const jobRows = screen.getAllByRole('row').slice(1); // Exclude header row
    const firstJobBoard = jobRows[0].querySelector('td:nth-child(3)')?.textContent;
    expect(firstJobBoard).toBe('glassdoor');
  });

  it('handles empty job list', () => {
    render(
      <JobList
        jobs={[]}
        onSort={mockOnSort}
        sortField="created_at"
        sortDirection="desc"
      />
    );

    expect(screen.getByText(/no jobs found/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSort={mockOnSort}
        sortField="created_at"
        sortDirection="desc"
        isLoading={true}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
}); 