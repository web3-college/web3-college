/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserListResponseDto = {
  properties: {
    items: {
      type: 'array',
      contains: {
        type: 'UserResponseDto',
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
  },
} as const;
