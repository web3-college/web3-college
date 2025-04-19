"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Zap, ShoppingCart, CheckCircle, BookOpen, FileText, ArrowLeft, Loader2, AlertCircle, Shield, Check } from "lucide-react";
import { CourseSections } from "@/components/course/CourseSections";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@/i18n/navigation";
import { CourseResponseDto as Course } from "@/api/models/CourseResponseDto";
import { useCourseMarket } from "@/lib/contract-hooks";
import { useAccount } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface CourseSection {
  id: number;
  title: string;
  description: string | null;
  order: number;
  videoUrl: string | null;
  isPreview?: boolean;
}

interface CourseDetailClientProps {
  course: Course;
  sections: CourseSection[];
}

export function CourseDetailClient({ course, sections }: CourseDetailClientProps) {
  const tCourses = useTranslations('Courses');
  const tCommon = useTranslations('Common');
  const tWallet = useTranslations('Wallet');
  const { purchaseCourse, approve, getAllowance, hasCourse } = useCourseMarket();
  const { isConnected } = useAccount();
  const [isPurchased, setIsPurchased] = useState(false);
  const [isCheckingPurchase, setIsCheckingPurchase] = useState(true);
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [approveStatus, setApproveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const router = useRouter();
  const [allowance, setAllowance] = useState<bigint>(BigInt(0));
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveAmount, setApproveAmount] = useState<string>("");
  const [customApproveAmount, setCustomApproveAmount] = useState<string>("");

  // 检查用户是否已购买该课程
  const checkPurchaseStatus = useCallback(async () => {
    if (isConnected && course.id) {
      setIsCheckingPurchase(true);
      try {
        const purchased = await hasCourse(course.id.toString());
        setIsPurchased(purchased);
      } catch (error) {
        console.error("检查购买状态失败:", error);
      } finally {
        setIsCheckingPurchase(false);
      }
    } else {
      setIsPurchased(false);
      setIsCheckingPurchase(false);
    }
  }, [isConnected, course.id, hasCourse]);

  useEffect(() => {
    checkPurchaseStatus();
  }, [checkPurchaseStatus]);

  // 添加检查授权额度的函数
  const checkAllowance = useCallback(async () => {
    if (!isConnected) return;

    try {
      setIsCheckingAllowance(true);
      const currentAllowance = await getAllowance();
      setAllowance(currentAllowance || BigInt(0));
      console.log('当前授权额度:', currentAllowance?.toString());
    } catch (error) {
      console.error('获取授权额度失败:', error);
      setAllowance(BigInt(0));
    } finally {
      setIsCheckingAllowance(false);
    }
  }, [isConnected, getAllowance]);

  // 在组件挂载和连接状态改变时检查授权额度
  useEffect(() => {
    checkAllowance();
  }, [checkAllowance]);

  // 在component函数顶部设置默认选项
  useEffect(() => {
    // 设置默认选项为"exact" - 课程价格
    if (!approveAmount) {
      setApproveAmount("exact");
    }
  }, [approveAmount]);

  // 授权代币
  const handleApprove = async () => {
    let amountToApprove: bigint;

    if (approveAmount === 'custom') {
      // 使用自定义金额
      if (!customApproveAmount || isNaN(Number(customApproveAmount))) {
        toast.error(tCourses("invalidInput"));
        return;
      }
      amountToApprove = BigInt(Number(customApproveAmount));
    } else if (approveAmount === 'double') {
      // 授权两倍课程价格
      amountToApprove = BigInt(course.price) * BigInt(2);
    } else {
      // 默认授权课程价格
      amountToApprove = BigInt(course.price);
    }

    if (amountToApprove <= BigInt(0)) {
      toast.error(tCourses("invalidAmount"));
      return;
    }

    setApproveStatus('loading');

    try {
      toast.info(tCourses("approvePending"), {
        description: tCourses("approvePendingDesc")
      });

      await approve(amountToApprove);
      setApproveStatus('success');
      setShowApproveModal(false);

      toast.success(tCourses("approveSuccess"), {
        description: tCourses("approveDesc", { amount: amountToApprove.toString() })
      });

      // 更新授权额度
      await checkAllowance();
    } catch (err: any) {
      console.error("授权失败:", err);
      setApproveStatus('error');

      if (err.message?.includes("user rejected")) {
        toast.error(tCourses("approveCanceled"), {
          description: tCourses("approveCanceledDesc"),
        });
      } else {
        toast.error(tCourses("approveError"), {
          description: err.message || tCourses("approveErrorDesc"),
        });
      }
    } finally {
      setTimeout(() => {
        if (approveStatus === 'loading') {
          setApproveStatus('idle');
        }
      }, 2000);
    }
  };

  // 修改购买课程方法
  const handlePurchaseCourse = async () => {
    if (!isConnected) {
      toast.error(tWallet("connectWallet"), {
        description: tWallet("purchaseCourse")
      });
      return;
    }

    if (!course.id) {
      toast.error(tCourses("invalidCourseId"));
      return;
    }

    // 检查授权额度是否足够
    const coursePrice = BigInt(course.price);
    if (allowance < coursePrice) {
      toast.error(tCourses("insufficientAllowance"), {
        description: tCourses("insufficientAllowanceDesc")
      });
      setShowApproveModal(true);
      return;
    }

    // 重置状态
    setPurchaseStatus('loading');

    try {
      // 直接进行购买，不需要再授权
      const hash = await purchaseCourse(course.id.toString());
      setTxHash(hash);
      setPurchaseStatus('success');
      toast.success(tCourses("purchaseSuccess"), {
        description: tCourses("purchaseSuccessDesc"),
      });

      // 重新检查购买状态
      await checkPurchaseStatus();
      // 更新授权额度
      await checkAllowance();
    } catch (err: any) {
      console.error("交易失败:", err);
      setPurchaseStatus('error');

      // 针对不同错误类型显示不同提示
      if (err.message?.includes("insufficient funds")) {
        toast.error(tCourses("insufficientFunds"), {
          description: tCourses("insufficientFundsDesc"),
        });
      } else if (err.message?.includes("user rejected")) {
        toast.error(tCourses("transactionCanceled"), {
          description: tCourses("transactionCanceledDesc"),
        });
      } else if (err.message?.includes("already purchased")) {
        toast.error(tCourses("alreadyPurchased"), {
          description: tCourses("alreadyPurchasedDesc"),
        });
        // 重新检查购买状态
        await checkPurchaseStatus();
      } else {
        toast.error(tCourses("purchaseError"), {
          description: err.message || tCourses("purchaseErrorDesc"),
        });
      }
    } finally {
      // 5秒后重置状态
      setTimeout(() => {
        setPurchaseStatus('idle');
      }, 5000);
    }
  };

  const handleBackClick = () => {
    router.push('/market');
  };

  return (
    <>
      {/* 返回按钮 */}
      <div className="mb-8">
        <Button
          variant="ghost"
          className="pl-0 hover:bg-transparent group transition-all duration-300 cursor-pointer"
          onClick={handleBackClick}
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="transition-colors duration-300 group-hover:text-primary">{tCourses("back")}</span>
        </Button>
      </div>

      {/* 课程封面 */}
      <div className="w-full aspect-[21/9] rounded-xl overflow-hidden mb-8 shadow-md relative group">
        <img
          src={course.coverImage || ""}
          alt={course.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 课程标题和分类 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="px-3 py-1 text-sm rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 transition-all duration-300 hover:bg-blue-500/20 hover:border-blue-500/30">
            {course.category?.name || tCourses("unClassified")}
          </span>
          <span className="text-sm text-foreground/40">
            {tCourses("updatedAt")} {new Date(course.updatedAt).toLocaleDateString('zh-CN')}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300 hover:text-primary/90">
          {course.name}
        </h1>
      </div>

      {/* 价格和购买按钮 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-br from-background/80 to-background/40 border border-white/[0.05] rounded-xl transition-all duration-300 hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/5 mb-10">
        <div className="flex flex-col w-full">
          <div className="flex items-center group mb-2">
            <Zap className="h-5 w-5 text-yellow-500 mr-2 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-2xl font-bold transition-colors duration-300 group-hover:text-yellow-500">{course.price} YIDENG</span>
          </div>

          {/* 显示授权额度 */}
          {isConnected && (
            <div className="flex items-center text-sm text-gray-500 ml-1">
              <Shield className="h-3.5 w-3.5 mr-1 text-gray-400" />
              {isCheckingAllowance ? (
                <span className="flex items-center">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  {tCourses("checkAllowance")}
                </span>
              ) : (
                <span>
                  {tCourses("currentAllowance")} <span className="font-medium">{allowance.toString()} YIDENG</span>
                  {allowance < BigInt(course.price) ? (
                    <button
                      onClick={() => setShowApproveModal(true)}
                      className="ml-2 text-blue-500 underline cursor-pointer"
                    >
                      {tCourses("approveToken")}
                    </button>
                  ) : null}
                </span>
              )}
            </div>
          )}
        </div>

        <Button
          size="lg"
          className="w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
          onClick={handlePurchaseCourse}
          disabled={isPurchased || isCheckingPurchase || purchaseStatus === 'loading' || !isConnected}
        >
          {isCheckingPurchase ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{tCourses("checkPurchase")}</span>
            </>
          ) : isPurchased ? (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>{tCourses("hasPurchased")}</span>
            </>
          ) : purchaseStatus === 'loading' ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{tCourses("purchasing")}</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              <span>{tCourses("purchase")}</span>
            </>
          )}
        </Button>
      </div>

      {/* 授权对话框 */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tCourses("approveToken")}</DialogTitle>
            <DialogDescription>
              {tCourses("approveDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{tCourses("price")}</span>
              <span className="font-mono">{course.price} YIDENG</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">{tCourses("currentAllowance")}</span>
              <span className="font-mono">{allowance.toString()} YIDENG</span>
            </div>

            <div className="h-px bg-gray-200 my-2"></div>

            <div className="space-y-3 mt-2">
              <button
                type="button"
                onClick={() => setApproveAmount("exact")}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-md ${approveAmount === "exact"
                  ? "bg-primary/10 border border-primary/30"
                  : "border hover:bg-gray-100"
                  }`}
              >
                <div className="flex items-center">
                  {approveAmount === "exact" && <Check className="h-4 w-4 mr-2 text-primary" />}
                  <span>{tCourses("approveCoursePrice")}</span>
                </div>
                <span className="font-mono">{course.price} YIDENG</span>
              </button>

              <button
                type="button"
                onClick={() => setApproveAmount("double")}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-md ${approveAmount === "double"
                  ? "bg-primary/10 border border-primary/30"
                  : "border hover:bg-gray-100"
                  }`}
              >
                <div className="flex items-center">
                  {approveAmount === "double" && <Check className="h-4 w-4 mr-2 text-primary" />}
                  <span>{tCourses("approveDoublePrice")}</span>
                </div>
                <span className="font-mono">{BigInt(course.price) * BigInt(2)} YIDENG</span>
              </button>

              <div
                className={`w-full px-4 py-2 rounded-md ${approveAmount === "custom"
                  ? "bg-primary/10 border border-primary/30"
                  : "border hover:bg-gray-100"
                  }`}
              >
                <div className="flex items-center mb-2">
                  <button
                    type="button"
                    onClick={() => setApproveAmount("custom")}
                    className="flex items-center"
                  >
                    {approveAmount === "custom" && <Check className="h-4 w-4 mr-2 text-primary" />}
                    <span>{tCourses("customApproveAmount")}</span>
                  </button>
                </div>
                <Input
                  type="number"
                  min="0"
                  placeholder={tCourses("approveAmount")}
                  value={customApproveAmount}
                  onChange={(e) => {
                    setCustomApproveAmount(e.target.value);
                    if (e.target.value) {
                      setApproveAmount("custom");
                    }
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveModal(false)}>
              {tCommon("cancel")}
            </Button>
            <Button
              onClick={handleApprove}
              disabled={approveStatus === 'loading'}
              className="flex items-center"
            >
              {approveStatus === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {tCourses("approvePending")}
                </>
              ) : (
                tCourses("approveConfirm")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 课程详情标签页 */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full mb-8 grid grid-cols-2 bg-background border border-white/[0.05] rounded-lg p-1 h-auto">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-foreground/5 data-[state=active]:text-foreground data-[state=inactive]:text-foreground/40 py-3 rounded-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 flex-shrink-0" />
              <span>{tCourses("courseOverview")}</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="sections"
            className="data-[state=active]:bg-foreground/5 data-[state=active]:text-foreground data-[state=inactive]:text-foreground/40 py-3 rounded-md transition-all relative cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 flex-shrink-0" />
              <span>{tCourses("courseSections")}</span>
              {sections.length > 0 && (
                <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full text-xs bg-primary/10 text-primary min-w-5 text-center">
                  {sections.length}
                </span>
              )}
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="p-6 bg-gradient-to-br from-background/80 to-background/40 border border-white/[0.05] rounded-xl transition-all duration-300 hover:border-purple-500/10">
            <h2 className="text-xl font-semibold mb-4 text-primary/90">{tCourses("courseOverview")}</h2>
            <p className="text-foreground/60 whitespace-pre-line">
              {course.description || tCourses("noDescription")}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="sections" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-primary/90">{tCourses("chapterList")}</h2>
            <p className="text-foreground/40 text-sm mt-1">
              {isPurchased
                ? tCourses("purchasedDescription")
                : tCourses("purchaseDescription")}
            </p>
          </div>

          <CourseSections
            courseId={course.id}
            isPurchased={isPurchased}
          />
        </TabsContent>
      </Tabs>
    </>
  );
} 