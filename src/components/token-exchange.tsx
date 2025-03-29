"use client"

import * as React from "react";
import { ArrowDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ETH_TO_YIDENG_RATIO } from "@/lib/contract-config";

interface TokenExchangeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const TokenExchange = React.forwardRef<HTMLDivElement, TokenExchangeProps>(
  ({ className, ...props }, ref) => {
    const [amount, setAmount] = React.useState("1.0");

    // 计算可以兑换的Yideng代币数量（固定1:100的兑换比例）
    const yidengAmount = parseFloat(amount || "0") * ETH_TO_YIDENG_RATIO;

    // 处理表单提交
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // 这里可以添加实际的兑换逻辑，例如调用智能合约
      alert(`将兑换 ${amount} ETH 为 ${yidengAmount.toFixed(2)} YIDENG 代币`);
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-xl border-zinc-200 bg-background p-1 dark:border-zinc-800",
          className
        )}
        {...props}
      > 
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400">ETH兑换YIDENG代币</h3>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Info className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-lg border border-purple-500/20 bg-background/80 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">从</span>
                <span className="text-xs text-muted-foreground">余额: 2.45 ETH</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border-none bg-transparent text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="0.0"
                  step="0.01"
                  min="0"
                />
                <div className="flex h-10 w-[120px] items-center justify-center rounded-md bg-secondary px-3 py-2">
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-xs text-blue-500">Ξ</span>
                    </span>
                    <span>ETH</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div
                className="relative z-10 -my-2 h-10 w-10 rounded-full border-4 border-background bg-secondary flex items-center justify-center"
              >
                <ArrowDown className="h-4 w-4" />
              </div>
            </div>

            <div className="rounded-lg border border-indigo-500/20 bg-background/80 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">到</span>
                <span className="text-xs text-muted-foreground">余额: 245 YIDENG</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={yidengAmount.toFixed(2)}
                  readOnly
                  className="border-none bg-transparent text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="0.0"
                />
                <div className="flex h-10 w-[120px] items-center justify-center rounded-md bg-secondary px-3 py-2">
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <span className="text-xs text-yellow-500">¥</span>
                    </span>
                    <span>YIDENG</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-secondary/30 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">兑换率</span>
                <span>1 ETH = {ETH_TO_YIDENG_RATIO} YIDENG</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">网络费用</span>
                <span>0.005 ETH</span>
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 text-white hover:opacity-90"
            >
              确认兑换
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }
);

TokenExchange.displayName = "TokenExchange"; 