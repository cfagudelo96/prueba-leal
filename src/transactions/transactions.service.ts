import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from '../users/users.service';

import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const { userId } = createTransactionDto;
    await this.usersService.findByIdOrFail(userId);
    return this.transactionsRepository.save(createTransactionDto.toEntity());
  }
}
