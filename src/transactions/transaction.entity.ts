import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Column,
  BeforeInsert,
  JoinColumn,
} from 'typeorm';

import { User } from '../users/user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  value: number;

  @Column({ type: 'int' })
  points: number;

  @Column({ type: 'int', default: 1 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(
    () => User,
    user => user.transactions,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;

  @Column()
  userId: string;

  constructor(partial?: Partial<Transaction>) {
    Object.assign(this, partial);
  }

  @BeforeInsert()
  calculatePoints(): void {
    this.points = Math.floor(this.value / 1000);
  }
}
