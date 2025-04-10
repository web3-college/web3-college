/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $RoleListResponseDto = {
  properties: {
    items: {
      type: 'array',
      contains: {
        type: 'RoleResponseDto',
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
