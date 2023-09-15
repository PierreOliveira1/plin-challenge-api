import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    bucketName: string,
    key: string,
  ): Promise<string> {
    const params = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    });

    try {
      await this.s3.send(params);
      return `https://${bucketName}.s3.amazonaws.com/${key}`;
    } catch (error) {
      throw new Error('Erro ao fazer upload da imagem');
    }
  }

  async deleteFile(bucketName: string, key: string) {
    const params = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    try {
      await this.s3.send(params);
    } catch (error) {
      throw new Error('Erro ao deletar o objeto');
    }
  }
}
