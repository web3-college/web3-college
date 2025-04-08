/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $VerifySignatureDto = {
  properties: {
    message: {
      type: 'string',
      description: `SIWE消息对象，包含用户地址和签名内容`,
      isRequired: true,
    },
    signature: {
      type: 'string',
      description: `以太坊签名`,
      isRequired: true,
    },
  },
} as const;
