import { Controller, Post, Body, HttpCode } from '@nestjs/common';

import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { LogInRequestDto, LogInResponseDto } from './dtos/log-in.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
