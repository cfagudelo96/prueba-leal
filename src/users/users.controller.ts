import { Controller, Get, Post, HttpCode, Body, Param } from '@nestjs/common';

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
