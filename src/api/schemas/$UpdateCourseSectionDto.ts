/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateCourseSectionDto = {
  properties: {
    id: {
      type: 'number',
      description: `章节ID（更新现有章节时需要提供）`,
    },
    title: {
      type: 'string',
      description: `章节标题`,
    },
    description: {
      type: 'string',
      description: `章节描述`,
    },
    order: {
      type: 'number',
      description: `章节排序`,
    },
    videoUrl: {
      type: 'string',
      description: `视频URL`,
    },
  },
} as const;
