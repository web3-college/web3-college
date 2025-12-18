/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRoleDto } from '../models/CreateRoleDto';
import type { UpdateRoleDto } from '../models/UpdateRoleDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RoleService {
  /**
   * 创建角色
   * @returns any 创建成功
   * @throws ApiError
   */
  public static roleControllerCreate({
    requestBody,
  }: {
    requestBody: CreateRoleDto,
  }): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: {
      id?: any;
      name?: any;
      description?: any;
      permissions?: any;
    };
  }> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/role',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 获取角色列表
   * @returns any 查询成功
   * @throws ApiError
   */
  public static roleControllerFindAll({
    page = 1,
    pageSize = 10,
    name,
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
     * 角色名称
     */
    name?: string,
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
      url: '/api/v1/role',
      query: {
        'page': page,
        'pageSize': pageSize,
        'name': name,
      },
    });
  }
  /**
   * 获取指定角色
   * @returns any 查询成功
   * @throws ApiError
   */
  public static roleControllerFindOne({
    id,
  }: {
    id: number,
  }): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: {
      id?: any;
      name?: any;
      description?: any;
      permissions?: any;
    };
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/role/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * 更新角色
   * @returns any 更新成功
   * @throws ApiError
   */
  public static roleControllerUpdate({
    id,
    requestBody,
  }: {
    id: number,
    requestBody: UpdateRoleDto,
  }): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: {
      id?: any;
      name?: any;
      description?: any;
      permissions?: any;
    };
  }> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/role/{id}',
      path: {
        'id': id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 删除角色
   * @returns any 删除成功
   * @throws ApiError
   */
  public static roleControllerRemove({
    id,
  }: {
    id: number,
  }): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: {
      id?: any;
      name?: any;
      description?: any;
      permissions?: any;
    };
  }> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/role/{id}',
      path: {
        'id': id,
      },
    });
  }
}
