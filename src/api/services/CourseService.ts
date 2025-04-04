/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateCourseDto } from '../models/CreateCourseDto';
import type { CreateCourseSectionDto } from '../models/CreateCourseSectionDto';
import type { UpdateCourseDto } from '../models/UpdateCourseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CourseService {
  /**
   * 创建课程
   * 创建一个新课程，可以包含多个章节
   * @returns any 课程创建成功
   * @throws ApiError
   */
  public static courseControllerCreateCourse({
    requestBody,
  }: {
    requestBody: CreateCourseDto,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/course',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        400: `请求参数错误`,
      },
    });
  }
  /**
   * 获取课程列表
   * 分页获取课程列表，可按分类和状态筛选
   * @returns any 课程列表
   * @throws ApiError
   */
  public static courseControllerFindAllCourses({
    isActive,
    categoryId,
    limit,
    page,
  }: {
    /**
     * 是否激活
     */
    isActive?: boolean,
    /**
     * 分类ID
     */
    categoryId?: number,
    /**
     * 每页数量
     */
    limit?: number,
    /**
     * 页码
     */
    page?: number,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/course',
      query: {
        'isActive': isActive,
        'categoryId': categoryId,
        'limit': limit,
        'page': page,
      },
    });
  }
  /**
   * 获取课程详情
   * @returns any 课程详情
   * @throws ApiError
   */
  public static courseControllerFindCourseById({
    id,
  }: {
    /**
     * 课程ID
     */
    id: number,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/course/{id}',
      path: {
        'id': id,
      },
      errors: {
        404: `课程不存在`,
      },
    });
  }
  /**
   * 更新课程
   * 更新课程信息，可以同时更新、添加或删除章节
   * @returns any 课程更新成功
   * @throws ApiError
   */
  public static courseControllerUpdateCourse({
    id,
    requestBody,
  }: {
    /**
     * 课程ID
     */
    id: number,
    requestBody: UpdateCourseDto,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/course/{id}',
      path: {
        'id': id,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        404: `课程不存在`,
      },
    });
  }
  /**
   * 删除课程
   * 删除课程及其所有章节
   * @returns any 课程删除成功
   * @throws ApiError
   */
  public static courseControllerDeleteCourse({
    id,
  }: {
    /**
     * 课程ID
     */
    id: number,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/course/{id}',
      path: {
        'id': id,
      },
      errors: {
        404: `课程不存在`,
      },
    });
  }
  /**
   * 创建课程章节
   * @returns any 章节创建成功
   * @throws ApiError
   */
  public static courseControllerCreateCourseSection({
    courseId,
    requestBody,
  }: {
    /**
     * 课程ID
     */
    courseId: number,
    requestBody: CreateCourseSectionDto,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/course/{courseId}/sections',
      path: {
        'courseId': courseId,
      },
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        404: `课程不存在`,
      },
    });
  }
  /**
   * 获取课程章节列表
   * @returns any 章节列表
   * @throws ApiError
   */
  public static courseControllerFindAllCourseSections({
    courseId,
  }: {
    /**
     * 课程ID
     */
    courseId: number,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/course/{courseId}/sections',
      path: {
        'courseId': courseId,
      },
      errors: {
        404: `课程不存在`,
      },
    });
  }
  /**
   * 获取创建者的课程列表
   * @returns any 课程列表
   * @throws ApiError
   */
  public static courseControllerFindCoursesByCreator({
    address,
    limit,
    page,
  }: {
    /**
     * 创建者钱包地址
     */
    address: string,
    /**
     * 每页数量
     */
    limit?: number,
    /**
     * 页码
     */
    page?: number,
  }): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/course/creator/{address}',
      path: {
        'address': address,
      },
      query: {
        'limit': limit,
        'page': page,
      },
    });
  }
}
