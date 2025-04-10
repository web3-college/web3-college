/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CategoryResponseDto = {
  properties: {
    id: {
      type: 'number',
      description: `分类ID`,
      isRequired: true,
    },
    name: {
      type: 'string',
      description: `分类名称`,
      isRequired: true,
    },
    description: {
      type: 'string',
      description: `分类描述`,
      isRequired: true,
    },
    icon: {
      type: 'string',
      description: `分类图标`,
      isRequired: true,
    },
    order: {
      type: 'number',
      description: `分类排序`,
      isRequired: true,
    },
    isActive: {
      type: 'boolean',
      description: `分类是否激活`,
      isRequired: true,
    },
    createdAt: {
      type: 'string',
      description: `创建时间`,
      isRequired: true,
      format: 'date-time',
    },
    updatedAt: {
      type: 'string',
      description: `更新时间`,
      isRequired: true,
      format: 'date-time',
    },
  },
} as const;
