import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Column,
  BeforeInsert,
  JoinColumn,
} from 'typeorm';
import * as Excel from 'exceljs';

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

  static getExportWorkbook(): Excel.Workbook {
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet('Transactions');
    sheet.columns = this.getExcelColumns();
    return workbook;
  }

  private static getExcelColumns(): Array<Partial<Excel.Column>> {
    return [
      { header: 'Id', key: 'id' },
      { header: 'Value', key: 'value' },
      { header: 'Points', key: 'points' },
      { header: 'Status', key: 'status' },
      { header: 'Creation date', key: 'createdAt' },
    ];
  }

  @BeforeInsert()
  calculatePoints(): void {
    this.points = Math.floor(this.value / 1000);
  }
}
