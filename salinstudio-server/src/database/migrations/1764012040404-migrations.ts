import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1764012040404 implements MigrationInterface {
  name = 'Migrations1764012040404';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchasable" ADD "year" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchasable" ADD "techniqueEn" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchasable" ADD "techniqueFi" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchasable" ADD "nanoId" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "purchasable" DROP COLUMN "nanoId"`);
    await queryRunner.query(
      `ALTER TABLE "purchasable" DROP COLUMN "techniqueFi"`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchasable" DROP COLUMN "techniqueEn"`,
    );
    await queryRunner.query(`ALTER TABLE "purchasable" DROP COLUMN "year"`);
  }
}
