import { describe, it, expect } from 'vitest';
import { IMAGES_BY_LEVEL } from '../components/AttempsImage';

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
