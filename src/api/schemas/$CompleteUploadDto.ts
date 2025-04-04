/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CompleteUploadDto = {
  properties: {
    key: {
      type: 'string',
      description: `文件S3 Key`,
      isRequired: true,
    },
    uploadId: {
      type: 'string',
      description: `上传ID`,
      isRequired: true,
    },
    parts: {
      type: 'array',
      contains: {
        type: 'PartDetail',
      },
      isRequired: true,
    },
  },
} as const;
