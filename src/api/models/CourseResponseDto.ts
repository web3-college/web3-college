/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CourseResponseDto = {
  /**
   * 课程ID
   */
  id: number;
  /**
   * 课程名称
   */
  name: string;
  /**
   * 课程描述
   */
  description: string;
  /**
   * 课程封面图
   */
  coverImage: string;
  /**
   * 课程价格
   */
  price: number;
  /**
   * 创建者
   */
  creator: string;
  /**
   * 创建时间
   */
  createdAt: string;
  /**
   * 更新时间
   */
  updatedAt: string;
  /**
   * 是否激活
   */
  isActive: boolean;
  /**
   * 链上ID
   */
  onChainId: number;
  /**
   * 课程分类ID
   */
  categoryId: number;
  /**
   * 课程分类
   */
  category: Record<string, any>;
  /**
   * 课程章节
   */
  sections: Array<string>;
};

