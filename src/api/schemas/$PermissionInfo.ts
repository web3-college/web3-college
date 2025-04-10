/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PermissionInfo = {
  properties: {
    id: {
      type: 'number',
      description: `权限ID`,
      isRequired: true,
    },
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
      type: 'dictionary',
      contains: {
        properties: {
        },
      },
      isRequired: true,
      isNullable: true,
    },
  },
} as const;
