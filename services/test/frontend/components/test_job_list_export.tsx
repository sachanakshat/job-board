import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobList from '../../frontend/components/JobList';

describe('JobList Export', () => {
  const mockJobs = [
    {
      job_id: 'test-1',
      url: 'https://example.com/job/1',
      board_type: 'indeed',
      status: 'completed',
      created_at: '2024-03-20T10:00:00Z',
      updated_at: '2024-03-20T10:30:00Z',
      result: {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco',
        salary: '$120k - $150k',
        description: 'Job description here'
      }
    },
    {
      job_id: 'test-2',
      url: 'https://example.com/job/2',
      board_type: 'linkedin',
      status: 'pending',
      created_at: '2024-03-20T11:00:00Z',
      updated_at: '2024-03-20T11:00:00Z',
      result: {
        title: 'Frontend Developer',
        company: 'Startup Inc',
        location: 'Remote',
        salary: '$90k - $110k',
        description: 'Another job description'
      }
    }
  ];

  const mockOnExport = jest.fn();

  beforeEach(() => {
    mockOnExport.mockClear();
    // Mock the window.URL.createObjectURL and window.URL.revokeObjectURL
    window.URL.createObjectURL = jest.fn();
    window.URL.revokeObjectURL = jest.fn();
  });

  it('renders export button', () => {
    render(
      <JobList
        jobs={mockJobs}
        onExport={mockOnExport}
      />
    );

    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
  });

  it('calls onExport when export button is clicked', () => {
    render(
      <JobList
        jobs={mockJobs}
        onExport={mockOnExport}
      />
    );

    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);

    expect(mockOnExport).toHaveBeenCalledWith(mockJobs);
  });

  it('exports jobs in CSV format', () => {
    render(
      <JobList
        jobs={mockJobs}
        onExport={mockOnExport}
      />
    );

    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);

    // Verify the export data format
    const exportData = mockOnExport.mock.calls[0][0];
    expect(exportData).toEqual(mockJobs);
  });

  it('disables export button when no jobs', () => {
    render(
      <JobList
        jobs={[]}
        onExport={mockOnExport}
      />
    );

    const exportButton = screen.getByRole('button', { name: /export/i });
    expect(exportButton).toBeDisabled();
  });

  it('disables export button during loading', () => {
    render(
      <JobList
        jobs={mockJobs}
        onExport={mockOnExport}
        isLoading={true}
      />
    );

    const exportButton = screen.getByRole('button', { name: /export/i });
    expect(exportButton).toBeDisabled();
  });

  it('shows export options menu', () => {
    render(
      <JobList
        jobs={mockJobs}
        onExport={mockOnExport}
      />
    );

    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);

    expect(screen.getByText(/export as csv/i)).toBeInTheDocument();
    expect(screen.getByText(/export as json/i)).toBeInTheDocument();
  });

  it('exports selected jobs only', () => {
    render(
      <JobList
        jobs={mockJobs}
        onExport={mockOnExport}
        selectedJobs={[mockJobs[0].job_id]}
      />
    );

    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);

    expect(mockOnExport).toHaveBeenCalledWith([mockJobs[0]]);
  });

  it('shows export progress indicator', () => {
    render(
      <JobList
        jobs={mockJobs}
        onExport={mockOnExport}
        isExporting={true}
      />
    );

    expect(screen.getByText(/exporting/i)).toBeInTheDocument();
  });

  it('handles export error', () => {
    render(
      <JobList
        jobs={mockJobs}
        onExport={mockOnExport}
        exportError="Failed to export jobs"
      />
    );

    expect(screen.getByText(/failed to export jobs/i)).toBeInTheDocument();
  });

  it('cleans up object URLs after export', () => {
    render(
      <JobList
        jobs={mockJobs}
        onExport={mockOnExport}
      />
    );

    const exportButton = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportButton);

    expect(window.URL.revokeObjectURL).toHaveBeenCalled();
  });
}); 