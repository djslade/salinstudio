import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1777811695592 implements MigrationInterface {
    name = 'Migrations1777811695592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."flag_minrole_enum" AS ENUM('admin', 'dev')`);
        await queryRunner.query(`CREATE TABLE "flag" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "isEnabled" boolean NOT NULL, "minRole" "public"."flag_minrole_enum" NOT NULL DEFAULT 'dev', "sample" integer NOT NULL, CONSTRAINT "PK_17b74257294fdfd221178a132d4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "flag"`);
        await queryRunner.query(`DROP TYPE "public"."flag_minrole_enum"`);
    }

}
