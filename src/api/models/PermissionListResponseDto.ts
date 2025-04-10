/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PermissionResponseDto } from './PermissionResponseDto';
export type PermissionListResponseDto = {
  /**
   * 权限列表
   */
  items: Array<PermissionResponseDto>;
  /**
   * 总记录数
   */
  total: number;
  /**
   * 当前页码
   */
  page: number;
  /**
   * 每页数量
   */
  pageSize: number;
};

