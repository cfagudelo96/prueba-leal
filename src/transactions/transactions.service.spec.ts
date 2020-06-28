import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dtos/create-transaction.dto';

describe('TransactionsService', () => {
  const transaction: Transaction = new Transaction();

  let repository: Repository<Transaction>;
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
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn().mockResolvedValue(transaction),
          },
        },
      ],
    }).compile();
    repository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
    usersService = module.get<UsersService>(UsersService);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('finds transaction by id', () => {
    const id = 1;

    it('should throw an error if the transaction is not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(undefined);
      try {
        await service.findByIdOrFail(id);
        fail();
      } catch (error) {
        expect(error.message).toBe('The transaction was not found');
      }
    });

    it('should return the transaction', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(transaction);
      const returnedTransaction = await service.findByIdOrFail(id);
      expect(returnedTransaction).toBe(transaction);
    });
  });

  it('should find transactions by user', async () => {
    const userId = 'someHash';
    (repository.find as jest.Mock).mockResolvedValue([transaction]);
    const returnedTransactions = await service.findByUser(userId);
    expect(repository.find).toHaveBeenCalledWith({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    expect(returnedTransactions).toEqual([transaction]);
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

  it('should inactivate a transaction', async () => {
    const id = 1;
    (repository.findOne as jest.Mock).mockResolvedValue(transaction);
    const returnedTransaction = await service.inactivate(id);
    expect(repository.save).toHaveBeenCalledWith(
      new Transaction({ status: 0 }),
    );
    expect(returnedTransaction).toBe(transaction);
  });
});
