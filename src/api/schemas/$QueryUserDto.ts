/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $QueryUserDto = {
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
      description: `用户名称（模糊搜索）`,
    },
    address: {
      type: 'string',
      description: `用户地址（模糊搜索）`,
    },
  },
} as const;
