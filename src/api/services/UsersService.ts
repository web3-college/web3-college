/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserDto } from '../models/CreateUserDto';
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { UpdateUserRolesDto } from '../models/UpdateUserRolesDto';
import type { UserListResponseDto } from '../models/UserListResponseDto';
import type { UserResponseDto } from '../models/UserResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
  /**
   * 创建用户
   * 创建新用户并关联默认用户角色
   * @returns any 用户创建成功
   * @throws ApiError
   */
  public static usersControllerCreate({
    requestBody,
  }: {
    requestBody: CreateUserDto,
  }): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: UserResponseDto;
  }> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/users',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 查询用户列表
   * 分页查询用户列表，支持按名称和地址模糊搜索
   * @returns any 查询成功
   * @throws ApiError
   */
  public static usersControllerFindAll({
    page = 1,
    pageSize = 10,
    name,
    address,
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
     * 用户名称（模糊搜索）
     */
    name?: string,
    /**
     * 用户地址（模糊搜索）
     */
    address?: string,
  }): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: UserListResponseDto;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users',
      query: {
        'page': page,
        'pageSize': pageSize,
        'name': name,
        'address': address,
      },
    });
  }
  /**
   * 查询用户详情
   * 根据用户ID查询用户详情
   * @returns any 查询成功
   * @throws ApiError
   */
  public static usersControllerFindOne({
    id,
  }: {
    /**
     * 用户ID
     */
    id: string,
  }): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: UserResponseDto;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/users/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * 更新用户
   * 根据用户ID更新用户信息
   * @returns any 更新成功
   * @throws ApiError
   */
  public static usersControllerUpdate({
    id,
    requestBody,
  }: {
    /**
     * 用户ID
     */
    id: string,
    requestBody: UpdateUserDto,
  }): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: UserResponseDto;
  }> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/users/{id}',
      path: {
        'id': id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * 删除用户
   * 根据用户ID删除用户
   * @returns any 删除成功
   * @throws ApiError
   */
  public static usersControllerRemove({
    id,
  }: {
    /**
     * 用户ID
     */
    id: string,
  }): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: UserResponseDto;
  }> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/users/{id}',
      path: {
        'id': id,
      },
    });
  }
  /**
   * 更新用户角色
   * 根据用户ID更新用户的角色列表，将替换该用户的所有现有角色
   * @returns any 角色更新成功
   * @throws ApiError
   */
  public static usersControllerUpdateRoles({
    id,
    requestBody,
  }: {
    /**
     * 用户ID
     */
    id: string,
    requestBody: UpdateUserRolesDto,
  }): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: UserResponseDto;
  }> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/v1/users/roles/{id}',
      path: {
        'id': id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
}
