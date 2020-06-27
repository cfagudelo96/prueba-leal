import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';

describe('UsersService', () => {
  let repository: Repository<User>;
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
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn().mockReturnValue(Promise.resolve(user)),
          },
        },
      ],
    }).compile();
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registers a new user', () => {
    it('should send to save the new user', async () => {
      const createdUser = await service.register(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(user);
      expect(createdUser).toBe(user);
    });

    it('should throw an error if there is an user with the same email', async () => {
      (repository.findOne as jest.Mock).mockReturnValue(Promise.resolve(user));
      try {
        await service.register(createUserDto);
        fail();
      } catch (error) {
        expect(error.message).toBe('The email provided is already in use');
      }
    });
  });
});
