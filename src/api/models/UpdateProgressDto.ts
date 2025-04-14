/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateProgressDto = {
  /**
   * 课程ID
   */
  courseId: number;
  /**
   * 章节ID
   */
  sectionId: number;
  /**
   * 学习进度 (0-100)
   */
  progress: number;
  /**
   * 最后观看位置（秒）
   */
  lastPosition?: number;
};

