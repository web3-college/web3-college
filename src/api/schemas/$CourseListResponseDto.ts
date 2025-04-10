/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CourseListResponseDto = {
  properties: {
    items: {
      type: 'array',
      contains: {
        type: 'dictionary',
        contains: {
          properties: {
          },
        },
      },
      isRequired: true,
    },
    total: {
      type: 'number',
      description: `总记录数`,
      isRequired: true,
    },
    page: {
      type: 'number',
      description: `当前页码`,
      isRequired: true,
    },
    pageSize: {
      type: 'number',
      description: `每页数量`,
      isRequired: true,
    },
    totalPages: {
      type: 'number',
      description: `总页数`,
      isRequired: true,
    },
  },
} as const;
