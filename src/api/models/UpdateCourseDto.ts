/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UpdateCourseSectionDto } from './UpdateCourseSectionDto';
export type UpdateCourseDto = {
  /**
   * 课程名称
   */
  name?: string;
  /**
   * 课程描述
   */
  description?: string;
  /**
   * 课程封面图片URL
   */
  coverImage?: string;
  /**
   * 课程价格（代币数量）
   */
  price?: number;
  /**
   * 创建者钱包地址
   */
  creator?: string;
  /**
   * 课程是否激活
   */
  isActive?: boolean;
  /**
   * 链上课程ID
   */
  onChainId?: number;
  /**
   * 课程分类ID
   */
  categoryId?: number;
  /**
   * 课程章节列表
   */
  sections?: Array<UpdateCourseSectionDto>;
};

