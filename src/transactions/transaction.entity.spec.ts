import { Transaction } from './transaction.entity';

describe('Transaction', () => {
  it('should calculate the points correctly from the value', () => {
    const transaction = new Transaction({ value: 8750 });
    transaction.calculatePoints();
    expect(transaction.points).toBe(8);
  });
});
