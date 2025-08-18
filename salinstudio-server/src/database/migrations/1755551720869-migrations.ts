import { nanoid } from 'nanoid';
import slugify from 'slugify';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1755551720869 implements MigrationInterface {
  name = 'Migrations1755551720869';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "art" ADD "slug" character varying`);

    const artworks: { id: string; titleEn: string }[] = await queryRunner.query(
      `SELECT "id", "titleEn" FROM "art"`,
    );
    for (const art of artworks) {
      const base = slugify(art.titleEn, { lower: true, strict: true });
      const id = nanoid(6);
      const slug = `${base}-${id}`;

      await queryRunner.query(`UPDATE "art" SET "slug" = $1 WHERE "id" = $2`, [
        slug,
        art.id,
      ]);
    }

    await queryRunner.query(
      `ALTER TABLE "art" ALTER COLUMN "slug" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "art" ADD CONSTRAINT "UQ_18d21bb1b31603ba17d515285f8" UNIQUE ("slug")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "art" DROP CONSTRAINT "UQ_18d21bb1b31603ba17d515285f8"`,
    );
    await queryRunner.query(`ALTER TABLE "art" DROP COLUMN "slug"`);
  }
}
