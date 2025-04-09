/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserResponseDto = {
  properties: {
    id: {
      type: 'number',
      description: `用户ID`,
      isRequired: true,
    },
    address: {
      type: 'string',
      description: `用户地址`,
      isRequired: true,
    },
    name: {
      type: 'dictionary',
      contains: {
        properties: {
        },
      },
      isRequired: true,
      isNullable: true,
    },
    email: {
      type: 'dictionary',
      contains: {
        properties: {
        },
      },
      isRequired: true,
      isNullable: true,
    },
    avatar: {
      type: 'dictionary',
      contains: {
        properties: {
        },
      },
      isRequired: true,
      isNullable: true,
    },
    bio: {
      type: 'dictionary',
      contains: {
        properties: {
        },
      },
      isRequired: true,
      isNullable: true,
    },
    createdAt: {
      type: 'dictionary',
      contains: {
        properties: {
        },
      },
      isRequired: true,
      isNullable: true,
    },
    roles: {
      type: 'array',
      contains: {
        type: 'dictionary',
        contains: {
          properties: {
          },
        },
      },
      isRequired: true,
    },
  },
} as const;
