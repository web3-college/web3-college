/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $QueryCourseDto = {
  properties: {
    page: {
      type: 'number',
      description: `页码`,
    },
    pageSize: {
      type: 'number',
      description: `每页数量`,
    },
    name: {
      type: 'string',
      description: `课程名称`,
    },
    isActive: {
      type: 'boolean',
      description: `是否激活`,
    },
    categoryId: {
      type: 'number',
      description: `分类ID`,
    },
  },
} as const;
