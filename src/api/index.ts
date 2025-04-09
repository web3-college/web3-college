
import { OpenAPI } from './core/OpenAPI';

// 自动配置API基础URL
OpenAPI.BASE = process.env.NEXT_PUBLIC_NEST_URL || '';
OpenAPI.WITH_CREDENTIALS = true;
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export { ApiError } from './core/ApiError';
export { CancelablePromise, CancelError } from './core/CancelablePromise';
export { OpenAPI } from './core/OpenAPI';
export type { OpenAPIConfig } from './core/OpenAPI';

export type { AbortUploadDto } from './models/AbortUploadDto';
export type { AuthErrorResponseDto } from './models/AuthErrorResponseDto';
export type { BaseResponseDto } from './models/BaseResponseDto';
export type { CompleteUploadDto } from './models/CompleteUploadDto';
export type { CreateCategoryDto } from './models/CreateCategoryDto';
export type { CreateCourseDto } from './models/CreateCourseDto';
export type { CreateCourseSectionDto } from './models/CreateCourseSectionDto';
export type { CreatePermissionDto } from './models/CreatePermissionDto';
export type { CreateRoleDto } from './models/CreateRoleDto';
export type { CreateUserDto } from './models/CreateUserDto';
export type { PartDetail } from './models/PartDetail';
export type { QueryUserDto } from './models/QueryUserDto';
export type { SessionResponseDto } from './models/SessionResponseDto';
export type { UpdateCategoryDto } from './models/UpdateCategoryDto';
export type { UpdateCourseDto } from './models/UpdateCourseDto';
export type { UpdateCourseSectionDto } from './models/UpdateCourseSectionDto';
export type { UpdatePermissionDto } from './models/UpdatePermissionDto';
export type { UpdateRoleDto } from './models/UpdateRoleDto';
export type { UpdateUserDto } from './models/UpdateUserDto';
export type { UpdateUserRolesDto } from './models/UpdateUserRolesDto';
export type { UploadFileDto } from './models/UploadFileDto';
export type { UserListResponseDto } from './models/UserListResponseDto';
export type { UserResponseDto } from './models/UserResponseDto';
export type { VerifySignatureDto } from './models/VerifySignatureDto';
export type { VideoPartDto } from './models/VideoPartDto';

export { $AbortUploadDto } from './schemas/$AbortUploadDto';
export { $AuthErrorResponseDto } from './schemas/$AuthErrorResponseDto';
export { $BaseResponseDto } from './schemas/$BaseResponseDto';
export { $CompleteUploadDto } from './schemas/$CompleteUploadDto';
export { $CreateCategoryDto } from './schemas/$CreateCategoryDto';
export { $CreateCourseDto } from './schemas/$CreateCourseDto';
export { $CreateCourseSectionDto } from './schemas/$CreateCourseSectionDto';
export { $CreatePermissionDto } from './schemas/$CreatePermissionDto';
export { $CreateRoleDto } from './schemas/$CreateRoleDto';
export { $CreateUserDto } from './schemas/$CreateUserDto';
export { $PartDetail } from './schemas/$PartDetail';
export { $QueryUserDto } from './schemas/$QueryUserDto';
export { $SessionResponseDto } from './schemas/$SessionResponseDto';
export { $UpdateCategoryDto } from './schemas/$UpdateCategoryDto';
export { $UpdateCourseDto } from './schemas/$UpdateCourseDto';
export { $UpdateCourseSectionDto } from './schemas/$UpdateCourseSectionDto';
export { $UpdatePermissionDto } from './schemas/$UpdatePermissionDto';
export { $UpdateRoleDto } from './schemas/$UpdateRoleDto';
export { $UpdateUserDto } from './schemas/$UpdateUserDto';
export { $UpdateUserRolesDto } from './schemas/$UpdateUserRolesDto';
export { $UploadFileDto } from './schemas/$UploadFileDto';
export { $UserListResponseDto } from './schemas/$UserListResponseDto';
export { $UserResponseDto } from './schemas/$UserResponseDto';
export { $VerifySignatureDto } from './schemas/$VerifySignatureDto';
export { $VideoPartDto } from './schemas/$VideoPartDto';

export { AppService } from './services/AppService';
export { AuthService } from './services/AuthService';
export { CategoryService } from './services/CategoryService';
export { CourseService } from './services/CourseService';
export { PermissionService } from './services/PermissionService';
export { RoleService } from './services/RoleService';
export { UploadService } from './services/UploadService';
export { UsersService } from './services/UsersService';
