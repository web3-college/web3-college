/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $RoleResponseDto = {
  properties: {
    id: {
      type: 'number',
      description: `角色ID`,
      isRequired: true,
    },
    name: {
      type: 'string',
      description: `角色名称`,
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
    permissions: {
      type: 'array',
      contains: {
        type: 'PermissionInfo',
      },
    },
  },
} as const;
