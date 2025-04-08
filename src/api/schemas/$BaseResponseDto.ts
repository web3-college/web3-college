/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BaseResponseDto = {
  properties: {
    code: {
      type: 'number',
      isRequired: true,
    },
    msg: {
      type: 'string',
      isRequired: true,
    },
    data: {
      type: 'dictionary',
      contains: {
        properties: {
        },
      },
      isRequired: true,
    },
  },
} as const;
