import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { LogInRequestDto } from './dtos/log-in.dto';

describe('UsersService', () => {
  let repository: Repository<User>;
  let jwtService: JwtService;
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
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn().mockResolvedValue(user),
          },
        },
      ],
    }).compile();
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
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
      (repository.findOne as jest.Mock).mockResolvedValue(user);
      try {
        await service.register(createUserDto);
        fail();
      } catch (error) {
        expect(error.message).toBe('The email provided is already in use');
      }
    });
  });

  describe('logs in a user', () => {
    const logInRequestDto: LogInRequestDto = {
      email: 'cf.agudelo96@gmail.com',
      password: 'Test12345',
    };

    it('should throw an error if the email given is not registered', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(undefined);
      try {
        await service.logIn(logInRequestDto);
        fail();
      } catch (error) {
        expect(error.message).toBe(
          'There is no user registered with the email provided',
        );
      }
    });

    it('should throw an error if the password given is incorrect', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue({
        isSamePassword: jest.fn().mockResolvedValue(false),
      });
      try {
        await service.logIn(logInRequestDto);
        fail();
      } catch (error) {
        expect(error.message).toBe('Invalid password');
      }
    });

    it('should work correctly', async () => {
      const token = 'fake.jwt.token';
      const userId = 'someEmailHash';
      (jwtService.sign as jest.Mock).mockReturnValue(token);
      (repository.findOne as jest.Mock).mockResolvedValue({
        isSamePassword: jest.fn().mockResolvedValue(true),
        userId,
      });
      const result = await service.logIn(logInRequestDto);
      expect(jwtService.sign).toHaveBeenCalledWith({ userId });
      expect(result).toEqual({ token });
    });
  });

  describe('finds an user by id', () => {
    const userId = 'emailHash';

    it('should throw an error if the user is not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(undefined);
      try {
        await service.findByIdOrFail(userId);
        fail();
      } catch (error) {
        expect(error.message).toBe('The user was not found');
      }
    });

    it('should return the user', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(user);
      const returnedUser = await service.findByIdOrFail(userId);
      expect(returnedUser).toBe(user);
    });
  });
});
