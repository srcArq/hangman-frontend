import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loader from '../components/Loader';

describe('Loader', () => {
  it('renders loading text', () => {
    render(<Loader />);
    expect(screen.getByText('CARGANDO. . .')).toBeInTheDocument();
  });

  it('renders 10 loading segments', () => {
    const { container } = render(<Loader />);
    const segments = container.querySelectorAll('.loading-segment');
    expect(segments).toHaveLength(10);
  });
});
