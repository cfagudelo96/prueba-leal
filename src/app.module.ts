import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join, resolve } from 'path';

import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      migrations: [join(resolve(__dirname, '..'), 'migrations/*{.ts,.js}')],
      database: 'data/db.sqlite',
    }),
    UsersModule,
  ],
})
export class AppModule {}