import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import KeyBoard from '../components/KeyBoard';

describe('KeyBoard', () => {
  it('renders 27 letter buttons (A-Z + Ñ)', () => {
    render(<KeyBoard handleCheckLetter={() => {}} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(27);
  });

  it('renders Ñ between N and O', () => {
    render(<KeyBoard handleCheckLetter={() => {}} />);
    const buttons = screen.getAllByRole('button');
    const letters = buttons.map(b => b.textContent);
    const nIndex = letters.indexOf('N');
    const ñIndex = letters.indexOf('Ñ');
    const oIndex = letters.indexOf('O');
    expect(ñIndex).toBe(nIndex + 1);
    expect(oIndex).toBe(ñIndex + 1);
  });

  it('calls handleCheckLetter when a letter is clicked', () => {
    const handler = vi.fn();
    render(<KeyBoard handleCheckLetter={handler} />);
    fireEvent.click(screen.getByText('A'));
    expect(handler).toHaveBeenCalledWith('A');
  });

  it('disables a letter after it is clicked', () => {
    const handler = vi.fn();
    render(<KeyBoard handleCheckLetter={handler} />);
    const btnA = screen.getByText('A');
    fireEvent.click(btnA);
    expect(btnA).toBeDisabled();
  });

  it('does not call handler for an already used letter', () => {
    const handler = vi.fn();
    render(<KeyBoard handleCheckLetter={handler} />);
    fireEvent.click(screen.getByText('A'));
    fireEvent.click(screen.getByText('A'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('does not call handler when disabled prop is true', () => {
    const handler = vi.fn();
    render(<KeyBoard handleCheckLetter={handler} disabled={true} />);
    fireEvent.click(screen.getByText('A'));
    expect(handler).not.toHaveBeenCalled();
  });

  it('responds to physical keyboard events', () => {
    const handler = vi.fn();
    render(<KeyBoard handleCheckLetter={handler} />);
    fireEvent.keyDown(window, { key: 'b' });
    expect(handler).toHaveBeenCalledWith('B');
  });

  it('ignores non-letter key presses', () => {
    const handler = vi.fn();
    render(<KeyBoard handleCheckLetter={handler} />);
    fireEvent.keyDown(window, { key: '1' });
    fireEvent.keyDown(window, { key: ' ' });
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(handler).not.toHaveBeenCalled();
  });

  it('has aria-label on keyboard group', () => {
    render(<KeyBoard handleCheckLetter={() => {}} />);
    expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'Teclado de letras');
  });
});
