/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateRoleDto = {
  properties: {
    name: {
      type: 'string',
      description: `角色名称`,
    },
    description: {
      type: 'string',
      description: `角色描述`,
    },
    permissionIds: {
      type: 'array',
      contains: {
        type: 'number',
      },
    },
  },
} as const;
