import { Test, TestingModule } from '@nestjs/testing';
import * as httpMocks from 'node-mocks-http';

import { Transaction } from '../transactions/transaction.entity';

import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LogInRequestDto, LogInResponseDto } from './dtos/log-in.dto';

describe('Users Controller', () => {
  let controller: UsersController;
  let service: UsersService;

  const createUserDto = new CreateUserDto({
    birthDate: '1995-09-19',
    email: 'cf.agudelo96@gmail.com',
    name: 'Carlos',
    lastName: 'Agudelo',
    password: 'Test12345',
  });

  const user: User = createUserDto.toEntity();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getPoints: jest.fn(),
            getTransactions: jest.fn(),
            getTransactionsFile: jest.fn(),
            register: jest.fn().mockResolvedValue(user),
            logIn: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should request and return the user transactions', async () => {
    const userId = 'someHash';
    const transactions = [new Transaction()];
    (service.getTransactions as jest.Mock).mockResolvedValue(transactions);
    const returnedTransactions = await controller.getTransactions(userId);
    expect(service.getTransactions).toHaveBeenCalledWith(userId);
    expect(returnedTransactions).toBe(transactions);
  });

  it('should send and return the transactions file', async () => {
    const buffer = new Buffer('Excel file');
    (service.getTransactionsFile as jest.Mock).mockResolvedValue(buffer);
    const userId = 'someHash';
    const response = httpMocks.createResponse();
    await controller.getTransactionsFile(userId, response);
    expect(service.getTransactionsFile).toHaveBeenCalledWith(userId);
    expect(response._getHeaders()).toEqual({
      'content-disposition':
        'attachment; filename="Transactions-someHash.xlsx"',
      'content-transfer-encoding': 'binary',
      'content-type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream',
    });
  });

  it("should send and return the request for a user's points", async () => {
    const userId = 'someHash';
    const pointsResponse = { points: 99 };
    (service.getPoints as jest.Mock).mockResolvedValue(pointsResponse);
    const returnedResponse = await controller.getPoints(userId);
    expect(service.getPoints).toHaveBeenCalledWith(userId);
    expect(returnedResponse).toBe(pointsResponse);
  });

  it('should send and return the register info correctly', async () => {
    const returnedUser = await controller.register(createUserDto);
    expect(returnedUser).toBe(user);
    expect(service.register).toHaveBeenCalledWith(createUserDto);
  });

  it('should send and return the log in info correctly', async () => {
    const logInRequestDto: LogInRequestDto = {
      email: 'cf.agudelo96@gmail.com',
      password: 'Test12345',
    };
    const logInResponseDto: LogInResponseDto = { token: 'some.jwt.token' };
    (service.logIn as jest.Mock).mockResolvedValue(logInResponseDto);
    const response = await controller.logIn(logInRequestDto);
    expect(response).toBe(logInResponseDto);
    expect(service.logIn).toHaveBeenCalledWith(logInRequestDto);
  });
});
