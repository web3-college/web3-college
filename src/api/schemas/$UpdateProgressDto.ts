/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateProgressDto = {
  properties: {
    courseId: {
      type: 'number',
      description: `课程ID`,
      isRequired: true,
    },
    sectionId: {
      type: 'number',
      description: `章节ID`,
      isRequired: true,
    },
    progress: {
      type: 'number',
      description: `学习进度 (0-100)`,
      isRequired: true,
    },
    lastPosition: {
      type: 'number',
      description: `最后观看位置（秒）`,
    },
  },
} as const;
