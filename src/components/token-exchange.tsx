"use client"

import { useState, useEffect, forwardRef, HTMLAttributes } from "react";
import { ArrowDown, Info, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ETH_TO_YIDENG_RATIO } from "@/lib/contract-config";
import { useAccount, useBalance } from "wagmi";
import { useYiDengToken } from "@/lib/contract-hooks";
import { useTranslations } from "next-intl";
import { toast } from "sonner";


interface TokenExchangeProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const TokenExchange = forwardRef<HTMLDivElement, TokenExchangeProps>(
  ({ className, ...props }, ref) => {
    const t = useTranslations('TokenExchange');
    const [amount, setAmount] = useState("1.0");
    const { address, isConnected } = useAccount();
    const { exchangeTokens, getBalance, status, error, isLoading } = useYiDengToken();
    const [yidengBalance, setYidengBalance] = useState<bigint>(BigInt(0));

    // 获取ETH余额
    const { data: ethBalanceData } = useBalance({
      address,
    });

    // 定期获取YIDENG代币余额
    useEffect(() => {
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

    // 计算可以兑换的Yideng代币数量
    const yidengAmount = parseFloat(amount || "0") * ETH_TO_YIDENG_RATIO;

    // 处理表单提交
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      try {
        // 先将浮点数转换为wei单位的BigInt
        const amountFloat = parseFloat(amount || "0");
        console.log("amountFloat", amountFloat);

        // 1 ETH = 10^18 Wei
        const amountInWei = BigInt(Math.floor(amountFloat * 10 ** 18));
        console.log("amountInWei", amountInWei);

        // 调用合约进行兑换
        exchangeTokens(amountInWei);
      } catch (error) {
        console.error("转换错误:", error);
        toast.error(t('InvalidInput'));
      }
    };

    // 交易状态显示
    const renderStatus = () => {
      if (status === 'loading') {
        return (
          <div className="mt-4 p-3 bg-yellow-500/10 text-yellow-500 rounded-lg flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{t('ExchangeProcessing')}</span>
          </div>
        );
      } else if (status === 'success') {
        return (
          <div className="mt-4 p-3 bg-green-500/10 text-green-500 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>{t('ExchangeSuccess', { yidengAmount: yidengAmount.toFixed(2) })}</span>
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
            <h3 className="text-xl font-bold text-foreground bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400">{t('title')}</h3>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Info className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-lg border border-purple-500/20 bg-background/80 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('from')}</span>
                <span className="text-xs text-muted-foreground">
                  {t('balance')}: {isConnected ?
                    `${ethBalanceData?.formatted || "0.00"} ${ethBalanceData?.symbol || "ETH"}` :
                    t('notConnected')}
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
                <span className="text-sm text-muted-foreground">{t('to')}</span>
                <span className="text-xs text-muted-foreground">
                  {t('balance')}: {isConnected ?
                    `${yidengBalance} YIDENG` :
                    t('notConnected')}
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
                <span className="text-muted-foreground">{t('rate')}</span>
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
                  {t('ExchangeProcessing')}
                </span>
              ) : isConnected ? (
                t('confirm')
              ) : (
                t('notConnected')
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