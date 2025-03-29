import {
  YiDengToken__factory, 
  CourseMarket__factory, 
  CourseCertificate__factory 
} from '@/types/contracts/factories'

export const ETH_TO_YIDENG_RATIO = 1000

// 合约地址
export const CONTRACTS = {
  TOKEN: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as `0x${string}`, // YiDengToken合约地址
  COURSE_MARKET: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' as `0x${string}`, // CourseMarket合约地址
  CERTIFICATE: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' as `0x${string}` // CourseCertificate合约地址
}

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