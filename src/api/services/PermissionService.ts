/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePermissionDto } from '../models/CreatePermissionDto';
import type { UpdatePermissionDto } from '../models/UpdatePermissionDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PermissionService {
  /**
   * 创建权限
   * @returns any 创建成功
   * @throws ApiError
   */
  public static permissionControllerCreate({
    requestBody,
  }: {
    requestBody: CreatePermissionDto,
  }): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: {
      id?: any;
      name?: any;
      action?: any;
      description?: any;
    };
  }> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/permission',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 获取权限列表
   * @returns any 查询成功
   * @throws ApiError
   */
  public static permissionControllerFindAll({
    page = 1,
    pageSize = 10,
    name,
    action,
  }: {
    /**
     * 页码
     */
    page?: number,
    /**
     * 每页数量
     */
    pageSize?: number,
    /**
     * 权限名称
     */
    name?: string,
    /**
     * 权限操作
     */
    action?: string,
  }): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: {
      items?: any;
      total?: any;
      page?: any;
      pageSize?: any;
    };
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/permission',
      query: {
        'page': page,
        'pageSize': pageSize,
        'name': name,
        'action': action,
      },
    });
  }
  /**
   * 获取指定权限
   * @returns any 查询成功
   * @throws ApiError
   */
  public static permissionControllerFindOne({
    id,
  }: {
    id: number,
  }): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: {
      id?: any;
      name?: any;
      action?: any;
      description?: any;
    };
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/permission/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * 更新权限
   * @returns any 更新成功
   * @throws ApiError
   */
  public static permissionControllerUpdate({
    id,
    requestBody,
  }: {
    id: number,
    requestBody: UpdatePermissionDto,
  }): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: {
      id?: any;
      name?: any;
      action?: any;
      description?: any;
    };
  }> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/permission/{id}',
      path: {
        'id': id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 删除权限
   * @returns any 删除成功
   * @throws ApiError
   */
  public static permissionControllerRemove({
    id,
  }: {
    id: number,
  }): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: {
      id?: any;
      name?: any;
      action?: any;
      description?: any;
    };
  }> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/permission/{id}',
      path: {
        'id': id,
      },
    });
  }
}
