import { add, subtract } from './module';

describe('Math Functions', () => {
  describe('add', () => {
    it('should return the sum of two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should return the sum of a positive and a negative number', () => {
      expect(add(5, -3)).toBe(2);
    });

    it('should return the sum of two negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });

    it('should return the same number when adding zero', () => {
      expect(add(5, 0)).toBe(5);
      expect(add(0, 5)).toBe(5);
    });

    it('should return zero when adding two zeros', () => {
      expect(add(0, 0)).toBe(0);
    });
  });

  describe('subtract', () => {
    it('should return the difference of two positive numbers', () => {
      expect(subtract(5, 3)).toBe(2);
    });

    it('should return the difference when subtracting a negative number', () => {
      expect(subtract(5, -3)).toBe(8);
    });

    it('should return the difference of two negative numbers', () => {
      expect(subtract(-5, -3)).toBe(-2);
    });

    it('should return the same number when subtracting zero', () => {
      expect(subtract(5, 0)).toBe(5);
      expect(subtract(0, 5)).toBe(-5);
    });

    it('should return zero when subtracting a number from itself', () => {
      expect(subtract(5, 5)).toBe(0);
    });
  });
});
