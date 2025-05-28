import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class StorageService {
  private s3: S3;

  constructor() {
    const accessKeyId = process.env.YC_ACCESS_KEY;
    const secretAccessKey = process.env.YC_SECRET_KEY;

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('Missing Yandex Cloud credentials');
    }

    this.s3 = new S3({
      endpoint: 'https://storage.yandexcloud.net',
      region: 'ru-central1',
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, bucket: string) {
    const { originalname, buffer, mimetype } = file;
    const key = `${Date.now()}-${originalname}`;

    const uploadResult = await this.s3
      .upload({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
        ACL: 'public-read',
      })
      .promise();

    return {
      location: uploadResult.Location,
      key: uploadResult.Key,
    };
  }

  async deleteFile(bucket: string, key: string) {
    await this.s3
      .deleteObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();
  }
}
