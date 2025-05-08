import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobBoardSelector from '../../frontend/components/JobBoardSelector';

describe('JobBoardSelector', () => {
  const mockOnChange = jest.fn();
  const supportedBoards = ['indeed', 'linkedin', 'glassdoor'];

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders all supported job boards', () => {
    render(
      <JobBoardSelector
        value=""
        onChange={mockOnChange}
        supportedBoards={supportedBoards}
      />
    );

    supportedBoards.forEach(board => {
      expect(screen.getByText(board)).toBeInTheDocument();
    });
  });

  it('calls onChange when a board is selected', () => {
    render(
      <JobBoardSelector
        value=""
        onChange={mockOnChange}
        supportedBoards={supportedBoards}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'indeed' } });

    expect(mockOnChange).toHaveBeenCalledWith('indeed');
  });

  it('shows selected board', () => {
    render(
      <JobBoardSelector
        value="linkedin"
        onChange={mockOnChange}
        supportedBoards={supportedBoards}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('linkedin');
  });

  it('disables selector when disabled prop is true', () => {
    render(
      <JobBoardSelector
        value=""
        onChange={mockOnChange}
        supportedBoards={supportedBoards}
        disabled={true}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('shows error state when error prop is provided', () => {
    const errorMessage = 'Please select a job board';
    render(
      <JobBoardSelector
        value=""
        onChange={mockOnChange}
        supportedBoards={supportedBoards}
        error={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveClass('border-red-500');
  });

  it('applies custom className when provided', () => {
    render(
      <JobBoardSelector
        value=""
        onChange={mockOnChange}
        supportedBoards={supportedBoards}
        className="custom-class"
      />
    );

    expect(screen.getByRole('combobox')).toHaveClass('custom-class');
  });

  it('handles empty supportedBoards array', () => {
    render(
      <JobBoardSelector
        value=""
        onChange={mockOnChange}
        supportedBoards={[]}
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select.options).toHaveLength(1); // Only the default option
  });
}); 