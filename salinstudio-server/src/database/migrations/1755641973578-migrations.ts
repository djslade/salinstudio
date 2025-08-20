import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1755641973578 implements MigrationInterface {
    name = 'Migrations1755641973578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."mail_topic_enum" AS ENUM('contact', 'commission')`);
        await queryRunner.query(`CREATE TABLE "mail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "topic" "public"."mail_topic_enum" NOT NULL DEFAULT 'contact', "name" character varying NOT NULL, "emailAddress" character varying NOT NULL, "message" character varying NOT NULL, CONSTRAINT "PK_5407da42b983ba54c6c62d462d3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "mail"`);
        await queryRunner.query(`DROP TYPE "public"."mail_topic_enum"`);
    }

}
