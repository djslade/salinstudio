import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1755966139959 implements MigrationInterface {
    name = 'Migrations1755966139959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "visitor" ADD "countryCode" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "visitor" DROP COLUMN "countryCode"`);
    }

}
