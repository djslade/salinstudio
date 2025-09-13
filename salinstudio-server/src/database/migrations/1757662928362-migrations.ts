import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1757662928362 implements MigrationInterface {
  name = 'Migrations1757662928362';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "collection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "titleEn" character varying NOT NULL, "titleFi" character varying NOT NULL, "descriptionEn" character varying NOT NULL, "descriptionFi" character varying NOT NULL, "imageId" uuid, CONSTRAINT "REL_5c0708ff48feca5216fef7859f" UNIQUE ("imageId"), CONSTRAINT "PK_ad3f485bbc99d875491f44d7c85" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "fullUrl" character varying NOT NULL, "desktopUrl" character varying NOT NULL, "mobileUrl" character varying NOT NULL, "thumbUrl" character varying NOT NULL, "fingerprintChecksum" integer NOT NULL, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "art" ADD "imageId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "art" ADD CONSTRAINT "UQ_33aec14e8e19b670699bd89cc26" UNIQUE ("imageId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "collection" ADD CONSTRAINT "FK_5c0708ff48feca5216fef7859f0" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "art" ADD CONSTRAINT "FK_33aec14e8e19b670699bd89cc26" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    const artworks: {
      id: string;
      fullUrl: string;
      desktopUrl: string;
      mobileUrl: string;
      thumbUrl: string;
      fingerprintChecksum: number;
    }[] = await queryRunner.query(
      `SELECT "id", "fullUrl", "desktopUrl", "mobileUrl", "thumbUrl", "fingerprintChecksum" FROM "art"`,
    );

    for (let art of artworks) {
      const [image]: { id: string }[] = await queryRunner.query(
        `INSERT INTO "image" ("fullUrl", "desktopUrl", "mobileUrl", "thumbUrl", "fingerprintChecksum") VALUES ($1, $2, $3, $4, $5) RETURNING "id"`,
        [
          art.fullUrl,
          art.desktopUrl,
          art.mobileUrl,
          art.thumbUrl,
          art.fingerprintChecksum,
        ],
      );

      await queryRunner.query(
        `UPDATE "art" SET "imageId" = $1 WHERE "id" = $2`,
        [image.id, art.id],
      );
    }

    await queryRunner.query(`ALTER TABLE "art" DROP COLUMN "fullUrl"`);
    await queryRunner.query(`ALTER TABLE "art" DROP COLUMN "desktopUrl"`);
    await queryRunner.query(`ALTER TABLE "art" DROP COLUMN "mobileUrl"`);
    await queryRunner.query(`ALTER TABLE "art" DROP COLUMN "thumbUrl"`);
    await queryRunner.query(
      `ALTER TABLE "art" DROP COLUMN "fingerprintChecksum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "art" DROP CONSTRAINT "FK_33aec14e8e19b670699bd89cc26"`,
    );
    await queryRunner.query(
      `ALTER TABLE "collection" DROP CONSTRAINT "FK_5c0708ff48feca5216fef7859f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "art" DROP CONSTRAINT "UQ_33aec14e8e19b670699bd89cc26"`,
    );
    await queryRunner.query(`ALTER TABLE "art" DROP COLUMN "imageId"`);
    await queryRunner.query(
      `ALTER TABLE "art" ADD "fingerprintChecksum" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "art" ADD "thumbUrl" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "art" ADD "mobileUrl" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "art" ADD "desktopUrl" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "art" ADD "fullUrl" character varying NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "image"`);
    await queryRunner.query(`DROP TABLE "collection"`);
  }
}
