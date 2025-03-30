import {
  YiDengToken__factory, 
  CourseMarket__factory, 
  CourseCertificate__factory 
} from '@/types/contracts/factories'

// 代币兑换比例: 1 ETH = 100 YIDENG
export const ETH_TO_YIDENG_RATIO = 1000;

// yideng代币合约地址
export const YIDENG_TOKEN_ADDRESS = "0xFbe9EfD4e5DdE2A229d4Bc02F63a2232eb487810" as const;

// 课程市场合约地址
export const COURSE_MARKET_ADDRESS = "0x9D5d62D53d4AB6CD1b2011147aa5955bb34aC605" as const;

// 证书合约地址
export const COURSE_CERTIFICATE_ADDRESS = "0x482B2Ce2A63Fb5AAE8d2ce58deacEF05979cc3D0" as const;

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