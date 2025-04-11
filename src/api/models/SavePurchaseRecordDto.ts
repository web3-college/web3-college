/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SavePurchaseRecordDto = {
  /**
   * 用户ID
   */
  userId: number;
  /**
   * 课程ID
   */
  courseId: number;
  /**
   * 交易哈希
   */
  txHash: string;
  /**
   * 链上状态验证
   */
  onChainStatus: boolean;
};

