"use client"

import * as React from "react";
import { ArrowDown, Info, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ETH_TO_YIDENG_RATIO } from "@/lib/contract-config";
import { useAccount, useBalance } from "wagmi";
import { useYiDengToken } from "@/lib/contract-hooks";

interface TokenExchangeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const TokenExchange = React.forwardRef<HTMLDivElement, TokenExchangeProps>(
  ({ className, ...props }, ref) => {
    const [amount, setAmount] = React.useState("1.0");
    const { address, isConnected } = useAccount();
    const { exchangeTokens, getBalance, status, error, isLoading } = useYiDengToken();
    const [yidengBalance, setYidengBalance] = React.useState<bigint>(BigInt(0));

    // 获取ETH余额
    const { data: ethBalanceData } = useBalance({
      address,
    });

    // 定期获取YIDENG代币余额
    React.useEffect(() => {
      let isMounted = true;
      
      const fetchBalance = async () => {
        if (isConnected && address) {
          try {
            const balance = await getBalance();
            if (isMounted) {
              setYidengBalance(balance);
            }
          } catch (err) {
            console.error("获取代币余额错误:", err);
          }
        }
      };
      
      fetchBalance();
      // 每10秒刷新一次余额
      const interval = setInterval(fetchBalance, 10000);
      
      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }, [isConnected, address, getBalance, status]);

    // 格式化YIDENG余额，从Wei转换为更易读的格式
    const formattedYidengBalance = React.useMemo(() => {
      try {
        // 转换BigInt为字符串后再转为数字
        const balanceAsString = yidengBalance.toString();
        // 假设代币有18位小数
        const balanceAsNumber = Number(balanceAsString) / Math.pow(10, 18);
        return balanceAsNumber.toFixed(2);
      } catch (error) {
        console.error("余额格式化错误:", error);
        return "0.00";
      }
    }, [yidengBalance]);

    // 计算可以兑换的Yideng代币数量
    const yidengAmount = parseFloat(amount || "0") * ETH_TO_YIDENG_RATIO;

    // 处理表单提交
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
        // 将ETH金额转换为Wei (1 ETH = 10^18 Wei)
        // 先将浮点数转换为整数部分和小数部分
        const amountFloat = parseFloat(amount || "0");
        // 转换为Wei (乘以10^18)
        const amountInWei = BigInt(Math.floor(amountFloat * 1e18));
        
        // 调用合约进行兑换
        exchangeTokens(amountInWei);
      } catch (error) {
        console.error("转换错误:", error);
        alert("金额转换错误，请输入有效数字");
      }
    };

    // 交易状态显示
    const renderStatus = () => {
      if (status === 'loading') {
        return (
          <div className="mt-4 p-3 bg-yellow-500/10 text-yellow-500 rounded-lg flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>交易处理中，请稍候...</span>
          </div>
        );
      } else if (status === 'success') {
        return (
          <div className="mt-4 p-3 bg-green-500/10 text-green-500 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>交易成功！您已获得 {yidengAmount.toFixed(2)} YIDENG 代币</span>
          </div>
        );
      } else if (status === 'error' && error) {
        return (
          <div className="mt-4 p-3 bg-red-500/10 text-red-500 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        );
      }
      return null;
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
                <span className="text-xs text-muted-foreground">
                  余额: {isConnected ? 
                    `${ethBalanceData?.formatted || "0.00"} ${ethBalanceData?.symbol || "ETH"}` : 
                    "未连接钱包"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border-none bg-transparent text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="0.0"
                  step="0.001"
                  min="0"
                  disabled={!isConnected || isLoading}
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
                <span className="text-xs text-muted-foreground">
                  余额: {isConnected ? 
                    `${formattedYidengBalance} YIDENG` : 
                    "未连接钱包"}
                </span>
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
            </div>

            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 text-white hover:opacity-90"
              disabled={!isConnected || !amount || parseFloat(amount) <= 0 || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  兑换处理中...
                </span>
              ) : isConnected ? (
                "确认兑换"
              ) : (
                "请先连接钱包"
              )}
            </Button>
            
            {/* 交易状态信息 */}
            {renderStatus()}
          </form>
        </CardContent>
      </Card>
    );
  }
);

TokenExchange.displayName = "TokenExchange"; 