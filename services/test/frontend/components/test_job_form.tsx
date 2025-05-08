import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobForm from '../../frontend/components/JobForm';

describe('JobForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders the form with all fields', () => {
    render(<JobForm onSubmit={mockOnSubmit} />);

    // Check form fields
    expect(screen.getByLabelText(/job url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/job board/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<JobForm onSubmit={mockOnSubmit} />);

    // Try to submit without filling fields
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check error messages
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
    await userEvent.type(urlInput, 'invalid-url');

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check error message
    await waitFor(() => {
      expect(screen.getByText(/invalid url format/i)).toBeInTheDocument();
    });

    // Verify onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<JobForm onSubmit={mockOnSubmit} />);

    // Fill form fields
    const urlInput = screen.getByLabelText(/job url/i);
    const boardSelect = screen.getByLabelText(/job board/i);

    await userEvent.type(urlInput, 'https://example.com/job/123');
    await userEvent.selectOptions(boardSelect, 'indeed');

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Verify onSubmit was called with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        url: 'https://example.com/job/123',
        board_type: 'indeed'
      });
    });
  });

  it('shows loading state during submission', async () => {
    render(<JobForm onSubmit={mockOnSubmit} />);

    // Fill form fields
    const urlInput = screen.getByLabelText(/job url/i);
    const boardSelect = screen.getByLabelText(/job board/i);

    await userEvent.type(urlInput, 'https://example.com/job/123');
    await userEvent.selectOptions(boardSelect, 'indeed');

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check loading state
    expect(screen.getByText(/submitting/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('handles submission error', async () => {
    // Mock onSubmit to throw error
    mockOnSubmit.mockRejectedValueOnce(new Error('Submission failed'));

    render(<JobForm onSubmit={mockOnSubmit} />);

    // Fill form fields
    const urlInput = screen.getByLabelText(/job url/i);
    const boardSelect = screen.getByLabelText(/job board/i);

    await userEvent.type(urlInput, 'https://example.com/job/123');
    await userEvent.selectOptions(boardSelect, 'indeed');

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Check error message
    await waitFor(() => {
      expect(screen.getByText(/submission failed/i)).toBeInTheDocument();
    });

    // Verify form is not disabled
    expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled();
  });

  it('resets form after successful submission', async () => {
    render(<JobForm onSubmit={mockOnSubmit} />);

    // Fill form fields
    const urlInput = screen.getByLabelText(/job url/i);
    const boardSelect = screen.getByLabelText(/job board/i);

    await userEvent.type(urlInput, 'https://example.com/job/123');
    await userEvent.selectOptions(boardSelect, 'indeed');

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for submission to complete
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // Check form is reset
    expect(urlInput).toHaveValue('');
    expect(boardSelect).toHaveValue('');
  });
}); 