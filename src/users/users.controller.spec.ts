import { Test, TestingModule } from '@nestjs/testing';

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
