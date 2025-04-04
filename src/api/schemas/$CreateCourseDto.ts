/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateCourseDto = {
  properties: {
    name: {
      type: 'string',
      description: `课程名称`,
      isRequired: true,
    },
    description: {
      type: 'string',
      description: `课程描述`,
    },
    coverImage: {
      type: 'string',
      description: `课程封面图片URL`,
    },
    price: {
      type: 'number',
      description: `课程价格（代币数量）`,
      isRequired: true,
    },
    creator: {
      type: 'string',
      description: `创建者钱包地址`,
      isRequired: true,
    },
    isActive: {
      type: 'boolean',
      description: `课程是否激活`,
    },
    onChainId: {
      type: 'number',
      description: `链上课程ID`,
    },
    categoryId: {
      type: 'number',
      description: `课程分类ID`,
    },
    sections: {
      type: 'array',
      contains: {
        type: 'CreateCourseSectionDto',
      },
    },
  },
} as const;
