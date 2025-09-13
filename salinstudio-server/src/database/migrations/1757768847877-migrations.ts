import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1757768847877 implements MigrationInterface {
    name = 'Migrations1757768847877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" ADD "aspectRatio" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "aspectRatio"`);
    }

}
