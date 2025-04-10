/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryResponseDto } from './CategoryResponseDto';
export type CategoryListResponseDto = {
  /**
   * 分类列表
   */
  items: Array<CategoryResponseDto>;
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

