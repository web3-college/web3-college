/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateCategoryDto = {
  properties: {
    name: {
      type: 'string',
      description: `分类名称`,
      isRequired: true,
    },
    description: {
      type: 'string',
      description: `分类描述`,
    },
    icon: {
      type: 'string',
      description: `分类图标`,
    },
    order: {
      type: 'number',
      description: `分类排序`,
    },
    isActive: {
      type: 'boolean',
      description: `分类是否激活`,
    },
  },
} as const;
