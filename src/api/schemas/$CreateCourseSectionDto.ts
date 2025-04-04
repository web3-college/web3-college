/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateCourseSectionDto = {
  properties: {
    title: {
      type: 'string',
      description: `章节标题`,
      isRequired: true,
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
