import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';

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
            register: jest.fn().mockReturnValue(Promise.resolve(user)),
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
    expect(returnedUser).toEqual(user);
    expect(service.register).toHaveBeenCalledWith(createUserDto);
  });
});
