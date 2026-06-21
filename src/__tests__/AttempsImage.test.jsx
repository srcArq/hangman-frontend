import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AttempsImage, { IMAGES_BY_LEVEL } from '../components/AttempsImage';

describe('IMAGES_BY_LEVEL', () => {
  it('level 1 (easy) has 11 images', () => {
    expect(IMAGES_BY_LEVEL[1]).toHaveLength(11);
    expect(IMAGES_BY_LEVEL[1]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('level 2 (medium) has 8 images', () => {
    expect(IMAGES_BY_LEVEL[2]).toHaveLength(8);
    expect(IMAGES_BY_LEVEL[2]).toEqual([0, 1, 2, 4, 5, 6, 8, 10]);
  });

  it('level 3 (hard) has 6 images', () => {
    expect(IMAGES_BY_LEVEL[3]).toHaveLength(6);
    expect(IMAGES_BY_LEVEL[3]).toEqual([0, 1, 2, 4, 5, 10]);
  });

  it('all levels start with image 0', () => {
    for (const level of [1, 2, 3]) {
      expect(IMAGES_BY_LEVEL[level][0]).toBe(0);
    }
  });

  it('all levels end with image 10', () => {
    for (const level of [1, 2, 3]) {
      const images = IMAGES_BY_LEVEL[level];
      expect(images[images.length - 1]).toBe(10);
    }
  });
});

describe('AttempsImage rendering', () => {
  it('shows image 0 when there are no fails', () => {
    render(<AttempsImage attempts={10} initialAttempts={10} level={1} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/assets/images/hangman-0.png');
  });

  it('derives the image directly from the fail count (level 1)', () => {
    // 10 - 7 = 3 fallos -> images[3] = 3
    render(<AttempsImage attempts={7} initialAttempts={10} level={1} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/assets/images/hangman-3.png');
  });

  it('maps fails through IMAGES_BY_LEVEL on harder levels', () => {
    // level 3: [0,1,2,4,5,10]; 5 - 2 = 3 fallos -> images[3] = 4
    render(<AttempsImage attempts={2} initialAttempts={5} level={3} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/assets/images/hangman-4.png');
  });

  it('clamps to the last image when fails exceed the list', () => {
    render(<AttempsImage attempts={0} initialAttempts={10} level={1} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/assets/images/hangman-10.png');
  });
});
