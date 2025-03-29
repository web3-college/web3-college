"use client"

import { useCallback } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { createPublicClient, http, createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { 
  YiDengToken__factory, 
  CourseMarket__factory, 
  CourseCertificate__factory 
} from '@/types/contracts/factories'

// YiDengToken合约地址（这里是示例地址，需要替换为实际部署的合约地址）
const YIDENG_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'
const COURSE_MARKET_ADDRESS = '0x0000000000000000000000000000000000000000'
const COURSE_CERTIFICATE_ADDRESS = '0x0000000000000000000000000000000000000000'

// 创建一个公共客户端
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
})

/**
 * 使用YiDengToken合约
 */
export function useYiDengToken() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  
  // 获取代币余额
  const getBalance = useCallback(async () => {
    if (!address) return '0'
    
    try {
      const data = await publicClient.readContract({
        address: YIDENG_TOKEN_ADDRESS,
        abi: YiDengToken__factory.abi,
        functionName: 'balanceOf',
        args: [address]
      })
      
      return data.toString()
    } catch (error) {
      console.error('Failed to fetch YiDeng token balance:', error)
      return '0'
    }
  }, [address])
  
  // 兑换代币 (ETH -> Yideng)
  const exchangeTokens = useCallback(async (amount: bigint) => {
    if (!address || !walletClient) throw new Error('Wallet not connected')
    
    try {
      // 注意：这个函数名需要根据实际合约ABI调整
      const hash = await walletClient.writeContract({
        address: YIDENG_TOKEN_ADDRESS,
        abi: YiDengToken__factory.abi,
        functionName: 'buyWithETH',
        value: amount
      })
      
      return hash
    } catch (error) {
      console.error('Failed to exchange tokens:', error)
      throw error
    }
  }, [address, walletClient])
  
  return {
    getBalance,
    exchangeTokens
  }
}

/**
 * 使用CourseMarket合约
 */
export function useCourseMarket() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  
  // 获取所有课程
  const getAllCourses = useCallback(async () => {
    try {
      // 这个函数名可能需要调整
      const data = await publicClient.readContract({
        address: COURSE_MARKET_ADDRESS,
        abi: CourseMarket__factory.abi,
        functionName: 'courses',
        args: [BigInt(0)] // 示例：获取第一个课程
      })
      return [data] // 返回一个数组，实际应循环获取所有课程
    } catch (error) {
      console.error('Failed to fetch courses:', error)
      return []
    }
  }, [])
  
  // 获取用户购买的课程
  const getUserCourses = useCallback(async () => {
    if (!address) return []
    
    try {
      const data = await publicClient.readContract({
        address: COURSE_MARKET_ADDRESS,
        abi: CourseMarket__factory.abi,
        functionName: 'userCourses',
        args: [address, BigInt(0)]
      })
      return data
    } catch (error) {
      console.error('Failed to fetch user courses:', error)
      return []
    }
  }, [address])
  
  // 购买课程
  const purchaseCourse = useCallback(async (courseId: string) => {
    if (!address || !walletClient) throw new Error('Wallet not connected')
    
    try {
      const hash = await walletClient.writeContract({
        address: COURSE_MARKET_ADDRESS,
        abi: CourseMarket__factory.abi,
        functionName: 'purchaseCourse',
        args: [courseId]
      })
      return hash
    } catch (error) {
      console.error('Failed to purchase course:', error)
      throw error
    }
  }, [address, walletClient])
  
  return {
    getAllCourses,
    getUserCourses,
    purchaseCourse
  }
}

/**
 * 使用CourseCertificate合约
 */
export function useCourseCertificate() {
  const { address } = useAccount()
  
  // 获取用户的所有证书
  const getMyCertificates = useCallback(async (courseId: string) => {
    if (!address) return []
    
    try {
      const data = await publicClient.readContract({
        address: COURSE_CERTIFICATE_ADDRESS,
        abi: CourseCertificate__factory.abi,
        functionName: 'getStudentCertificates',
        args: [address, courseId]
      })
      return data
    } catch (error) {
      console.error('Failed to fetch certificates:', error)
      return []
    }
  }, [address])
  
  return {
    getMyCertificates
  }
} 