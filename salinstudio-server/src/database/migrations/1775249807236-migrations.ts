import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1775249807236 implements MigrationInterface {
    name = 'Migrations1775249807236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchasable" ADD "isFeatured" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchasable" ADD "isOnSale" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchasable" ADD "titleEn" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchasable" ADD "titleFi" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchasable" ADD "infoEn" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchasable" ADD "infoFi" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchasable" DROP COLUMN "infoFi"`);
        await queryRunner.query(`ALTER TABLE "purchasable" DROP COLUMN "infoEn"`);
        await queryRunner.query(`ALTER TABLE "purchasable" DROP COLUMN "titleFi"`);
        await queryRunner.query(`ALTER TABLE "purchasable" DROP COLUMN "titleEn"`);
        await queryRunner.query(`ALTER TABLE "purchasable" DROP COLUMN "isOnSale"`);
        await queryRunner.query(`ALTER TABLE "purchasable" DROP COLUMN "isFeatured"`);
    }

}
