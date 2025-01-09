import { add, subtract } from './module';

describe('myModule', () => {
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

    it('should return the sum when one of the numbers is zero', () => {
      expect(add(0, 5)).toBe(5);
      expect(add(5, 0)).toBe(5);
    });

    it('should return the correct sum for large numbers', () => {
      expect(add(1_000_000, 2_000_000)).toBe(3_000_000);
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

    it('should return the correct result when subtracting zero', () => {
      expect(subtract(5, 0)).toBe(5);
      expect(subtract(0, 5)).toBe(-5);
    });

    it('should return the correct difference for large numbers', () => {
      expect(subtract(2_000_000, 1_000_000)).toBe(1_000_000);
    });
  });
});
