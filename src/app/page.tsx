"use client"

import { Web3Hero } from "@/components/web3-hero"
import { TokenExchange } from "@/components/token-exchange"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ETH_TO_YIDENG_RATIO } from "@/lib/contract-config"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      {/* Hero Section */}
      <Web3Hero 
        badge="一灯大学"
        title1="区块链和Web3"
        title2="开发的最佳平台"
        description="学习区块链和Web3开发的最佳在线平台，使用Yideng代币解锁优质课程内容"
      />
      
      {/* Features Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            在我们的平台上开始您的 Web3 之旅
          </h2>
          <p className="text-foreground/40 max-w-2xl mx-auto">
            通过我们的易灯代币系统，解锁优质课程、获取认证并参与Web3社区
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-background/50 to-background/20 p-6 rounded-xl border border-white/[0.05] shadow-sm">
            <div className="w-12 h-12 bg-indigo-500/10 flex items-center justify-center rounded-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">实时学习</h3>
            <p className="text-foreground/40 mb-4">通过互动课程和实时项目开发，掌握区块链技术的核心概念</p>
            <Button variant="link" className="px-0 text-indigo-400 hover:text-indigo-300">
              探索课程 <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-gradient-to-br from-background/50 to-background/20 p-6 rounded-xl border border-white/[0.05] shadow-sm">
            <div className="w-12 h-12 bg-cyan-500/10 flex items-center justify-center rounded-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">代币经济</h3>
            <p className="text-foreground/40 mb-4">使用易灯代币购买课程、获取认证和享受平台特权</p>
            <Button variant="link" className="px-0 text-cyan-400 hover:text-cyan-300">
              了解代币 <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-gradient-to-br from-background/50 to-background/20 p-6 rounded-xl border border-white/[0.05] shadow-sm">
            <div className="w-12 h-12 bg-purple-500/10 flex items-center justify-center rounded-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">认证证书</h3>
            <p className="text-foreground/40 mb-4">完成课程后获取区块链上的认证证书，证明您的技能</p>
            <Button variant="link" className="px-0 text-purple-400 hover:text-purple-300">
              查看认证 <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Token Exchange Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              ETH 兑换 YIDENG 代币
            </h2>
            <p className="text-foreground/40 max-w-2xl mx-auto">
              使用以太币兑换YIDENG代币，以 1:{ETH_TO_YIDENG_RATIO} 的比例获得更多平台权益
            </p>
          </div>
          
          <TokenExchange className="mx-auto" />
        </div>
      </section>
      
      {/* Footer */}
      <footer className="px-4 py-8 md:py-12 border-t border-white/[0.05]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">易灯学院</h3>
            <p className="text-foreground/40 text-sm">
              区块链和Web3开发的前沿教育平台
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">产品</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/40 hover:text-foreground text-sm">课程</a></li>
              <li><a href="#" className="text-foreground/40 hover:text-foreground text-sm">认证</a></li>
              <li><a href="#" className="text-foreground/40 hover:text-foreground text-sm">代币</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">资源</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/40 hover:text-foreground text-sm">文档</a></li>
              <li><a href="#" className="text-foreground/40 hover:text-foreground text-sm">博客</a></li>
              <li><a href="#" className="text-foreground/40 hover:text-foreground text-sm">社区</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">联系我们</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/40 hover:text-foreground text-sm">关于我们</a></li>
              <li><a href="#" className="text-foreground/40 hover:text-foreground text-sm">联系方式</a></li>
              <li><a href="#" className="text-foreground/40 hover:text-foreground text-sm">支持</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 text-center text-sm text-foreground/40">
          &copy; {new Date().getFullYear()} 易灯学院. 保留所有权利.
        </div>
      </footer>
    </div>
  )
}