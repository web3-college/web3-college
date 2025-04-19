"use client";

import { Card } from "@/components/ui/card";
import {
  Book,
  Users,
  BadgeDollarSign,
  FileText,
  Activity
} from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">管理控制台</h1>
        <p className="text-foreground/60">管理Web3学院课程、用户和交易</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border border-white/[0.05] bg-gradient-to-br from-background/80 to-background/40">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Book className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">12</h2>
              <p className="text-sm text-foreground/60">课程总数</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-white/[0.05] bg-gradient-to-br from-background/80 to-background/40">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">183</h2>
              <p className="text-sm text-foreground/60">注册用户</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-white/[0.05] bg-gradient-to-br from-background/80 to-background/40">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
              <BadgeDollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">2,450</h2>
              <p className="text-sm text-foreground/60">代币总量</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-white/[0.05] bg-gradient-to-br from-background/80 to-background/40">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
              <FileText className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">45</h2>
              <p className="text-sm text-foreground/60">颁发证书</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">最近交易</h2>
        <Card className="border border-white/[0.05] bg-gradient-to-br from-background/80 to-background/40">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  <th className="text-left p-4">用户</th>
                  <th className="text-left p-4">类型</th>
                  <th className="text-left p-4">金额</th>
                  <th className="text-left p-4">时间</th>
                  <th className="text-left p-4">状态</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/[0.05]">
                  <td className="p-4">张三</td>
                  <td className="p-4">购买课程</td>
                  <td className="p-4">100 YIDENG</td>
                  <td className="p-4">2023-11-15 14:30</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                      完成
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-white/[0.05]">
                  <td className="p-4">李四</td>
                  <td className="p-4">兑换代币</td>
                  <td className="p-4">0.5 ETH → 500 YIDENG</td>
                  <td className="p-4">2023-11-15 13:25</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                      完成
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-white/[0.05]">
                  <td className="p-4">王五</td>
                  <td className="p-4">购买课程</td>
                  <td className="p-4">150 YIDENG</td>
                  <td className="p-4">2023-11-15 11:10</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                      处理中
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-4">赵六</td>
                  <td className="p-4">获取证书</td>
                  <td className="p-4">-</td>
                  <td className="p-4">2023-11-15 10:05</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                      完成
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">平台活跃度</h2>
        <Card className="p-6 border border-white/[0.05] bg-gradient-to-br from-background/80 to-background/40">
          <div className="flex items-center mb-4">
            <Activity className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium">活跃度趋势</h3>
          </div>
          <div className="h-48 flex items-end space-x-2">
            {[35, 45, 30, 65, 40, 80, 60, 55, 70, 75, 50, 65].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500/20 hover:bg-blue-500/40 transition-all rounded-t-sm"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs mt-2 text-foreground/60">{i + 1}月</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
} 