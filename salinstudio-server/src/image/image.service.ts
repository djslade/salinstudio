import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

type FingerprintConfig = {
  year: number;
  month: number;
  date: number;
  checksum: number;
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
    return sharp(buffer)
      .withExif({
        IFD0: {
          Copyright: '© Miia Salin. All rights reserved.',
        },
      })
      .toBuffer();
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
      .toBuffer();
  }

  async toWebp(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer).webp().toBuffer();
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
    const name = `${Date.now()}`;
    const full = await this.addFingerprint(withCopyright, config);
    const thumb =
      width > 360 ? await this.genThumbnail(withCopyright, config) : full;
    const mobile =
      width > 600 ? await this.genMobile(withCopyright, config) : full;
    const desktop =
      width > 1200 ? await this.genDesktop(withCopyright, config) : full;
    return {
      name,
      full,
      thumb,
      mobile,
      desktop,
      fingerprintChecksum: config.checksum,
    };
  }
}
