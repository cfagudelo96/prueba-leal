import {
  Controller,
  Get,
  Post,
  HttpCode,
  Body,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { Transaction } from '../transactions/transaction.entity';

import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { LogInRequestDto, LogInResponseDto } from './dtos/log-in.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/transactions')
  getTransactions(@Param('id') id: string): Promise<Transaction[]> {
    return this.usersService.getTransactions(id);
  }

  @Get(':id/transactions-file')
  async getTransactionsFile(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.usersService.getTransactionsFile(id);
    res.setHeader('Content-Transfer-Encoding', 'binary');
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Transactions-${id}.xlsx"`,
    );
    res.send(buffer);
  }

  @Get(':id/points')
  getPoints(@Param('id') id: string): Promise<{ points: number }> {
    return this.usersService.getPoints(id);
  }

  @Post()
  register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.register(createUserDto);
  }

  @Post('log-in')
  @HttpCode(200)
  logIn(@Body() logInRequestDto: LogInRequestDto): Promise<LogInResponseDto> {
    return this.usersService.logIn(logInRequestDto);
  }
}
