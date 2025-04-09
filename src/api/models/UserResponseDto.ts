/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserResponseDto = {
  /**
   * 用户ID
   */
  id: number;
  /**
   * 用户地址
   */
  address: string;
  /**
   * 用户名称
   */
  name: Record<string, any> | null;
  /**
   * 用户邮箱
   */
  email: Record<string, any> | null;
  /**
   * 用户头像
   */
  avatar: Record<string, any> | null;
  /**
   * 用户简介
   */
  bio: Record<string, any> | null;
  /**
   * 创建时间
   */
  createdAt: Record<string, any> | null;
  /**
   * 用户角色
   */
  roles: Array<Record<string, any>>;
};

