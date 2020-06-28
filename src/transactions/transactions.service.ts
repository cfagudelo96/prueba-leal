import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
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
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async findByIdOrFail(id: number): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne(id);
    if (!transaction)
      throw new BadRequestException('The transaction was not found');
    return transaction;
  }

  async findByUser(userId: string): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      order: { createdAt: 'DESC' },
      where: { userId },
    });
  }

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const { userId } = createTransactionDto;
    await this.usersService.findByIdOrFail(userId);
    return this.transactionsRepository.save(createTransactionDto.toEntity());
  }

  async inactivate(id: number): Promise<Transaction> {
    const transaction = await this.findByIdOrFail(id);
    transaction.status = 0;
    return this.transactionsRepository.save(transaction);
  }
}
