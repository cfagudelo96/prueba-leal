import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { Transaction } from '../transactions/transaction.entity';
import { TransactionsService } from '../transactions/transactions.service';

import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { LogInRequestDto, LogInResponseDto } from './dtos/log-in.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionsService: TransactionsService,
  ) {}

  async findByIdOrFail(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) throw new BadRequestException('The user was not found');
    return user;
  }

  async getTransactions(id: string): Promise<Transaction[]> {
    await this.findByIdOrFail(id);
    return this.transactionsService.findByUser(id);
  }

  async getTransactionsFile(id: string): Promise<Buffer> {
    const transactions = await this.getTransactions(id);
    const workbook = Transaction.getExportWorkbook();
    const sheet = workbook.getWorksheet('Transactions');
    sheet.addRows(transactions, 'i');
    return workbook.xlsx.writeBuffer() as Promise<Buffer>;
  }

  async getPoints(id: string): Promise<{ points: number }> {
    await this.findByIdOrFail(id);
    const query = this.usersRepository
      .createQueryBuilder('user')
      .select('COALESCE(SUM(transaction.points), 0)', 'points')
      .innerJoin('user.transactions', 'transaction', 'transaction.status = 1')
      .where('user.userId = :id', { id });
    return query.getRawOne();
  }

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

  async logIn(logInRequestDto: LogInRequestDto): Promise<LogInResponseDto> {
    const { email, password } = logInRequestDto;
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new BadRequestException(
        'There is no user registered with the email provided',
      );
    }
    if (!(await user.isSamePassword(password))) {
      throw new BadRequestException('Invalid password');
    }
    const token = this.jwtService.sign({ userId: user.userId });
    return { token };
  }
}
