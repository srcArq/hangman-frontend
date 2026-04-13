import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../components/Modal';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe('Modal', () => {
  const defaultProps = {
    open: true,
    title: '¡Ganaste!',
    message: 'Has adivinado la palabra.',
    image: '/assets/images/hangman-winner.png',
    actionLabel: 'Jugar de nuevo',
    onAction: vi.fn(),
  };

  it('renders title and message when open', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('¡Ganaste!')).toBeInTheDocument();
    expect(screen.getByText('Has adivinado la palabra.')).toBeInTheDocument();
  });

  it('renders the action button with correct label', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Jugar de nuevo')).toBeInTheDocument();
  });

  it('calls onAction when button is clicked', () => {
    const onAction = vi.fn();
    render(<Modal {...defaultProps} onAction={onAction} />);
    fireEvent.click(screen.getByText('Jugar de nuevo'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('renders image with alt matching title', () => {
    render(<Modal {...defaultProps} />);
    const img = screen.getByAltText('¡Ganaste!');
    expect(img).toHaveAttribute('src', '/assets/images/hangman-winner.png');
  });

  it('calls showModal when open is true', () => {
    render(<Modal {...defaultProps} open={true} />);
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it('has aria-label on dialog', () => {
    render(<Modal {...defaultProps} />);
    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).toHaveAttribute('aria-label', '¡Ganaste!');
  });
});
