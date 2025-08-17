import { Injectable } from '@nestjs/common';
import { exiftool } from 'exiftool-vendored';
import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import * as sharp from 'sharp';

type FingerprintConfig = {
  year: number;
  month: number;
  date: number;
  checksum: number;
};

type FIleNames = {
  fullUrl: string;
  desktopUrl: string;
  mobileUrl: string;
  thumbUrl: string;
};

@Injectable()
export class ImageService {
  async getImageMetadata(buffer: Buffer) {
    const { width, height } = await sharp(buffer).metadata();
    return {
      width: width ?? 0,
      height: height ?? 0,
    };
  }

  async embedCopyright(buffer: Buffer): Promise<Buffer> {
    const tmp = join(tmpdir(), `img-${Date.now()}.jpg`);
    await fs.writeFile(tmp, buffer);

    await exiftool.write(tmp, {
      Copyright: '© Miia Salin. All rights reserved.',
      Artist: 'Miia Salin',
    });

    const embeddedBuffer = await fs.readFile(tmp);
    await fs.unlink(tmp);

    return embeddedBuffer;
  }

  getFileNames(): FIleNames {
    const name = Date.now();
    return {
      fullUrl: `full/${name}.webp`,
      desktopUrl: `desktop/${name}.webp`,
      mobileUrl: `mobile/${name}.webp`,
      thumbUrl: `thumb/${name}.webp`,
    };
  }

  getFingerprintConfig(currentDate?: Date): FingerprintConfig {
    const now = currentDate ?? new Date();
    const year = now.getFullYear() - 2000;
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const checksum = year + month + date;
    return {
      year,
      month,
      date,
      checksum,
    };
  }

  async addFingerprint(
    buffer: Buffer,
    config: FingerprintConfig,
  ): Promise<Buffer> {
    const { width, height } = await this.getImageMetadata(buffer);
    const artistCodeLeft = 77;
    const artistCodeRight = 83;
    return sharp(buffer)
      .composite([
        {
          input: Buffer.from([artistCodeLeft, config.year, artistCodeRight]),
          raw: { width: 1, height: 1, channels: 3 },
          left: 0,
          top: 0,
        },
        {
          input: Buffer.from([artistCodeLeft, config.month, artistCodeRight]),
          raw: { width: 1, height: 1, channels: 3 },
          left: width - 1,
          top: 0,
        },
        {
          input: Buffer.from([artistCodeLeft, config.date, artistCodeRight]),
          raw: { width: 1, height: 1, channels: 3 },
          left: 0,
          top: height - 1,
        },
        {
          input: Buffer.from([
            artistCodeLeft,
            config.checksum,
            artistCodeRight,
          ]),
          raw: { width: 1, height: 1, channels: 3 },
          left: width - 1,
          top: height - 1,
        },
      ])
      .webp({ lossless: true, quality: 100 })
      .toBuffer();
  }

  async resizeImage(buffer: Buffer, width: number): Promise<Buffer> {
    return sharp(buffer).resize(width).toBuffer();
  }

  async genThumbnail(
    buffer: Buffer,
    config: FingerprintConfig,
  ): Promise<Buffer> {
    const thumb = await this.resizeImage(buffer, 360);
    return await this.addFingerprint(thumb, config);
  }

  async genMobile(buffer: Buffer, config: FingerprintConfig): Promise<Buffer> {
    const mobile = await this.resizeImage(buffer, 600);
    return await this.addFingerprint(mobile, config);
  }

  async genDesktop(buffer: Buffer, config: FingerprintConfig): Promise<Buffer> {
    const desktop = await this.resizeImage(buffer, 1200);
    return await this.addFingerprint(desktop, config);
  }

  async processImage(buffer: Buffer) {
    const withCopyright = await this.embedCopyright(buffer);
    const { width } = await this.getImageMetadata(withCopyright);
    const config = this.getFingerprintConfig();
    const full = await this.addFingerprint(withCopyright, config);
    const thumb =
      width > 360 ? await this.genThumbnail(withCopyright, config) : full;
    const mobile =
      width > 600 ? await this.genMobile(withCopyright, config) : full;
    const desktop =
      width > 1200 ? await this.genDesktop(withCopyright, config) : full;
    return {
      full,
      thumb,
      mobile,
      desktop,
      fingerprintChecksum: config.checksum,
    };
  }

  isFingerprintPixel(pixel: Buffer): boolean {
    return pixel[0] === 77 && pixel[2] === 83;
  }

  async extractFingerprint(buffer: Buffer): Promise<FingerprintConfig | null> {
    const { width, height } = await this.getImageMetadata(buffer);
    const image = sharp(buffer);

    const [topLeft, topRight, bottomLeft, bottomRight] = await Promise.all([
      image
        .clone()
        .extract({ left: 0, top: 0, width: 1, height: 1 })
        .raw()
        .toBuffer(),
      image
        .clone()
        .extract({ left: width - 1, top: 0, width: 1, height: 1 })
        .raw()
        .toBuffer(),
      image
        .clone()
        .extract({ left: 0, top: height - 1, width: 1, height: 1 })
        .raw()
        .toBuffer(),
      image
        .clone()
        .extract({ left: width - 1, top: height - 1, width: 1, height: 1 })
        .raw()
        .toBuffer(),
    ]);

    if (
      !this.isFingerprintPixel(topLeft) ||
      !this.isFingerprintPixel(topRight) ||
      !this.isFingerprintPixel(bottomLeft) ||
      !this.isFingerprintPixel(bottomRight)
    ) {
      return null;
    }

    const year = topLeft[1];
    const month = topRight[1];
    const date = bottomLeft[1];
    const checksum = bottomRight[1];

    if (checksum !== year + month + date) {
      return null;
    }

    return { year, month, date, checksum };
  }
}
