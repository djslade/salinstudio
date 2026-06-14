import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1781395200000 implements MigrationInterface {
  name = 'Migrations1781395200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "lookup_throttle"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "lookup_throttle" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "expiresAt" date NOT NULL,
        CONSTRAINT "PK_lookup_throttle_id" PRIMARY KEY ("id")
      )
    `);
  }
}
