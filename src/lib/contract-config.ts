import {
  YiDengToken__factory, 
  CourseMarket__factory, 
  CourseCertificate__factory 
} from '@/types/contracts/factories'

// 代币兑换比例: 1 ETH = 100 YIDENG
export const ETH_TO_YIDENG_RATIO = 1000;

// yideng代币合约地址
export const YIDENG_TOKEN_ADDRESS = "0xE69393cA7356CBD54f9c8cFDc75d59F288C9bd0A" as const;

// 课程市场合约地址
export const COURSE_MARKET_ADDRESS = "0x4A76A0c8324b64465017e1228b945AeD263bE3Bf" as const;

// 证书合约地址
export const COURSE_CERTIFICATE_ADDRESS = "0x9F226B3f0F9303e0eA3023aad6A49A2aB867f6a6" as const;

// ABI导出
export const ABIS = {
  TOKEN: YiDengToken__factory.abi,
  COURSE_MARKET: CourseMarket__factory.abi,
  CERTIFICATE: CourseCertificate__factory.abi
}

// 导出类型
export type { YiDengToken } from '@/types/contracts'
export type { CourseMarket } from '@/types/contracts'
export type { CourseCertificate } from '@/types/contracts' 