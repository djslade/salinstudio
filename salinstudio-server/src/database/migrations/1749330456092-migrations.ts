import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1749330456092 implements MigrationInterface {
    name = 'Migrations1749330456092'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "art" ADD "onHomeCarousel" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "art" ADD "homeCarouselIndex" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "art" DROP COLUMN "homeCarouselIndex"`);
        await queryRunner.query(`ALTER TABLE "art" DROP COLUMN "onHomeCarousel"`);
    }

}
