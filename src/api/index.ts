
import { OpenAPI } from './core/OpenAPI';

// 自动配置API基础URL
OpenAPI.BASE = process.env.NEXT_PUBLIC_NEST_URL || '';
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export { ApiError } from './core/ApiError';
export { CancelablePromise, CancelError } from './core/CancelablePromise';
export { OpenAPI } from './core/OpenAPI';
export type { OpenAPIConfig } from './core/OpenAPI';

export type { AbortUploadDto } from './models/AbortUploadDto';
export type { BaseResponseDto } from './models/BaseResponseDto';
export type { CompleteUploadDto } from './models/CompleteUploadDto';
export type { CreateCategoryDto } from './models/CreateCategoryDto';
export type { CreateCourseDto } from './models/CreateCourseDto';
export type { CreateCourseSectionDto } from './models/CreateCourseSectionDto';
export type { CreateUserDto } from './models/CreateUserDto';
export type { PartDetail } from './models/PartDetail';
export type { UpdateCategoryDto } from './models/UpdateCategoryDto';
export type { UpdateCourseDto } from './models/UpdateCourseDto';
export type { UpdateCourseSectionDto } from './models/UpdateCourseSectionDto';
export type { UpdateUserDto } from './models/UpdateUserDto';
export type { UploadFileDto } from './models/UploadFileDto';
export type { VerifySignatureDto } from './models/VerifySignatureDto';
export type { VideoPartDto } from './models/VideoPartDto';

export { $AbortUploadDto } from './schemas/$AbortUploadDto';
export { $BaseResponseDto } from './schemas/$BaseResponseDto';
export { $CompleteUploadDto } from './schemas/$CompleteUploadDto';
export { $CreateCategoryDto } from './schemas/$CreateCategoryDto';
export { $CreateCourseDto } from './schemas/$CreateCourseDto';
export { $CreateCourseSectionDto } from './schemas/$CreateCourseSectionDto';
export { $CreateUserDto } from './schemas/$CreateUserDto';
export { $PartDetail } from './schemas/$PartDetail';
export { $UpdateCategoryDto } from './schemas/$UpdateCategoryDto';
export { $UpdateCourseDto } from './schemas/$UpdateCourseDto';
export { $UpdateCourseSectionDto } from './schemas/$UpdateCourseSectionDto';
export { $UpdateUserDto } from './schemas/$UpdateUserDto';
export { $UploadFileDto } from './schemas/$UploadFileDto';
export { $VerifySignatureDto } from './schemas/$VerifySignatureDto';
export { $VideoPartDto } from './schemas/$VideoPartDto';

export { AppService } from './services/AppService';
export { AuthService } from './services/AuthService';
export { CategoryService } from './services/CategoryService';
export { CourseService } from './services/CourseService';
export { UploadService } from './services/UploadService';
export { UsersService } from './services/UsersService';
