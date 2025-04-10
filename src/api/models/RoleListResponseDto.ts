/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RoleResponseDto } from './RoleResponseDto';
export type RoleListResponseDto = {
  /**
   * 角色列表
   */
  items: Array<RoleResponseDto>;
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

