import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1755903958832 implements MigrationInterface {
    name = 'Migrations1755903958832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "action" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "path" character varying NOT NULL, "tag" character varying NOT NULL, "visitorId" uuid, CONSTRAINT "PK_2d9db9cf5edfbbae74eb56e3a39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "visitor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "continent" character varying NOT NULL, "country" character varying NOT NULL, "city" character varying NOT NULL, "timezone" character varying NOT NULL, "isMobileUser" boolean NOT NULL, "isUsingProxy" boolean NOT NULL, "isTester" boolean NOT NULL, CONSTRAINT "PK_ba6ae421d03de90a99ed838741d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lookup_throttle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" date NOT NULL, CONSTRAINT "PK_9a8e390928c46bb2cf2b8280b25" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "action" ADD CONSTRAINT "FK_469754e0e734917762a4ce1e171" FOREIGN KEY ("visitorId") REFERENCES "visitor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "action" DROP CONSTRAINT "FK_469754e0e734917762a4ce1e171"`);
        await queryRunner.query(`DROP TABLE "lookup_throttle"`);
        await queryRunner.query(`DROP TABLE "visitor"`);
        await queryRunner.query(`DROP TABLE "action"`);
    }

}
