import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1778950000000 implements MigrationInterface {
  name = 'Migrations1778950000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "setting" (
                "key" VARCHAR NOT NULL,
                "value" TEXT NOT NULL,
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_setting_key" PRIMARY KEY ("key")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "setting"`);
  }
}
