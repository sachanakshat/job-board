import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobUrlInput from '../../frontend/components/JobUrlInput';

describe('JobUrlInput', () => {
  const mockOnChange = jest.fn();
  const mockOnBlur = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnBlur.mockClear();
  });

  it('renders input field with label', () => {
    render(
      <JobUrlInput
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        label="Job URL"
      />
    );

    expect(screen.getByLabelText(/job url/i)).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    render(
      <JobUrlInput
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        label="Job URL"
      />
    );

    const input = screen.getByLabelText(/job url/i);
    fireEvent.change(input, { target: { value: 'https://example.com/job' } });

    expect(mockOnChange).toHaveBeenCalledWith('https://example.com/job');
  });

  it('calls onBlur when input loses focus', () => {
    render(
      <JobUrlInput
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        label="Job URL"
      />
    );

    const input = screen.getByLabelText(/job url/i);
    fireEvent.blur(input);

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('shows error message when error prop is provided', () => {
    const errorMessage = 'Please enter a valid URL';
    render(
      <JobUrlInput
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        label="Job URL"
        error={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByLabelText(/job url/i)).toHaveClass('border-red-500');
  });

  it('disables input when disabled prop is true', () => {
    render(
      <JobUrlInput
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        label="Job URL"
        disabled={true}
      />
    );

    expect(screen.getByLabelText(/job url/i)).toBeDisabled();
  });

  it('applies custom className when provided', () => {
    render(
      <JobUrlInput
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        label="Job URL"
        className="custom-class"
      />
    );

    expect(screen.getByLabelText(/job url/i)).toHaveClass('custom-class');
  });

  it('shows placeholder text when provided', () => {
    const placeholder = 'Enter job posting URL';
    render(
      <JobUrlInput
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        label="Job URL"
        placeholder={placeholder}
      />
    );

    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  it('shows required indicator when required prop is true', () => {
    render(
      <JobUrlInput
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        label="Job URL"
        required={true}
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });
}); 