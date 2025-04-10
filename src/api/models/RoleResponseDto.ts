/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PermissionInfo } from './PermissionInfo';
export type RoleResponseDto = {
  /**
   * 角色ID
   */
  id: number;
  /**
   * 角色名称
   */
  name: string;
  /**
   * 角色描述
   */
  description: Record<string, any> | null;
  /**
   * 角色权限
   */
  permissions?: Array<PermissionInfo>;
};

