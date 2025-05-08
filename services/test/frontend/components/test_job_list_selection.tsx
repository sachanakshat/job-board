import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobList from '../../frontend/components/JobList';

describe('JobList Selection', () => {
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

  const mockOnSelectionChange = jest.fn();

  beforeEach(() => {
    mockOnSelectionChange.mockClear();
  });

  it('renders checkboxes for each job', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSelectionChange={mockOnSelectionChange}
        selectedJobs={[]}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(mockJobs.length);
  });

  it('calls onSelectionChange when a job is selected', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSelectionChange={mockOnSelectionChange}
        selectedJobs={[]}
      />
    );

    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(firstCheckbox);

    expect(mockOnSelectionChange).toHaveBeenCalledWith([mockJobs[0].job_id]);
  });

  it('calls onSelectionChange when a job is deselected', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSelectionChange={mockOnSelectionChange}
        selectedJobs={[mockJobs[0].job_id]}
      />
    );

    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(firstCheckbox);

    expect(mockOnSelectionChange).toHaveBeenCalledWith([]);
  });

  it('renders select all checkbox', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSelectionChange={mockOnSelectionChange}
        selectedJobs={[]}
      />
    );

    expect(screen.getByRole('checkbox', { name: /select all/i })).toBeInTheDocument();
  });

  it('selects all jobs when select all is clicked', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSelectionChange={mockOnSelectionChange}
        selectedJobs={[]}
      />
    );

    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    fireEvent.click(selectAllCheckbox);

    expect(mockOnSelectionChange).toHaveBeenCalledWith(mockJobs.map(job => job.job_id));
  });

  it('deselects all jobs when select all is clicked again', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSelectionChange={mockOnSelectionChange}
        selectedJobs={mockJobs.map(job => job.job_id)}
      />
    );

    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    fireEvent.click(selectAllCheckbox);

    expect(mockOnSelectionChange).toHaveBeenCalledWith([]);
  });

  it('shows selected count', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSelectionChange={mockOnSelectionChange}
        selectedJobs={[mockJobs[0].job_id, mockJobs[1].job_id]}
      />
    );

    expect(screen.getByText(/2 selected/i)).toBeInTheDocument();
  });

  it('disables selection during loading', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSelectionChange={mockOnSelectionChange}
        selectedJobs={[]}
        isLoading={true}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox).toBeDisabled();
    });
  });

  it('handles selection of filtered jobs', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSelectionChange={mockOnSelectionChange}
        selectedJobs={[]}
        filters={{
          status: 'completed',
          board_type: '',
          dateRange: { start: '', end: '' }
        }}
      />
    );

    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    fireEvent.click(selectAllCheckbox);

    // Should only select the completed job
    expect(mockOnSelectionChange).toHaveBeenCalledWith([mockJobs[0].job_id]);
  });

  it('maintains selection state when jobs are updated', () => {
    const { rerender } = render(
      <JobList
        jobs={mockJobs}
        onSelectionChange={mockOnSelectionChange}
        selectedJobs={[mockJobs[0].job_id]}
      />
    );

    // Update jobs with new data
    const updatedJobs = [...mockJobs];
    updatedJobs[0] = { ...mockJobs[0], status: 'processing' };

    rerender(
      <JobList
        jobs={updatedJobs}
        onSelectionChange={mockOnSelectionChange}
        selectedJobs={[mockJobs[0].job_id]}
      />
    );

    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    expect(firstCheckbox).toBeChecked();
  });
}); 