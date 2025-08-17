import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1755465343407 implements MigrationInterface {
    name = 'Migrations1755465343407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "art" ADD "updatedFingerprint" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "art" DROP COLUMN "updatedFingerprint"`);
    }

}
