/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PartDetail } from './PartDetail';
export type CompleteUploadDto = {
  /**
   * 文件S3 Key
   */
  key: string;
  /**
   * 上传ID
   */
  uploadId: string;
  /**
   * 已上传分片列表
   */
  parts: Array<PartDetail>;
};

