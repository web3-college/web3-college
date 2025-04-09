/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreatePermissionDto = {
  properties: {
    name: {
      type: 'string',
      description: `权限名称`,
      isRequired: true,
    },
    action: {
      type: 'string',
      description: `权限操作`,
      isRequired: true,
    },
    description: {
      type: 'string',
      description: `权限描述`,
    },
  },
} as const;
