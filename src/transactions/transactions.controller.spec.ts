import { Test, TestingModule } from '@nestjs/testing';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dtos/create-transaction.dto';

describe('Transactions Controller', () => {
  const createTransactionDto = new CreateTransactionDto({
    userId: 'emailHash',
    value: 1500,
  });

  const transaction: Transaction = new Transaction(createTransactionDto);

  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            create: jest.fn().mockResolvedValue(transaction),
            inactivate: jest.fn().mockResolvedValue(transaction),
          },
        },
      ],
    }).compile();
    service = module.get<TransactionsService>(TransactionsService);
    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send the info and return the created transaction', async () => {
    const returnedTransaction = await controller.create(createTransactionDto);
    expect(returnedTransaction).toBe(transaction);
    expect(service.create).toHaveBeenCalledWith(createTransactionDto);
  });

  it('should send a transaction for inactivation and return the updated version', async () => {
    const id = 1;
    const returnedTransaction = await controller.inactivate(id);
    expect(returnedTransaction).toBe(transaction);
    expect(service.inactivate).toHaveBeenCalledWith(id);
  });
});
