import * as request from 'supertest';
import { Reflector } from '@nestjs/core';
import {
  INestApplication,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { EntityManager, Connection } from 'typeorm';

import { UsersModule } from '../src/users/users.module';
import { User } from '../src/users/user.entity';
import { LogInRequestDto } from '../src/users/dtos/log-in.dto';

describe('Users', () => {
  let app: INestApplication;
  let entityManager: EntityManager;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          entities: ['src/**/**.entity{.ts,.js}'],
          dropSchema: true,
          synchronize: true,
          database: 'data/test-db.sqlite',
        }),
        UsersModule,
      ],
    }).compile();
    entityManager = module.get<Connection>(Connection).createEntityManager();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    await app.init();
  });

  beforeEach(async () => {
    await entityManager.clear(User);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('registers a new user', () => {
    const createUserDto = {
      birthDate: '1995-09-19',
      email: 'cf.agudelo96@gmail.com',
      name: 'Carlos',
      lastName: 'Agudelo',
      password: 'Test12345',
    };

    describe('validates required fields', () => {
      it('should throw an error if the name is not given', async () => {
        const { name, ...invalidCreateUserDto } = createUserDto;
        await request(app.getHttpServer())
          .post('/users')
          .send(invalidCreateUserDto)
          .expect(400)
          .expect(response => {
            expect(response.body.message).toEqual(['name should not be empty']);
          });
      });

      it('should throw an error if the last name is not given', async () => {
        const { lastName, ...invalidCreateUserDto } = createUserDto;
        await request(app.getHttpServer())
          .post('/users')
          .send(invalidCreateUserDto)
          .expect(400)
          .expect(response => {
            expect(response.body.message).toEqual([
              'lastName should not be empty',
            ]);
          });
      });

      it('should throw an error if the birth date is invalid', async () => {
        const invalidCreateUserDto = {
          ...createUserDto,
          birthDate: '20-20-2020',
        };
        await request(app.getHttpServer())
          .post('/users')
          .send(invalidCreateUserDto)
          .expect(400)
          .expect(response => {
            expect(response.body.message).toEqual([
              'birthDate must be a valid ISO 8601 date string',
            ]);
          });
      });

      it('should throw an error if the email is invalid', async () => {
        const invalidCreateUserDto = {
          ...createUserDto,
          email: 'invalidemail',
        };
        await request(app.getHttpServer())
          .post('/users')
          .send(invalidCreateUserDto)
          .expect(400)
          .expect(response => {
            expect(response.body.message).toEqual(['email must be an email']);
          });
      });

      it('should throw an error if the password is not provided', async () => {
        const { password, ...invalidCreateUserDto } = createUserDto;
        await request(app.getHttpServer())
          .post('/users')
          .send(invalidCreateUserDto)
          .expect(400)
          .expect(response => {
            expect(response.body.message).toEqual([
              'password should not be empty',
            ]);
          });
      });
    });

    it('should throw an error if there is an user with the same email', async () => {
      const user = entityManager.create(User, createUserDto);
      await entityManager.save(user);
      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400)
        .expect(response => {
          expect(response.body.message).toBe(
            'The email provided is already in use',
          );
        });
    });

    it('should work correctly', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201)
        .expect(response => {
          const {
            body: { createdAt, ...partialCreatedUser },
          } = response;
          expect(partialCreatedUser).toEqual({
            birthDate: '1995-09-19T00:00:00.000Z',
            email: 'cf.agudelo96@gmail.com',
            name: 'Carlos',
            lastName: 'Agudelo',
            userId: 'de87b61c7b6cdccb32edeed3890244ce',
          });
        });
    });
  });

  describe('logs in a user', () => {
    const logInRequest: LogInRequestDto = {
      email: 'cf.agudelo96@gmail.com',
      password: 'Test12345',
    };

    let user: User;

    beforeEach(async () => {
      user = entityManager.create(User, {
        ...logInRequest,
        birthDate: '1995-09-19',
        name: 'Carlos',
        lastName: 'Agudelo',
      });
      user = await entityManager.save(user);
    });

    describe('validates required fields', () => {
      it('should throw an error if the email is not provided', async () => {
        const { email, ...invalidLogInRequestDto } = logInRequest;
        await request(app.getHttpServer())
          .post('/users/log-in')
          .send(invalidLogInRequestDto)
          .expect(400)
          .expect(response => {
            expect(response.body.message).toEqual([
              'email should not be empty',
            ]);
          });
      });

      it('should throw an error if the password is not provided', async () => {
        const { password, ...invalidLogInRequestDto } = logInRequest;
        await request(app.getHttpServer())
          .post('/users/log-in')
          .send(invalidLogInRequestDto)
          .expect(400)
          .expect(response => {
            expect(response.body.message).toEqual([
              'password should not be empty',
            ]);
          });
      });
    });

    it('should throw an error if a user with the email provided does not exist', async () => {
      const logInRequestNoUser = {
        ...logInRequest,
        email: 'cf.agudelo95@gmail.com',
      };
      await request(app.getHttpServer())
        .post('/users/log-in')
        .send(logInRequestNoUser)
        .expect(400)
        .expect(response => {
          expect(response.body.message).toEqual(
            'There is no user registered with the email provided',
          );
        });
    });

    it('should throw an error if the password is incorrect', async () => {
      const logInRequestIncorrectPassword = {
        ...logInRequest,
        password: '12345',
      };
      await request(app.getHttpServer())
        .post('/users/log-in')
        .send(logInRequestIncorrectPassword)
        .expect(400)
        .expect(response => {
          expect(response.body.message).toEqual('Invalid password');
        });
    });

    it('should work correctly', async () => {
      await request(app.getHttpServer())
        .post('/users/log-in')
        .send(logInRequest)
        .expect(200)
        .expect(response => {
          expect(response.body.token).toBeDefined();
        });
    });
  });
});
