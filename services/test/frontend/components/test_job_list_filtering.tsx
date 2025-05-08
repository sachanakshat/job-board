import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobList from '../../frontend/components/JobList';

describe('JobList Filtering', () => {
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

  const mockOnFilter = jest.fn();

  beforeEach(() => {
    mockOnFilter.mockClear();
  });

  it('renders filter controls', () => {
    render(
      <JobList
        jobs={mockJobs}
        onFilter={mockOnFilter}
        filters={{
          status: '',
          board_type: '',
          dateRange: { start: '', end: '' }
        }}
      />
    );

    expect(screen.getByLabelText(/status filter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/board type filter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
  });

  it('calls onFilter when status filter changes', () => {
    render(
      <JobList
        jobs={mockJobs}
        onFilter={mockOnFilter}
        filters={{
          status: '',
          board_type: '',
          dateRange: { start: '', end: '' }
        }}
      />
    );

    const statusFilter = screen.getByLabelText(/status filter/i);
    fireEvent.change(statusFilter, { target: { value: 'completed' } });

    expect(mockOnFilter).toHaveBeenCalledWith({
      status: 'completed',
      board_type: '',
      dateRange: { start: '', end: '' }
    });
  });

  it('calls onFilter when board type filter changes', () => {
    render(
      <JobList
        jobs={mockJobs}
        onFilter={mockOnFilter}
        filters={{
          status: '',
          board_type: '',
          dateRange: { start: '', end: '' }
        }}
      />
    );

    const boardFilter = screen.getByLabelText(/board type filter/i);
    fireEvent.change(boardFilter, { target: { value: 'indeed' } });

    expect(mockOnFilter).toHaveBeenCalledWith({
      status: '',
      board_type: 'indeed',
      dateRange: { start: '', end: '' }
    });
  });

  it('calls onFilter when date range changes', () => {
    render(
      <JobList
        jobs={mockJobs}
        onFilter={mockOnFilter}
        filters={{
          status: '',
          board_type: '',
          dateRange: { start: '', end: '' }
        }}
      />
    );

    const startDate = screen.getByLabelText(/start date/i);
    const endDate = screen.getByLabelText(/end date/i);

    fireEvent.change(startDate, { target: { value: '2024-03-19' } });
    fireEvent.change(endDate, { target: { value: '2024-03-21' } });

    expect(mockOnFilter).toHaveBeenCalledWith({
      status: '',
      board_type: '',
      dateRange: { start: '2024-03-19', end: '2024-03-21' }
    });
  });

  it('filters jobs by status', () => {
    render(
      <JobList
        jobs={mockJobs}
        onFilter={mockOnFilter}
        filters={{
          status: 'completed',
          board_type: '',
          dateRange: { start: '', end: '' }
        }}
      />
    );

    const jobRows = screen.getAllByRole('row').slice(1); // Exclude header row
    expect(jobRows).toHaveLength(1);
    expect(jobRows[0].querySelector('td:nth-child(2)')?.textContent).toBe('completed');
  });

  it('filters jobs by board type', () => {
    render(
      <JobList
        jobs={mockJobs}
        onFilter={mockOnFilter}
        filters={{
          status: '',
          board_type: 'indeed',
          dateRange: { start: '', end: '' }
        }}
      />
    );

    const jobRows = screen.getAllByRole('row').slice(1); // Exclude header row
    expect(jobRows).toHaveLength(1);
    expect(jobRows[0].querySelector('td:nth-child(3)')?.textContent).toBe('indeed');
  });

  it('filters jobs by date range', () => {
    render(
      <JobList
        jobs={mockJobs}
        onFilter={mockOnFilter}
        filters={{
          status: '',
          board_type: '',
          dateRange: { start: '2024-03-20T00:00:00Z', end: '2024-03-20T12:00:00Z' }
        }}
      />
    );

    const jobRows = screen.getAllByRole('row').slice(1); // Exclude header row
    expect(jobRows).toHaveLength(2); // Only jobs from March 20
  });

  it('combines multiple filters', () => {
    render(
      <JobList
        jobs={mockJobs}
        onFilter={mockOnFilter}
        filters={{
          status: 'completed',
          board_type: 'indeed',
          dateRange: { start: '2024-03-20T00:00:00Z', end: '2024-03-20T12:00:00Z' }
        }}
      />
    );

    const jobRows = screen.getAllByRole('row').slice(1); // Exclude header row
    expect(jobRows).toHaveLength(1);
    const firstRow = jobRows[0];
    expect(firstRow.querySelector('td:nth-child(2)')?.textContent).toBe('completed');
    expect(firstRow.querySelector('td:nth-child(3)')?.textContent).toBe('indeed');
  });

  it('shows no results message when no jobs match filters', () => {
    render(
      <JobList
        jobs={mockJobs}
        onFilter={mockOnFilter}
        filters={{
          status: 'unknown',
          board_type: '',
          dateRange: { start: '', end: '' }
        }}
      />
    );

    expect(screen.getByText(/no jobs found/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <JobList
        jobs={mockJobs}
        onFilter={mockOnFilter}
        filters={{
          status: '',
          board_type: '',
          dateRange: { start: '', end: '' }
        }}
        isLoading={true}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
}); 