import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1763641346243 implements MigrationInterface {
  name = 'Migrations1763641346243';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "purchasable" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "height" integer NOT NULL, "width" integer NOT NULL, "quantity" integer NOT NULL, "isPublic" boolean NOT NULL, "isOriginal" boolean NOT NULL, "isFramed" boolean NOT NULL, "maxPrice" integer NOT NULL, "currentPrice" integer NOT NULL, "artId" uuid, CONSTRAINT "REL_367357c4fd1f680a460be20a80" UNIQUE ("artId"), CONSTRAINT "PK_39663edca097bb65481e178277e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "image" ADD "purchasableId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_ae9ec5f52694d65bc1f9192e4a4" FOREIGN KEY ("purchasableId") REFERENCES "purchasable"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "purchasable" ADD CONSTRAINT "FK_367357c4fd1f680a460be20a808" FOREIGN KEY ("artId") REFERENCES "art"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "purchasable" DROP CONSTRAINT "FK_367357c4fd1f680a460be20a808"`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" DROP CONSTRAINT "FK_ae9ec5f52694d65bc1f9192e4a4"`,
    );
    await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "purchasableId"`);
    await queryRunner.query(`DROP TABLE "purchasable"`);
  }
}
