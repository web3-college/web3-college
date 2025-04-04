/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AbortUploadDto } from '../models/AbortUploadDto';
import type { CompleteUploadDto } from '../models/CompleteUploadDto';
import type { UploadFileDto } from '../models/UploadFileDto';
import type { VideoPartDto } from '../models/VideoPartDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UploadService {
  /**
   * 检查文件是否已存在
   * 通过MD5检查文件是否已上传过，若存在则返回文件URL
   * @returns any 文件检查结果
   * @throws ApiError
   */
  public static uploadControllerCheckFileExists({
    formData,
  }: {
    formData: UploadFileDto,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/upload/check',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `请求参数错误`,
      },
    });
  }
  /**
   * 上传图片
   * 上传图片文件，返回访问URL
   * @returns any 图片上传成功
   * @throws ApiError
   */
  public static uploadControllerUploadImage({
    formData,
  }: {
    formData: UploadFileDto,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/upload/image',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `请求参数错误`,
      },
    });
  }
  /**
   * 上传小视频
   * 上传10MB以下的小视频文件
   * @returns any 视频上传成功
   * @throws ApiError
   */
  public static uploadControllerUploadSmallVideo({
    formData,
  }: {
    formData: UploadFileDto,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/upload/video/small',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `请求参数错误`,
      },
    });
  }
  /**
   * 初始化视频上传
   * 创建一个分片上传任务，获取uploadId
   * @returns any 初始化上传成功
   * @throws ApiError
   */
  public static uploadControllerInitiateVideoUpload({
    formData,
  }: {
    formData: UploadFileDto,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/upload/video/init',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `请求参数错误`,
      },
    });
  }
  /**
   * 上传视频分片
   * 上传一个视频分片
   * @returns any 分片上传成功
   * @throws ApiError
   */
  public static uploadControllerUploadVideoPart({
    formData,
  }: {
    formData: VideoPartDto,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/upload/video/part',
      formData: formData,
      mediaType: 'multipart/form-data',
      errors: {
        400: `请求参数错误`,
      },
    });
  }
  /**
   * 获取已上传的分片列表
   * 获取指定上传任务的所有已上传分片
   * @returns any 分片列表获取成功
   * @throws ApiError
   */
  public static uploadControllerListParts({
    key,
    uploadId,
  }: {
    /**
     * 文件S3 Key
     */
    key: string,
    /**
     * 上传ID
     */
    uploadId: string,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/upload/video/parts',
      query: {
        'key': key,
        'uploadId': uploadId,
      },
      errors: {
        400: `请求参数错误`,
      },
    });
  }
  /**
   * 完成视频上传
   * 合并所有分片，完成整个视频的上传
   * @returns any 视频上传完成
   * @throws ApiError
   */
  public static uploadControllerCompleteVideoUpload({
    requestBody,
  }: {
    requestBody: CompleteUploadDto,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/upload/video/complete',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `请求参数错误`,
      },
    });
  }
  /**
   * 取消视频上传
   * 取消分片上传任务并删除所有已上传分片
   * @returns any 上传任务取消成功
   * @throws ApiError
   */
  public static uploadControllerAbortVideoUpload({
    requestBody,
  }: {
    requestBody: AbortUploadDto,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/upload/video/abort',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `请求参数错误`,
      },
    });
  }
}
