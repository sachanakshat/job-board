import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobStatus from '../../frontend/components/JobStatus';

describe('JobStatus', () => {
  it('renders pending status correctly', () => {
    render(<JobStatus status="pending" />);
    const statusElement = screen.getByText('pending');
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('renders completed status correctly', () => {
    render(<JobStatus status="completed" />);
    const statusElement = screen.getByText('completed');
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('renders failed status correctly', () => {
    render(<JobStatus status="failed" />);
    const statusElement = screen.getByText('failed');
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('renders processing status correctly', () => {
    render(<JobStatus status="processing" />);
    const statusElement = screen.getByText('processing');
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('renders unknown status correctly', () => {
    render(<JobStatus status="unknown" />);
    const statusElement = screen.getByText('unknown');
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('applies custom className when provided', () => {
    render(<JobStatus status="pending" className="custom-class" />);
    const statusElement = screen.getByText('pending');
    expect(statusElement).toHaveClass('custom-class');
  });

  it('handles empty status gracefully', () => {
    render(<JobStatus status="" />);
    const statusElement = screen.getByText('unknown');
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass('bg-gray-100', 'text-gray-800');
  });
}); 