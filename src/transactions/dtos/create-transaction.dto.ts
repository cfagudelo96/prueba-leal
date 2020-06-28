import { IsNumber, Min, IsNotEmpty } from 'class-validator';

import { Transaction } from '../transaction.entity';

export class CreateTransactionDto {
  @IsNumber()
  @Min(0)
  value: number;

  @IsNotEmpty()
  userId: string;

  constructor(partial?: Partial<CreateTransactionDto>) {
    Object.assign(this, partial);
  }

  toEntity(): Transaction {
    return new Transaction(this);
  }
}
