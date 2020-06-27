import { IsNotEmpty, IsEmail, IsISO8601 } from 'class-validator';

import { User } from '../user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  lastName: string;

  @IsISO8601({ strict: true })
  birthDate: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  constructor(partial?: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }

  toEntity(): User {
    const birthDateAsDate = new Date(this.birthDate);
    return new User({ ...this, birthDate: birthDateAsDate });
  }
}
