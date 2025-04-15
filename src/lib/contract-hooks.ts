"use client"

import { useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import {
  YiDengToken__factory,
  CourseMarket__factory,
  CourseCertificate__factory
} from '@/types/contracts/factories'
import { ethers } from 'ethers'
import { YIDENG_TOKEN_ADDRESS, COURSE_MARKET_ADDRESS, COURSE_CERTIFICATE_ADDRESS } from './contract-config'

/**
 * 使用ethers v6获取提供者和签名者
 */
export async function getEthersProvider() {
  // 如果window.ethereum存在，使用它创建一个provider
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum)
    return provider
  }
  // 否则使用默认的provider
  return null
}

export async function getEthersSigner() {
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

  // 批准课程市场合约使用代币
  const approve = useCallback(async (price: bigint) => {
    if (!isConnected) throw new Error('请先连接钱包')
    try {
      const signer = await getEthersSigner()
      if (!signer) throw new Error('无法获取签名者')
      // 连接YiDengToken合约
      const tokenContract = YiDengToken__factory.connect(YIDENG_TOKEN_ADDRESS, signer)
      const tx = await tokenContract.approve(COURSE_MARKET_ADDRESS, price)
      const receipt = await tx.wait()
      console.log('批准交易已确认:', receipt)
    } catch (error) {
      console.error('批准失败:', error)
    }
  }, [isConnected])

  return {
    getBalance,
    exchangeTokens,
    approve,
    status,
    error,
    isLoading
  }
}

/**
 * 使用CourseMarket合约
 */
export function useCourseMarket() {
  const { isConnected } = useAccount()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取所有课程
  const getAllCourses = useCallback(async () => {
    try {
      const provider = await getEthersProvider()
      if (!provider) throw new Error('无法连接到以太坊网络')

      // 连接CourseMarket合约
      const marketContract = CourseMarket__factory.connect(COURSE_MARKET_ADDRESS, provider)

      // 调用合约获取课程总数
      const courseCount = await marketContract.courseCount()
      const courses = []

      // 循环获取所有课程
      for (let i = 1; i <= courseCount; i++) {
        const course = await marketContract.courses(i)
        courses.push(course)
      }

      return courses
    } catch (error) {
      console.error('获取课程列表失败:', error)
      return []
    }
  }, [isConnected])

  // 获取用户购买的课程
  const getUserCourses = useCallback(async () => {
    if (!isConnected) return []

    try {
      const provider = await getEthersProvider()
      if (!provider) throw new Error('无法连接到以太坊网络')

      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      // 连接CourseMarket合约
      const marketContract = CourseMarket__factory.connect(COURSE_MARKET_ADDRESS, provider)

      // 获取课程总数
      const courseCount = await marketContract.courseCount()
      const courses = []

      // 循环检查用户是否购买了每个课程
      for (let i = 1; i <= courseCount; i++) {
        const hasPurchased = await marketContract.userCourses(address, i)
        if (hasPurchased) {
          const course = await marketContract.courses(i)
          courses.push(course)
        }
      }

      return courses
    } catch (error) {
      console.error('获取用户课程失败:', error)
      return []
    }
  }, [isConnected])

  // 批准课程市场合约使用代币
  const approve = useCallback(async (price: bigint) => {
    if (!isConnected) throw new Error('请先连接钱包')
    try {
      const signer = await getEthersSigner()
      if (!signer) throw new Error('无法获取签名者')
      // 连接YiDengToken合约
      const tokenContract = YiDengToken__factory.connect(YIDENG_TOKEN_ADDRESS, signer)
      const tx = await tokenContract.approve(COURSE_MARKET_ADDRESS, price)
      const receipt = await tx.wait()
      console.log('批准交易已确认:', receipt)
    } catch (error) {
      console.error('批准失败:', error)
    }
  }, [isConnected])

  const getAllowance = useCallback(async () => {
    if (!isConnected) throw new Error('请先连接钱包')
    try {
      const signer = await getEthersSigner()
      if (!signer) throw new Error('无法获取签名者')
      // 连接YiDengToken合约
      const tokenContract = YiDengToken__factory.connect(YIDENG_TOKEN_ADDRESS, signer)
      const allowance = await tokenContract.allowance(signer.getAddress(), COURSE_MARKET_ADDRESS)
      console.log('代币授权额度:', allowance)
      return allowance
    } catch (error) {
      console.error('获取代币授权额度失败:', error)
    }
  }, [isConnected])

  // 购买课程
  const purchaseCourse = useCallback(async (web2CourseId: string) => {
    if (!isConnected) throw new Error('请先连接钱包')

    try {
      setStatus('loading')
      setIsLoading(true)
      setError(null)

      const signer = await getEthersSigner()
      if (!signer) throw new Error('无法获取签名者')

      // 连接CourseMarket合约
      const marketContract = CourseMarket__factory.connect(COURSE_MARKET_ADDRESS, signer)

      // 调用合约购买课程
      const tx = await marketContract.purchaseCourse(web2CourseId)

      // 等待交易确认
      console.log('购买课程交易已提交:', tx.hash)
      const receipt = await tx.wait()
      console.log('购买课程交易已确认:', receipt)

      setStatus('success')
      return tx.hash
    } catch (error: any) {
      console.error('购买课程失败:', error)
      setStatus('error')
      setError(error?.message || '购买课程失败')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [isConnected])

  // 检查用户是否已购买课程
  const hasCourse = useCallback(async (web2CourseId: string) => {
    if (!isConnected) return false

    try {
      const provider = await getEthersProvider()
      if (!provider) throw new Error('无法连接到以太坊网络')

      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      // 连接CourseMarket合约
      const marketContract = CourseMarket__factory.connect(COURSE_MARKET_ADDRESS, provider)

      // 调用hasCourse方法
      const hasPurchased = await marketContract.hasCourse(address, web2CourseId)
      return hasPurchased
    } catch (error) {
      console.error('检查课程购买状态失败:', error)
      return false
    }
  }, [isConnected])

  // 添加新课程
  // web2CourseId: 数据库中的课程ID
  // name: 课程名称
  // price: 课程价格(以YIDENG币为单位，假设支持两位小数精度，例如12.34表示为1234)
  const addCourse = useCallback(async (web2CourseId: string, name: string, price: bigint) => {
    if (!isConnected) throw new Error('请先连接钱包')

    try {
      setStatus('loading')
      setIsLoading(true)
      setError(null)

      const signer = await getEthersSigner()
      if (!signer) throw new Error('无法获取签名者')

      // 获取钱包地址
      const walletAddress = await signer.getAddress()
      console.log('钱包地址:', walletAddress)

      // 连接CourseMarket合约
      const marketContract = CourseMarket__factory.connect(COURSE_MARKET_ADDRESS, signer)

      // 检查合约状态
      try {
        const owner = await marketContract.owner()
        const isOwner = owner.toLowerCase() === walletAddress.toLowerCase()
        console.log('合约所有者:', owner)
        console.log('当前用户是否为所有者:', isOwner)

        // 检查web2CourseId是否已存在
        try {
          const existingId = await marketContract.web2ToCourseId(web2CourseId)
          if (existingId > BigInt(0)) {
            console.warn('该courseId已存在:', existingId.toString())
          }
        } catch (e) {
          // 如果ID不存在，这里可能会抛出错误，属于正常情况
          console.log('该courseId尚未使用')
        }
      } catch (checkError) {
        console.error('检查合约状态失败:', checkError)
      }

      console.log('调用合约addCourse参数:', {
        web2CourseId,
        name,
        price: price.toString(), // YIDENG代币价格
      })

      // 调用合约添加课程
      const tx = await marketContract.addCourse(web2CourseId, name, price)

      // 等待交易确认
      console.log('添加课程交易已提交:', tx.hash)
      const receipt = await tx.wait()
      console.log('添加课程交易已确认:', receipt)

      setStatus('success')
      return tx.hash
    } catch (error: any) {
      console.error('添加课程失败:', error)

      // 提取更详细的错误信息
      let errorMsg = '添加课程失败'

      if (error.code) {
        console.error('错误代码:', error.code)
      }

      if (error.data) {
        console.error('错误数据:', error.data)
      }

      if (error.transaction) {
        console.error('错误交易:', error.transaction)
      }

      setStatus('error')
      setError(error?.message || errorMsg)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [isConnected])

  // 验证课程完成
  const verifyCourse = useCallback(async (address: string, web2CourseId: string) => {
    if (!isConnected) throw new Error('请先连接钱包')
    try {
      setStatus('loading')
      setIsLoading(true)
      setError(null)

      const signer = await getEthersSigner()
      if (!signer) throw new Error('无法获取签名者')

      const marketContract = CourseMarket__factory.connect(COURSE_MARKET_ADDRESS, signer)

      const tx = await marketContract.verifyCourseCompletion(address, web2CourseId)
      const receipt = await tx.wait()

      console.log('验证课程交易已确认:', receipt)
      setStatus('success')
      return tx.hash
    } catch (error: any) {
      setStatus('error')
      setError(error?.message || '验证课程失败')
      console.error('验证课程失败:', error)
      throw error
    }
  }, [isConnected])

  return {
    getAllCourses,
    getUserCourses,
    purchaseCourse,
    hasCourse,
    addCourse,
    approve,
    getAllowance,
    verifyCourse,
    status,
    isLoading,
    error
  }
}

/**
 * 使用CourseCertificate合约
 */
export function useCourseCertificate() {
  const { isConnected } = useAccount()

  // 获取用户的所有证书
  const getMyCertificates = useCallback(async (courseId: string) => {
    if (!isConnected) return []

    try {
      const provider = await getEthersProvider()
      if (!provider) throw new Error('无法连接到以太坊网络')

      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      // 连接CourseCertificate合约
      const certificateContract = CourseCertificate__factory.connect(COURSE_CERTIFICATE_ADDRESS, provider)

      // 获取用户的证书
      const certificates = await certificateContract.getStudentCertificates(address, courseId)

      return certificates
    } catch (error) {
      console.error('获取证书失败:', error)
      return []
    }
  }, [isConnected])

  // 获取证书详细信息
  const getCertificateDetails = useCallback(async (tokenId: bigint) => {
    if (!isConnected) return null

    try {
      const provider = await getEthersProvider()
      if (!provider) throw new Error('无法连接到以太坊网络')

      // 连接CourseCertificate合约
      const certificateContract = CourseCertificate__factory.connect(COURSE_CERTIFICATE_ADDRESS, provider)

      // 获取证书详情
      const certificate = await certificateContract.certificates(tokenId)

      return {
        web2CourseId: certificate.web2CourseId,
        student: certificate.student,
        timestamp: certificate.timestamp,
        metadataURI: certificate.metadataURI
      }
    } catch (error) {
      console.error('获取证书详情失败:', error)
      return null
    }
  }, [isConnected])

  return {
    getMyCertificates,
    getCertificateDetails
  }
} 