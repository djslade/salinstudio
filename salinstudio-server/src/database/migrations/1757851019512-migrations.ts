import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1757851019512 implements MigrationInterface {
    name = 'Migrations1757851019512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "art_collections_collection" ("artId" uuid NOT NULL, "collectionId" uuid NOT NULL, CONSTRAINT "PK_a57fe18b7bcc228f6b3618f6b46" PRIMARY KEY ("artId", "collectionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b43d571aadb6ce21471957a66e" ON "art_collections_collection" ("artId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ad3848400d1fa3d6c1b77fc5b4" ON "art_collections_collection" ("collectionId") `);
        await queryRunner.query(`ALTER TABLE "art_collections_collection" ADD CONSTRAINT "FK_b43d571aadb6ce21471957a66e3" FOREIGN KEY ("artId") REFERENCES "art"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "art_collections_collection" ADD CONSTRAINT "FK_ad3848400d1fa3d6c1b77fc5b46" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "art_collections_collection" DROP CONSTRAINT "FK_ad3848400d1fa3d6c1b77fc5b46"`);
        await queryRunner.query(`ALTER TABLE "art_collections_collection" DROP CONSTRAINT "FK_b43d571aadb6ce21471957a66e3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad3848400d1fa3d6c1b77fc5b4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b43d571aadb6ce21471957a66e"`);
        await queryRunner.query(`DROP TABLE "art_collections_collection"`);
    }

}
