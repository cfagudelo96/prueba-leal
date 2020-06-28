import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dtos/create-transaction.dto';

describe('TransactionsService', () => {
  const transaction: Transaction = new Transaction();

  let usersService: UsersService;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: UsersService,
          useValue: {
            findByIdOrFail: jest.fn().mockResolvedValue(new User()),
          },
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            save: jest.fn().mockResolvedValue(transaction),
          },
        },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new transaction correctly', async () => {
    const createTransactionDto: CreateTransactionDto = new CreateTransactionDto(
      { userId: 'emailHash', value: 1500 },
    );
    const returnedTransaction = await service.create(createTransactionDto);
    expect(usersService.findByIdOrFail).toHaveBeenCalledWith(
      createTransactionDto.userId,
    );
    expect(returnedTransaction).toBe(transaction);
  });
});
