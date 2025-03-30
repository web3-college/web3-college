"use client"

import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { 
  YiDengToken__factory, 
  CourseMarket__factory, 
  CourseCertificate__factory 
} from '@/types/contracts/factories'
import { ethers } from 'ethers'
import { ETH_TO_YIDENG_RATIO, YIDENG_TOKEN_ADDRESS, COURSE_MARKET_ADDRESS, COURSE_CERTIFICATE_ADDRESS } from './contract-config'

/**
 * 使用ethers v6获取提供者和签名者
 */
async function getEthersProvider() {
  // 如果window.ethereum存在，使用它创建一个provider
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum)
    return provider
  }
  // 否则使用默认的provider
  return null
}

async function getEthersSigner() {
  const provider = await getEthersProvider()
  if (!provider) return null
  
  try {
    return await provider.getSigner()
  } catch (error) {
    console.error('获取签名者失败:', error)
    return null
  }
}

/**
 * 使用YiDengToken合约
 */
export function useYiDengToken() {
  const { isConnected } = useAccount()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // 获取代币余额
  const getBalance = useCallback(async () => {
    if (!isConnected) return BigInt(0)
    
    try {
      const provider = await getEthersProvider()
      if (!provider) throw new Error('无法连接到以太坊网络')
      
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      
      // 连接YiDengToken合约
      const tokenContract = YiDengToken__factory.connect(YIDENG_TOKEN_ADDRESS, provider)
      
      // 调用balanceOf函数
      const balance = await tokenContract.balanceOf(address)
      console.log('balance', balance)
      return BigInt(balance.toString())
    } catch (error) {
      return BigInt(0)
    }
  }, [isConnected])
  
  // 兑换代币 (ETH -> Yideng)
  const exchangeTokens = useCallback(async (amountInWei: bigint) => {
    if (!isConnected) {
      setError('请先连接钱包')
      return
    }
    
    try {
      setStatus('loading')
      setIsLoading(true)
      setError(null)
      
      const signer = await getEthersSigner()
      if (!signer) throw new Error('无法获取签名者')
      
      // 连接YiDengToken合约
      const tokenContract = YiDengToken__factory.connect(YIDENG_TOKEN_ADDRESS, signer)
      
      // 准备交易参数 - 确保value是BigInt类型
      const options = {
        value: amountInWei // 确保amountInWei是BigInt类型
      }
      
      // 调用合约的buyWithETH函数
      const tx = await tokenContract.buyWithETH(options)
      
      // 等待交易确认
      console.log('交易已提交:', tx.hash)
      const receipt = await tx.wait()
      console.log('交易已确认:', receipt)
      
      // 更新状态
      setStatus('success')
      
      return tx.hash
    } catch (error: any) {
      console.error('兑换代币失败:', error)
      setStatus('error')
      setError(error?.message || '交易失败')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [isConnected])
  
  return {
    getBalance,
    exchangeTokens,
    status,
    error,
    isLoading
  }
}

/**
 * 使用CourseMarket合约
 */
// // export function useCourseMarket() {
//   const { isConnected } = useAccount()
  
//   // 获取所有课程
//   const getAllCourses = useCallback(async () => {
//     try {
//       const provider = await getEthersProvider()
//       if (!provider) throw new Error('无法连接到以太坊网络')
      
//       // 连接CourseMarket合约
//       const marketContract = CourseMarket__factory.connect(COURSE_MARKET_ADDRESS, provider)
      
//       // 调用合约获取课程总数
//       const courseCount = await marketContract.courseCount()
//       const courses = []
      
//       // 循环获取所有课程
//       for (let i = 0; i < courseCount; i++) {
//         const course = await marketContract.courses(i)
//         courses.push(course)
//       }
      
//       return courses
//     } catch (error) {
//       console.error('获取课程列表失败:', error)
//       return []
//     }
//   }, [isConnected])
  
//   // 获取用户购买的课程
//   const getUserCourses = useCallback(async () => {
//     if (!isConnected) return []
    
//     try {
//       const provider = await getEthersProvider()
//       if (!provider) throw new Error('无法连接到以太坊网络')
      
//       const signer = await provider.getSigner()
//       const address = await signer.getAddress()
      
//       // 连接CourseMarket合约
//       const marketContract = CourseMarket__factory.connect(COURSE_MARKET_ADDRESS, provider)
      
//       try {
//         // 获取用户购买的所有课程ID
//         // 方法1: 尝试调用专门获取用户课程的方法
//         const courseIds = await marketContract.getUserPurchasedCourses(address)
//         const courses = []
        
//         // 获取每个课程的详细信息
//         for (const id of courseIds) {
//           const course = await marketContract.courses(id)
//           courses.push(course)
//         }
        
//         return courses
//       } catch (err) {
//         console.error("getUserPurchasedCourses方法不存在，尝试替代方法", err)
        
//         // 方法2: 如果上面的方法不存在，尝试从课程总数中筛选用户购买的课程
//         const courseCount = await marketContract.courseCount()
//         const courses = []
        
//         // 检查用户是否购买了每个课程
//         for (let i = 0; i < courseCount; i++) {
//           const hasPurchased = await marketContract.hasPurchased(address, i)
//           if (hasPurchased) {
//             const course = await marketContract.courses(i)
//             courses.push(course)
//           }
//         }
        
//         return courses
//       }
//     } catch (error) {
//       console.error('获取用户课程失败:', error)
//       return []
//     }
//   }, [isConnected])
  
//   // 购买课程
//   const purchaseCourse = useCallback(async (courseId: string) => {
//     if (!isConnected) throw new Error('请先连接钱包')
    
//     try {
//       const signer = await getEthersSigner()
//       if (!signer) throw new Error('无法获取签名者')
      
//       // 连接CourseMarket合约
//       const marketContract = CourseMarket__factory.connect(COURSE_MARKET_ADDRESS, signer)
      
//       // 调用合约购买课程
//       const tx = await marketContract.purchaseCourse(courseId)
      
//       // 等待交易确认
//       console.log('购买课程交易已提交:', tx.hash)
//       const receipt = await tx.wait()
//       console.log('购买课程交易已确认:', receipt)
      
//       return tx.hash
//     } catch (error) {
//       console.error('购买课程失败:', error)
//       throw error
//     }
//   }, [isConnected])
  
//   return {
//     getAllCourses,
//     getUserCourses,
//     purchaseCourse
//   }
// }

/**
 * 使用CourseCertificate合约
 */
// // export function useCourseCertificate() {
//   const { isConnected } = useAccount()
  
//   // 获取用户的所有证书
//   const getMyCertificates = useCallback(async (courseId: string) => {
//     if (!isConnected) return []
    
//     try {
//       const provider = await getEthersProvider()
//       if (!provider) throw new Error('无法连接到以太坊网络')
      
//       const signer = await provider.getSigner()
//       const address = await signer.getAddress()
      
//       // 连接CourseCertificate合约
//       const certificateContract = CourseCertificate__factory.connect(COURSE_CERTIFICATE_ADDRESS, provider)
      
//       // 获取用户的证书
//       const certificates = await certificateContract.getStudentCertificates(address, courseId)
      
//       return certificates
//     } catch (error) {
//       console.error('获取证书失败:', error)
//       return []
//     }
//   }, [isConnected])
  
//   return {
//     getMyCertificates
//   }
// } 