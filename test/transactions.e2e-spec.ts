import * as request from 'supertest';
import { Reflector } from '@nestjs/core';
import {
  INestApplication,
  ValidationPipe,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityManager, Connection } from 'typeorm';

import { User } from '../src/users/user.entity';
import { TransactionsModule } from '../src/transactions/transactions.module';
import { Transaction } from '../src/transactions/transaction.entity';
import { CreateTransactionDto } from '../src/transactions/dtos/create-transaction.dto';

describe('Transactions', () => {
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
        TransactionsModule,
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
    await entityManager.clear(Transaction);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('creates a new transaction', () => {
    let createTransactionDto: CreateTransactionDto;

    let user: User;

    beforeEach(async () => {
      user = entityManager.create(User, {
        email: 'cf.agudelo96@gmail.com',
        password: 'Test12345',
        birthDate: '1995-09-19',
        name: 'Carlos',
        lastName: 'Agudelo',
      });
      user = await entityManager.save(user);
      createTransactionDto = new CreateTransactionDto({
        userId: user.userId,
        value: 8750,
      });
    });

    describe('validates required fields', () => {
      it('should throw an error if the user id is not provided', async () => {
        const { userId, ...invalidCreateTransactionDto } = createTransactionDto;
        await request(app.getHttpServer())
          .post('/transactions')
          .send(invalidCreateTransactionDto)
          .expect(400)
          .expect(response => {
            expect(response.body.message).toEqual([
              'userId should not be empty',
            ]);
          });
      });

      it('should throw an error if the value is invalid', async () => {
        const invalidCreateTransactionDto = {
          ...createTransactionDto,
          value: -1,
        };
        await request(app.getHttpServer())
          .post('/transactions')
          .send(invalidCreateTransactionDto)
          .expect(400)
          .expect(response => {
            expect(response.body.message).toEqual([
              'value must not be less than 0',
            ]);
          });
      });
    });

    it('should throw an error if the user from the transaction does not exist', async () => {
      const invalidCreateTransactionDto = {
        ...createTransactionDto,
        userId: createTransactionDto.userId + 'Oops',
      };
      await request(app.getHttpServer())
        .post('/transactions')
        .send(invalidCreateTransactionDto)
        .expect(400)
        .expect(response => {
          expect(response.body.message).toEqual('The user was not found');
        });
    });

    it('should work correctly', async () => {
      await request(app.getHttpServer())
        .post('/transactions')
        .send(createTransactionDto)
        .expect(201)
        .expect(response => {
          const {
            body: { createdAt, id, ...partialCreatedTransaction },
          } = response;
          expect(partialCreatedTransaction).toEqual({
            userId: user.userId,
            value: 8750,
            points: 8,
            status: 1,
          });
        });
    });
  });
});
