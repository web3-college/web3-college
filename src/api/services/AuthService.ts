/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VerifySignatureDto } from '../models/VerifySignatureDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
  /**
   * 获取随机Nonce
   * 用于SIWE签名过程，返回一个随机字符串
   * @returns any 成功获取Nonce
   * @throws ApiError
   */
  public static authControllerGetNonce(): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: {
      nonce?: string;
    };
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/auth/nonce',
    });
  }
  /**
   * 验证SIWE签名
   * 验证以太坊钱包签名
   * @returns any 认证成功
   * @throws ApiError
   */
  public static authControllerVerifySignature({
    requestBody,
  }: {
    requestBody: VerifySignatureDto,
  }): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: boolean;
  }> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/auth/verify',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `签名验证失败`,
      },
    });
  }
  /**
   * 获取当前登录用户信息
   * 从会话中获取用户信息
   * @returns any 用户已登录
   * @throws ApiError
   */
  public static authControllerGetUserInfo(): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: {
      address?: string;
      chainId?: number;
    };
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/auth/session',
      errors: {
        401: `用户未登录`,
      },
    });
  }
  /**
   * 用户登出
   * 清除用户会话和认证信息
   * @returns any 登出成功
   * @throws ApiError
   */
  public static authControllerLogout(): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: {
      success?: boolean;
      message?: string;
    };
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/auth/logout',
    });
  }
  /**
   * 检查用户是否有后台权限
   * 检查当前登录用户是否拥有后台管理权限（角色包含super、admin或manager）
   * @returns any 权限检查成功
   * @throws ApiError
   */
  public static authControllerIsAdmin(): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: {
      hasAccess?: boolean;
    };
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/auth/isAdmin',
      errors: {
        401: `用户未登录`,
      },
    });
  }
}
