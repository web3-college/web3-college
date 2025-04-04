/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VideoPartDto = {
  /**
   * 文件S3 Key
   */
  key: string;
  /**
   * 上传ID
   */
  uploadId: string;
  /**
   * 分片编号
   */
  partNumber: number;
  /**
   * 分片文件
   */
  file: Blob;
};

