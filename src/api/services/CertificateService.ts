/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCertificateRequestDto } from '../models/CreateCertificateRequestDto';
import type { UpdateCertificateStatusDto } from '../models/UpdateCertificateStatusDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CertificateService {
  /**
   * 创建证书请求
   * @returns any 证书请求创建成功
   * @throws ApiError
   */
  public static certificateControllerCreateCertificateRequest({
    requestBody,
  }: {
    requestBody: CreateCertificateRequestDto,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/certificate/request',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `请求参数错误或不满足申请条件`,
        401: `用户未登录`,
        404: `课程不存在`,
      },
    });
  }
  /**
   * 更新证书请求状态
   * @returns any 证书状态更新成功
   * @throws ApiError
   */
  public static certificateControllerUpdateCertificateStatus({
    requestBody,
  }: {
    requestBody: UpdateCertificateStatusDto,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/certificate/status',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        404: `证书请求不存在`,
      },
    });
  }
  /**
   * 获取用户的所有证书请求
   * @returns any 获取证书请求列表成功
   * @throws ApiError
   */
  public static certificateControllerGetUserCertificateRequests(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/certificate/user',
    });
  }
  /**
   * 获取所有证书请求
   * @returns any 获取证书请求列表成功
   * @throws ApiError
   */
  public static certificateControllerGetAllCertificateRequests({
    status,
    address,
    page,
    pageSize,
  }: {
    /**
     * 证书状态过滤
     */
    status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ISSUED',
    /**
     * 用户钱包地址过滤
     */
    address?: string,
    /**
     * 页码，默认为1
     */
    page?: number,
    /**
     * 每页数量，默认为10
     */
    pageSize?: number,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/certificate/all',
      query: {
        'status': status,
        'address': address,
        'page': page,
        'pageSize': pageSize,
      },
    });
  }
}
