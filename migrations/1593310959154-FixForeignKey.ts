import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixForeignKey1593310959154 implements MigrationInterface {
  name = 'FixForeignKey1593310959154';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" float NOT NULL, "points" integer NOT NULL, "status" integer NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL, "userUserId" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transaction"("id", "value", "points", "status", "createdAt", "userId", "userUserId") SELECT "id", "value", "points", "status", "createdAt", "userId", "userUserId" FROM "transaction"`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_transaction" RENAME TO "transaction"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" float NOT NULL, "points" integer NOT NULL, "status" integer NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transaction"("id", "value", "points", "status", "createdAt", "userId") SELECT "id", "value", "points", "status", "createdAt", "userId" FROM "transaction"`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_transaction" RENAME TO "transaction"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" float NOT NULL, "points" integer NOT NULL, "status" integer NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL, CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user" ("userId") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transaction"("id", "value", "points", "status", "createdAt", "userId") SELECT "id", "value", "points", "status", "createdAt", "userId" FROM "transaction"`,
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
      `CREATE TABLE "transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" float NOT NULL, "points" integer NOT NULL, "status" integer NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "transaction"("id", "value", "points", "status", "createdAt", "userId") SELECT "id", "value", "points", "status", "createdAt", "userId" FROM "temporary_transaction"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_transaction"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" RENAME TO "temporary_transaction"`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" float NOT NULL, "points" integer NOT NULL, "status" integer NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL, "userUserId" varchar)`,
    );
    await queryRunner.query(
      `INSERT INTO "transaction"("id", "value", "points", "status", "createdAt", "userId") SELECT "id", "value", "points", "status", "createdAt", "userId" FROM "temporary_transaction"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_transaction"`);
    await queryRunner.query(
      `ALTER TABLE "transaction" RENAME TO "temporary_transaction"`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" float NOT NULL, "points" integer NOT NULL, "status" integer NOT NULL DEFAULT (1), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" varchar NOT NULL, "userUserId" varchar, CONSTRAINT "FK_ae172769e4ad93ccd65fdbe3407" FOREIGN KEY ("userUserId") REFERENCES "user" ("userId") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "transaction"("id", "value", "points", "status", "createdAt", "userId", "userUserId") SELECT "id", "value", "points", "status", "createdAt", "userId", "userUserId" FROM "temporary_transaction"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_transaction"`);
  }
}
