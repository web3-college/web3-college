/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SavePurchaseRecordDto = {
  properties: {
    userId: {
      type: 'number',
      description: `用户ID`,
      isRequired: true,
    },
    courseId: {
      type: 'number',
      description: `课程ID`,
      isRequired: true,
    },
    txHash: {
      type: 'string',
      description: `交易哈希`,
      isRequired: true,
    },
    onChainStatus: {
      type: 'boolean',
      description: `链上状态验证`,
      isRequired: true,
    },
  },
} as const;
