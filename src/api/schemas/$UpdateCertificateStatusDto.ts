/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateCertificateStatusDto = {
  properties: {
    id: {
      type: 'number',
      description: `证书请求ID`,
      isRequired: true,
    },
    status: {
      type: 'Enum',
      isRequired: true,
    },
    feedback: {
      type: 'string',
      description: `反馈信息`,
    },
  },
} as const;
