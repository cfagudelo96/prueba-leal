import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { MD5 } from 'crypto-js';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class User {
  private static readonly SALT_ROUNDS = 10;

  @PrimaryColumn()
  userId: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => Transaction,
    transaction => transaction.user,
  )
  transactions: Promise<Transaction[]>;

  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }

  @BeforeInsert()
  calculateUserId(): void {
    this.userId = MD5(this.email).toString();
  }

  @BeforeInsert()
  async encryptPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, User.SALT_ROUNDS);
  }

  isSamePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
