/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CourseResponseDto = {
  properties: {
    id: {
      type: 'number',
      description: `课程ID`,
      isRequired: true,
    },
    name: {
      type: 'string',
      description: `课程名称`,
      isRequired: true,
    },
    description: {
      type: 'string',
      description: `课程描述`,
      isRequired: true,
    },
    coverImage: {
      type: 'string',
      description: `课程封面图`,
      isRequired: true,
    },
    price: {
      type: 'number',
      description: `课程价格`,
      isRequired: true,
    },
    creator: {
      type: 'string',
      description: `创建者`,
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
    isActive: {
      type: 'boolean',
      description: `是否激活`,
      isRequired: true,
    },
    onChainId: {
      type: 'number',
      description: `链上ID`,
      isRequired: true,
    },
    categoryId: {
      type: 'number',
      description: `课程分类ID`,
      isRequired: true,
    },
    category: {
      type: 'dictionary',
      contains: {
        properties: {
        },
      },
      isRequired: true,
    },
    sections: {
      type: 'array',
      contains: {
        type: 'string',
      },
      isRequired: true,
    },
  },
} as const;
