/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $VideoPartDto = {
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
    partNumber: {
      type: 'number',
      description: `分片编号`,
      isRequired: true,
    },
    file: {
      type: 'binary',
      description: `分片文件`,
      isRequired: true,
      format: 'binary',
    },
  },
} as const;
