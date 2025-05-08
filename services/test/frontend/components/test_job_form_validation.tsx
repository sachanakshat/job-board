import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobForm from '../../frontend/components/JobForm';

describe('JobForm Validation', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('validates required fields', async () => {
    render(<JobForm onSubmit={mockOnSubmit} />);

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Check for error messages
    await waitFor(() => {
      expect(screen.getByText(/url is required/i)).toBeInTheDocument();
      expect(screen.getByText(/job board is required/i)).toBeInTheDocument();
    });

    // Verify onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates URL format', async () => {
    render(<JobForm onSubmit={mockOnSubmit} />);

    // Enter invalid URL
    const urlInput = screen.getByLabelText(/job url/i);
    fireEvent.change(urlInput, { target: { value: 'invalid-url' } });

    // Select job board
    const boardSelect = screen.getByLabelText(/job board/i);
    fireEvent.change(boardSelect, { target: { value: 'indeed' } });

    // Try to submit
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Check for URL format error
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument();
    });

    // Verify onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates URL protocol', async () => {
    render(<JobForm onSubmit={mockOnSubmit} />);

    // Enter URL without protocol
    const urlInput = screen.getByLabelText(/job url/i);
    fireEvent.change(urlInput, { target: { value: 'example.com/job' } });

    // Select job board
    const boardSelect = screen.getByLabelText(/job board/i);
    fireEvent.change(boardSelect, { target: { value: 'indeed' } });

    // Try to submit
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Check for protocol error
    await waitFor(() => {
      expect(screen.getByText(/url must start with http/i)).toBeInTheDocument();
    });

    // Verify onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates job board selection', async () => {
    render(<JobForm onSubmit={mockOnSubmit} />);

    // Enter valid URL
    const urlInput = screen.getByLabelText(/job url/i);
    fireEvent.change(urlInput, { target: { value: 'https://example.com/job' } });

    // Try to submit without selecting job board
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Check for job board error
    await waitFor(() => {
      expect(screen.getByText(/job board is required/i)).toBeInTheDocument();
    });

    // Verify onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<JobForm onSubmit={mockOnSubmit} />);

    // Enter valid URL
    const urlInput = screen.getByLabelText(/job url/i);
    fireEvent.change(urlInput, { target: { value: 'https://example.com/job' } });

    // Select job board
    const boardSelect = screen.getByLabelText(/job board/i);
    fireEvent.change(boardSelect, { target: { value: 'indeed' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Verify onSubmit was called with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        url: 'https://example.com/job',
        board_type: 'indeed'
      });
    });
  });

  it('clears validation errors when input changes', async () => {
    render(<JobForm onSubmit={mockOnSubmit} />);

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Check for error messages
    await waitFor(() => {
      expect(screen.getByText(/url is required/i)).toBeInTheDocument();
    });

    // Enter valid URL
    const urlInput = screen.getByLabelText(/job url/i);
    fireEvent.change(urlInput, { target: { value: 'https://example.com/job' } });

    // Verify URL error is cleared
    await waitFor(() => {
      expect(screen.queryByText(/url is required/i)).not.toBeInTheDocument();
    });
  });
}); 