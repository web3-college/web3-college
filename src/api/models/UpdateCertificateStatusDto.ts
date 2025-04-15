/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateCertificateStatusDto = {
  /**
   * 证书请求ID
   */
  id: number;
  /**
   * 证书状态
   */
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ISSUED';
  /**
   * 反馈信息
   */
  feedback?: string;
};

