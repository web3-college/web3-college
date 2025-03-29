"use client"

import { useState } from "react"
import { parseEther, formatEther } from "viem"
import { useAccount, useBalance } from "wagmi"
import { ArrowRight, Coins } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Exchange() {
  const [ethAmount, setEthAmount] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const { address, isConnected } = useAccount()
  const { data: ethBalance } = useBalance({
    address,
  })

  // 计算可以兑换的Yideng代币数量（这里使用1:100的兑换比例作为示例）
  const yidengAmount = ethAmount ? parseFloat(ethAmount) * 100 : 0

  const handleExchange = async () => {
    if (!isConnected || !ethAmount) return
    
    setIsLoading(true)
    try {
      // 这里应该添加实际的兑换逻辑
      // 比如调用智能合约方法进行代币兑换
      
      // 模拟交易延迟
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 交易成功后清空输入
      setEthAmount("")
      alert("兑换成功！")
    } catch (error) {
      console.error("兑换失败", error)
      alert("兑换失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-black/50 border border-purple-500/20 overflow-hidden backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 pointer-events-none" />
      
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">ETH兑换Yideng代币</CardTitle>
        <CardDescription className="text-gray-300">使用ETH兑换Yideng代币用于购买课程</CardDescription>
      </CardHeader>
      
      <CardContent className="relative space-y-6">
        <div className="space-y-2">
          <Label htmlFor="eth-amount" className="text-gray-300">ETH数量</Label>
          <div className="relative">
            <Input
              id="eth-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="输入ETH数量"
              value={ethAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEthAmount(e.target.value)}
              className="bg-gray-900/50 border-purple-500/30 focus:border-purple-500/50 text-white pl-10"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <div className="text-purple-400 w-5 h-5">Ξ</div>
            </div>
          </div>
          {isConnected && ethBalance && (
            <p className="text-sm text-gray-400 flex items-center">
              <span>余额: {formatEther(ethBalance.value)} ETH</span>
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-center py-2">
          <ArrowRight className="h-6 w-6 text-purple-400" />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">可兑换Yideng代币</Label>
          <div className="p-3 border border-blue-500/30 rounded-md bg-gray-900/50 flex items-center">
            <Coins className="h-5 w-5 text-blue-400 mr-2" />
            <p className="font-medium text-white">{yidengAmount.toFixed(2)} Yideng</p>
          </div>
          <p className="text-sm text-gray-400">
            兑换比例: 1 ETH = 100 Yideng
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="relative">
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
          onClick={handleExchange}
          disabled={!isConnected || !ethAmount || isLoading}
        >
          {isLoading ? "处理中..." : "兑换"}
        </Button>
      </CardFooter>
    </Card>
  )
} 