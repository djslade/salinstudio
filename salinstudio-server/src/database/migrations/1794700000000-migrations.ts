import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1794700000000 implements MigrationInterface {
  name = 'Migrations1794700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "image" ADD "galleryArtId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "image" ADD "galleryIndex" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_f34ec6f04e9f94175c3ea5a374a" FOREIGN KEY ("galleryArtId") REFERENCES "art"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    // Existing artworks: their single image becomes the lead of their image list.
    await queryRunner.query(`
      UPDATE "image" i
      SET "galleryArtId" = a."id", "galleryIndex" = 0
      FROM "art" a
      WHERE a."imageId" = i."id"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "image" DROP CONSTRAINT "FK_f34ec6f04e9f94175c3ea5a374a"`,
    );
    await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "galleryIndex"`);
    await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "galleryArtId"`);
  }
}
