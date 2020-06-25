import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1593115261705 implements MigrationInterface {
  name = 'CreateUsers1593115261705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" (
        "userId" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "lastName" varchar NOT NULL,
        "birthDate" date NOT NULL,
        "email" varchar NOT NULL,
        "password" varchar NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now'))
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
