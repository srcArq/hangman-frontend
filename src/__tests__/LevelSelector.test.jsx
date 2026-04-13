import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LevelSelector from '../components/LevelSelector';

describe('LevelSelector', () => {
  it('renders three difficulty buttons', () => {
    render(<LevelSelector onSelectLevel={() => {}} />);
    expect(screen.getByText('Fácil')).toBeInTheDocument();
    expect(screen.getByText('Medio')).toBeInTheDocument();
    expect(screen.getByText('Difícil')).toBeInTheDocument();
  });

  it('renders the difficulty question', () => {
    render(<LevelSelector onSelectLevel={() => {}} />);
    expect(screen.getByText('¿ Dificultad ?')).toBeInTheDocument();
  });

  it('calls onSelectLevel with 1 for Fácil', () => {
    const handler = vi.fn();
    render(<LevelSelector onSelectLevel={handler} />);
    fireEvent.click(screen.getByText('Fácil'));
    expect(handler).toHaveBeenCalledWith(1);
  });

  it('calls onSelectLevel with 2 for Medio', () => {
    const handler = vi.fn();
    render(<LevelSelector onSelectLevel={handler} />);
    fireEvent.click(screen.getByText('Medio'));
    expect(handler).toHaveBeenCalledWith(2);
  });

  it('calls onSelectLevel with 3 for Difícil', () => {
    const handler = vi.fn();
    render(<LevelSelector onSelectLevel={handler} />);
    fireEvent.click(screen.getByText('Difícil'));
    expect(handler).toHaveBeenCalledWith(3);
  });
});
