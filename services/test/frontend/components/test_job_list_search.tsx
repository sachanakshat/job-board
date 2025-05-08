import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobList from '../../frontend/components/JobList';

describe('JobList Search', () => {
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
        location: 'San Francisco'
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
        location: 'Remote'
      }
    },
    {
      job_id: 'test-3',
      url: 'https://example.com/job/3',
      board_type: 'glassdoor',
      status: 'failed',
      created_at: '2024-03-20T09:00:00Z',
      updated_at: '2024-03-20T09:15:00Z',
      result: {
        title: 'Full Stack Developer',
        company: 'Enterprise Co',
        location: 'New York'
      }
    }
  ];

  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('renders search input', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSearch={mockOnSearch}
        searchQuery=""
      />
    );

    expect(screen.getByPlaceholderText(/search jobs/i)).toBeInTheDocument();
  });

  it('calls onSearch when search input changes', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSearch={mockOnSearch}
        searchQuery=""
      />
    );

    const searchInput = screen.getByPlaceholderText(/search jobs/i);
    fireEvent.change(searchInput, { target: { value: 'software' } });

    expect(mockOnSearch).toHaveBeenCalledWith('software');
  });

  it('searches jobs by title', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSearch={mockOnSearch}
        searchQuery="software"
      />
    );

    const jobRows = screen.getAllByRole('row').slice(1); // Exclude header row
    expect(jobRows).toHaveLength(1);
    expect(jobRows[0].querySelector('td:nth-child(4)')?.textContent).toContain('Senior Software Engineer');
  });

  it('searches jobs by company', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSearch={mockOnSearch}
        searchQuery="tech"
      />
    );

    const jobRows = screen.getAllByRole('row').slice(1); // Exclude header row
    expect(jobRows).toHaveLength(1);
    expect(jobRows[0].querySelector('td:nth-child(5)')?.textContent).toContain('Tech Corp');
  });

  it('searches jobs by location', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSearch={mockOnSearch}
        searchQuery="remote"
      />
    );

    const jobRows = screen.getAllByRole('row').slice(1); // Exclude header row
    expect(jobRows).toHaveLength(1);
    expect(jobRows[0].querySelector('td:nth-child(6)')?.textContent).toContain('Remote');
  });

  it('performs case-insensitive search', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSearch={mockOnSearch}
        searchQuery="DEVELOPER"
      />
    );

    const jobRows = screen.getAllByRole('row').slice(1); // Exclude header row
    expect(jobRows).toHaveLength(2); // Both Frontend and Full Stack Developer
  });

  it('searches across multiple fields', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSearch={mockOnSearch}
        searchQuery="new york"
      />
    );

    const jobRows = screen.getAllByRole('row').slice(1); // Exclude header row
    expect(jobRows).toHaveLength(1);
    expect(jobRows[0].querySelector('td:nth-child(6)')?.textContent).toContain('New York');
  });

  it('shows no results message when no jobs match search', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSearch={mockOnSearch}
        searchQuery="nonexistent"
      />
    );

    expect(screen.getByText(/no jobs found/i)).toBeInTheDocument();
  });

  it('clears search when clear button is clicked', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSearch={mockOnSearch}
        searchQuery="software"
      />
    );

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearButton);

    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('shows loading state', () => {
    render(
      <JobList
        jobs={mockJobs}
        onSearch={mockOnSearch}
        searchQuery=""
        isLoading={true}
      />
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
}); 