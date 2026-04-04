import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import environment from '../config/environment';

const s3Client = new S3Client({
    region: environment.AWS_REGION,
    credentials: {
        accessKeyId: environment.AWS_ACCESS_KEY_ID,
        secretAccessKey: environment.AWS_SECRET_ACCESS_KEY,
    },
});

export async function uploadToS3(buffer: Buffer, key: string, mimeType: string): Promise<string> {
    await s3Client.send(
        new PutObjectCommand({
            Bucket: environment.AWS_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        }),
    );

    return `https://${environment.AWS_BUCKET}.s3.${environment.AWS_REGION}.amazonaws.com/${key}`;
}

export async function deleteFromS3(key: string): Promise<void> {
    await s3Client.send(
        new DeleteObjectCommand({
            Bucket: environment.AWS_BUCKET,
            Key: key,
        }),
    );
}

export function extractS3Key(url: string): string {
    const marker = '.amazonaws.com/';
    const index = url.indexOf(marker);
    return index !== -1 ? url.slice(index + marker.length) : '';
}
