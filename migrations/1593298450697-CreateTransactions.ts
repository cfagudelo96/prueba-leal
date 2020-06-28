import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTransactions1593298450697 implements MigrationInterface {
  name = 'CreateTransactions1593298450697';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("userId" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "lastName" varchar NOT NULL, "birthDate" date NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("userId", "name", "lastName", "birthDate", "email", "password", "createdAt") SELECT "userId", "name", "lastName", "birthDate", "email", "password", "createdAt" FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" float NOT NULL, "points" integer NOT NULL, "status" integer NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL, "userUserId" varchar)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_user" ("userId" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "lastName" varchar NOT NULL, "birthDate" date NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_ed766a9782779b8390a2a81f444" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_user"("userId", "name", "lastName", "birthDate", "email", "password", "createdAt") SELECT "userId", "name", "lastName", "birthDate", "email", "password", "createdAt" FROM "user"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" float NOT NULL, "points" integer NOT NULL, "status" integer NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL, "userUserId" varchar, CONSTRAINT "FK_ae172769e4ad93ccd65fdbe3407" FOREIGN KEY ("userUserId") REFERENCES "user" ("userId") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transaction"("id", "value", "points", "status", "createdAt", "userId", "userUserId") SELECT "id", "value", "points", "status", "createdAt", "userId", "userUserId" FROM "transaction"`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_transaction" RENAME TO "transaction"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" RENAME TO "temporary_transaction"`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" float NOT NULL, "points" integer NOT NULL, "status" integer NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL, "userUserId" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "transaction"("id", "value", "points", "status", "createdAt", "userId", "userUserId") SELECT "id", "value", "points", "status", "createdAt", "userId", "userUserId" FROM "temporary_transaction"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_transaction"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("userId" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "lastName" varchar NOT NULL, "birthDate" date NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("userId", "name", "lastName", "birthDate", "email", "password", "createdAt") SELECT "userId", "name", "lastName", "birthDate", "email", "password", "createdAt" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(
      `CREATE TABLE "user" ("userId" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "lastName" varchar NOT NULL, "birthDate" date NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "user"("userId", "name", "lastName", "birthDate", "email", "password", "createdAt") SELECT "userId", "name", "lastName", "birthDate", "email", "password", "createdAt" FROM "temporary_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_user"`);
  }
}
