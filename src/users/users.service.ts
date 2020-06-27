import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    await this.validateUniqueEmail(createUserDto.email);
    return this.usersRepository.save(createUserDto.toEntity());
  }

  private async validateUniqueEmail(email: string): Promise<void> {
    const existingUser = await this.usersRepository.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('The email provided is already in use');
    }
  }
}
