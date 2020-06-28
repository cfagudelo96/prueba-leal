import { Controller, Post, Body } from '@nestjs/common';

import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { Transaction } from './transaction.entity';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionsService.create(createTransactionDto);
  }
}
