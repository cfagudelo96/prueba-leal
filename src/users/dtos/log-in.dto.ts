import { IsNotEmpty } from 'class-validator';

export class LogInResponseDto {
  token: string;
}

export class LogInRequestDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
