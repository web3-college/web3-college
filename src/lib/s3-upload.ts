import { CompleteMultipartUploadCommand, CreateMultipartUploadCommand, HeadObjectCommand, PutObjectCommand, S3Client, UploadPartCommand } from "@aws-sdk/client-s3";
import { calculateMd5 } from "./md5-calculator";

const region = process.env.NEXT_PUBLIC_AWS_S3_REGION || '';
const accessKeyId = process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY || '';
const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || '';

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  }
});

export const checkFileExists = async (key: string) => {
  const command = new HeadObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  try {
    await s3Client.send(command);
    return true;
  } catch (error) {
    return false;
  }
};

export const s3UploadSmall = async (file: File) => {
  const md5 = await calculateMd5(file);
  console.log('md5', md5);
  const isExists = await checkFileExists(md5);
  console.log('isExists', isExists);
  if (isExists) {
    return {
      fileName: file.name,
      key: md5,
      url: `${process.env.NEXT_PUBLIC_CDN_URL}/${md5}`
    };
  }
  const arrayBuffer = await file.arrayBuffer();
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: md5,
    Body: new Uint8Array(arrayBuffer),
    ContentType: file.type,
  });

  await s3Client.send(command);

  return {
    fileName: file.name,
    key: md5,
    url: `${process.env.NEXT_PUBLIC_CDN_URL}/${md5}`
  };
};

export const s3InitMultipartUpload = async (file: File) => {
  const md5 = await calculateMd5(file);
  console.log('md5', md5);
  const isExists = await checkFileExists(md5);
  console.log('isExists', isExists);
  if (isExists) {
    return {
      key: md5,
      uploadId: "",
      directUrl: `${process.env.NEXT_PUBLIC_CDN_URL}/${md5}`
    };
  }
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);
  const command = new CreateMultipartUploadCommand({
    Bucket: bucketName,
    Key: md5,
    ContentType: file.type,
    Metadata: {
      'original-name': encodeURIComponent(file.name),
      'upload-date': new Date().toISOString(),
      'expiration-date': expirationDate.toISOString(),
    },
  });
  const result = await s3Client.send(command);
  return {
    key: md5,
    uploadId: result.UploadId,
  };
}

export const s3UploadMultipart = async (chunk: Blob, partNumber: number, key: string, uploadId: string) => {
  try {
    const arrayBuffer = await chunk.arrayBuffer();
    const command = new UploadPartCommand({
      Bucket: bucketName,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
      Body: new Uint8Array(arrayBuffer),
    });
    const result = await s3Client.send(command);
    return {
      ETag: result.ETag || "",
      PartNumber: partNumber,
    };
  } catch (error) {
    console.log('分片上传失败', error);
    return null;
  }
}

export const s3CompleteMultipartUpload = async (key: string, uploadId: string, partList: { ETag: string, PartNumber: number }[]) => {
  partList.sort((a, b) => a.PartNumber - b.PartNumber);
  const command = new CompleteMultipartUploadCommand({
    Bucket: bucketName,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: partList.map((part) => ({
        ETag: part.ETag,
        PartNumber: part.PartNumber,
      })),
    },
  });
  await s3Client.send(command);
  return {
    url: `${process.env.NEXT_PUBLIC_CDN_URL}/${key}`,
  };
}