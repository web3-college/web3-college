/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryListResponseDto } from '../models/CategoryListResponseDto';
import type { CreateCategoryDto } from '../models/CreateCategoryDto';
import type { UpdateCategoryDto } from '../models/UpdateCategoryDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoryService {
  /**
   * 创建分类
   * 创建一个新的课程分类
   * @returns any 分类创建成功
   * @throws ApiError
   */
  public static categoryControllerCreateCategory({
    requestBody,
  }: {
    requestBody: CreateCategoryDto,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/v1/category',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `参数验证失败`,
      },
    });
  }
  /**
   * 获取所有分类
   * 获取所有课程分类列表，支持分页和名称搜索
   * @returns any 获取分类列表成功
   * @throws ApiError
   */
  public static categoryControllerFindAllCategories({
    page = 1,
    pageSize = 10,
    name,
    isActive,
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
     * 分类名称
     */
    name?: string,
    /**
     * 是否激活
     */
    isActive?: boolean,
  }): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: CategoryListResponseDto;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/category',
      query: {
        'page': page,
        'pageSize': pageSize,
        'name': name,
        'isActive': isActive,
      },
    });
  }
  /**
   * 获取所有分类（不分页）
   * 获取所有课程分类列表，不分页，可按激活状态和名称筛选，适用于下拉菜单等场景
   * @returns any 获取分类列表成功
   * @throws ApiError
   */
  public static categoryControllerFindAllCategoriesWithoutPagination({
    isActive,
    name,
  }: {
    /**
     * 是否只获取激活的分类
     */
    isActive?: boolean,
    /**
     * 分类名称（模糊搜索）
     */
    name?: string,
  }): CancelablePromise<{
    code?: number;
    msg?: string;
    data?: CategoryListResponseDto;
  }> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/category/list-all',
      query: {
        'isActive': isActive,
        'name': name,
      },
    });
  }
  /**
   * 获取单个分类
   * 通过ID获取特定分类
   * @returns any 获取分类成功
   * @throws ApiError
   */
  public static categoryControllerFindCategoryById({
    id,
  }: {
    /**
     * 分类ID
     */
    id: number,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/category/{id}',
      path: {
        'id': id,
      },
      errors: {
        404: `分类不存在`,
      },
    });
  }
  /**
   * 更新分类
   * 通过ID更新分类信息
   * @returns any 分类更新成功
   * @throws ApiError
   */
  public static categoryControllerUpdateCategory({
    id,
    requestBody,
  }: {
    /**
     * 分类ID
     */
    id: number,
    requestBody: UpdateCategoryDto,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/v1/category/{id}',
      path: {
        'id': id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        404: `分类不存在`,
      },
    });
  }
  /**
   * 删除分类
   * 通过ID删除分类
   * @returns any 分类删除成功
   * @throws ApiError
   */
  public static categoryControllerDeleteCategory({
    id,
  }: {
    /**
     * 分类ID
     */
    id: number,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/v1/category/{id}',
      path: {
        'id': id,
      },
      errors: {
        404: `分类不存在`,
      },
    });
  }
  /**
   * 获取分类下的课程
   * 获取特定分类下的所有课程
   * @returns any 获取课程列表成功
   * @throws ApiError
   */
  public static categoryControllerFindCoursesByCategory({
    id,
    page = 1,
    pageSize = 10,
    name,
    isActive,
  }: {
    id: number,
    /**
     * 页码
     */
    page?: number,
    /**
     * 每页数量
     */
    pageSize?: number,
    /**
     * 分类名称
     */
    name?: string,
    /**
     * 是否激活
     */
    isActive?: boolean,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/v1/category/{id}/courses',
      path: {
        'id': id,
      },
      query: {
        'page': page,
        'pageSize': pageSize,
        'name': name,
        'isActive': isActive,
      },
      errors: {
        404: `分类不存在`,
      },
    });
  }
}
