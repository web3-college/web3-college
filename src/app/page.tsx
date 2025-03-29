"use client"

import { Exchange } from "@/components/exchange"
import { Sparkles, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="py-12 space-y-16">
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full p-5">
            <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-full p-4">
              <Zap className="h-10 w-10 text-purple-400" />
            </div>
          </div>
        </div>
        <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-gradient">
          Web3 College
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          学习区块链和Web3开发的最佳在线平台，使用Yideng代币解锁优质课程内容
        </p>
        <div className="flex justify-center gap-2 pt-4">
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-transparent rounded-full"></div>
          <div className="h-1 w-20 bg-gradient-to-r from-transparent to-blue-500 rounded-full"></div>
        </div>
      </section>
      
      <section className="py-8 relative">
        {/* 背景装饰 */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-10 gap-3">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
              获取Yideng代币
            </h2>
            <Sparkles className="h-6 w-6 text-blue-400" />
          </div>
          <Exchange />
        </div>
      </section>
    </div>
  )
}