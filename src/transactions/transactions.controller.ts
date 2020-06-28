import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

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

  @Put(':id/inactivate')
  inactivate(@Param('id', ParseIntPipe) id: number): Promise<Transaction> {
    return this.transactionsService.inactivate(id);
  }
}
