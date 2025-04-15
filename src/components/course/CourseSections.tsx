"use client";

import { useState, useEffect, useCallback } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CertificateService, CourseService } from "@/api";
import { toast } from "sonner";
import { PlayCircle, Lock, CheckCircle, Award, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { formatDuration } from "@/lib/file";
import { useSIWE } from "connectkit";
import { Progress } from "@/components/ui/progress";
import { SectionStatus, CertificateStatus } from "@/types";

interface CourseSection {
  id: number;
  title: string;
  description: string | null;
  order: number;
  duration?: number; // 视频时长（秒）
  isPreview?: boolean;
  progress?: number;
  status?: SectionStatus;
  lastPosition?: number;
}

interface CourseSectionsProps {
  courseId: number;
  isPurchased?: boolean;
}

export function CourseSections({ courseId, isPurchased = false }: CourseSectionsProps) {
  const router = useRouter();
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | undefined>("section-0"); // 默认展开第一个
  const { isSignedIn } = useSIWE();
  const [overallProgress, setOverallProgress] = useState(0); // 整体课程进度
  const [isCourseCompleted, setIsCourseCompleted] = useState(false); // 课程是否完成
  const [isRequestingCertificate, setIsRequestingCertificate] = useState(false); // 是否正在申请证书
  const [certificateStatus, setCertificateStatus] = useState<CertificateStatus | null>(null); // 证书状态
  const [isCheckingCertificate, setIsCheckingCertificate] = useState(false); // 是否正在检查证书状态

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      const response = await CourseService.courseControllerFindAllCourseSections({
        courseId
      });

      if (response && Array.isArray(response.data)) {
        // 按章节顺序排序
        const sortedSections = [...response.data].sort(
          (a: CourseSection, b: CourseSection) => a.order - b.order
        );

        setSections(sortedSections);

        // 计算总体课程进度
        if (isPurchased) {
          calculateOverallProgress(sortedSections);
        }
      } else {
        setSections([]);
      }
    } catch (error) {
      console.error("获取课程章节出错:", error);
      toast.error("获取章节失败", {
        description: "加载章节数据时出现错误，请稍后重试"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 计算整体课程完成进度
  const calculateOverallProgress = (sections: CourseSection[]) => {
    if (!sections.length) return;

    // 计算已完成的章节数量
    const completedSections = sections.filter(
      section => section.status === SectionStatus.COMPLETED
    ).length;

    // 计算进行中章节的平均进度
    const inProgressSections = sections.filter(
      section => section.status === SectionStatus.STARTED
    );

    let inProgressTotalPercent = 0;
    inProgressSections.forEach(section => {
      inProgressTotalPercent += section.progress || 0;
    });

    // 总进度 = (完成章节 + 进行中章节的进度总和 / 100) / 总章节数 * 100
    const totalProgress =
      (completedSections + (inProgressTotalPercent / 100)) / sections.length * 100;

    const progress = Math.round(totalProgress);
    setOverallProgress(progress);

    // 判断课程是否完成（进度=100%）
    setIsCourseCompleted(progress === 100);
  };

  // 申请课程证书
  const requestCertificate = useCallback(async () => {
    if (!isSignedIn || !isCourseCompleted) return;

    try {
      setIsRequestingCertificate(true);

      // 调用证书申请API
      await CertificateService.certificateControllerCreateCertificateRequest({
        requestBody: {
          courseId,
          notes: "课程完成证书申请"
        }
      });

      toast.success("申请成功", {
        description: "您的证书申请已提交，请等待审核",
      });
    } catch (error: any) {
      console.error("证书申请失败:", error);

      // 错误处理
      if (error?.status === 400) {
        toast.error("申请失败", {
          description: "未满足条件或已申请过证书",
        });
      } else if (error?.status === 401) {
        toast.error("申请失败", {
          description: "请先登录后再申请证书",
        });
      } else {
        toast.error("申请失败", {
          description: "证书申请提交失败，请稍后重试",
        });
      }
    } finally {
      setIsRequestingCertificate(false);
    }
  }, [courseId, isSignedIn, isCourseCompleted]);

  // 检查用户是否已申请过该课程的证书
  const checkCertificateStatus = useCallback(async () => {
    if (!isSignedIn || !isPurchased) return;

    try {
      setIsCheckingCertificate(true);
      // 获取用户的所有证书请求
      const response = await CertificateService.certificateControllerGetUserCertificateRequests();

      // 查找当前课程的证书请求
      if (response && Array.isArray(response.data)) {
        const certificate = response.data.find((cert: any) => cert.courseId === courseId);
        console.log(certificate);

        if (certificate) {
          setCertificateStatus(certificate.status);
        }
      }
    } catch (error) {
      console.error("获取证书状态失败:", error);
    } finally {
      setIsCheckingCertificate(false);
    }
  }, [courseId, isSignedIn, isPurchased]);

  useEffect(() => {
    if (!isSignedIn) {
      toast("需要登录", {
        description: "请先登录才能观看课程",
      });
    }
    fetchSections();

    // 检查证书状态
    if (isSignedIn && isPurchased) {
      checkCertificateStatus();
    }
  }, [courseId, isSignedIn, isPurchased]);

  // 播放章节视频
  const playSection = (section: CourseSection) => {
    if (!isPurchased && !section.isPreview) {
      toast("需要购买课程", {
        description: "购买课程后即可观看所有章节",
        action: {
          label: "购买课程",
          onClick: () => console.log("准备购买课程")
        }
      });
      return;
    }

    router.push(`/courses/${courseId}/section/${section.id}`);
  };

  // 渲染证书状态标签
  const renderCertificateStatus = useCallback(() => {
    if (!certificateStatus) return null;

    switch (certificateStatus) {
      case CertificateStatus.PENDING:
        return (
          <div className="mt-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-lg p-2 text-center text-sm">
            <span className="inline-flex items-center">
              证书申请审核中，请耐心等待
            </span>
          </div>
        );
      case CertificateStatus.APPROVED:
      case CertificateStatus.ISSUED:
        return (
          <div className="mt-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg p-2 text-center text-sm">
            <span className="inline-flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              证书已{certificateStatus === CertificateStatus.APPROVED ? '批准' : '颁发'}，可在个人中心查看
            </span>
          </div>
        );
      case CertificateStatus.REJECTED:
        return (
          <div className="mt-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg p-2 text-center text-sm">
            <span className="inline-flex items-center">
              <X className="h-4 w-4 mr-2" />
              证书申请被拒绝，如有疑问请联系管理员
            </span>
          </div>
        );
      default:
        return null;
    }
  }, [certificateStatus]);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-16 bg-foreground/5 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed border-foreground/10 rounded-lg">
        <p className="text-foreground/40">该课程暂无章节内容</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 已购买课程显示总体进度 */}
      {isPurchased && (
        <div className="bg-foreground/[0.02] border border-white/[0.05] rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">学习进度</span>
            <span className="text-sm text-foreground/60">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-green-500" />

          <div className="mt-2 flex justify-between text-xs text-foreground/40">
            <span>已完成章节: {sections.filter(s => s.status === SectionStatus.COMPLETED).length}/{sections.length}</span>
            {isCourseCompleted ? (
              <span className="text-green-500">恭喜！课程已完成</span>
            ) : (
              <span>继续加油！</span>
            )}
          </div>

          {/* 渲染证书状态 */}
          {isCheckingCertificate ? (
            <div className="mt-2 flex justify-center items-center text-xs text-foreground/60">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              正在检查证书状态...
            </div>
          ) : (
            renderCertificateStatus()
          )}

          {/* 课程完成后显示申请证书按钮 - 仅在没有申请过证书时显示 */}
          {isCourseCompleted && isPurchased && isSignedIn && !certificateStatus && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={requestCertificate}
                disabled={isRequestingCertificate}
                className="bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 font-medium px-6 py-2 rounded-full cursor-pointer"
              >
                <Award className="mr-2 h-5 w-5 animate-pulse" />
                {isRequestingCertificate ? "申请中..." : "申请课程证书"}
              </Button>
            </div>
          )}
        </div>
      )}

      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={expandedSection}
        onValueChange={setExpandedSection}
      >
        {sections.map((section, index) => (
          <AccordionItem
            key={section.id}
            value={`section-${index}`}
            className="border border-white/[0.05] rounded-lg mb-3 overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:bg-foreground/5 transition-colors duration-300 hover:no-underline">
              <div className="flex items-center w-full text-left">
                <div className="flex-shrink-0 mr-3">
                  {section.status === SectionStatus.COMPLETED ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : section.isPreview || isPurchased ? (
                    <PlayCircle className="h-5 w-5 text-foreground/70" />
                  ) : (
                    <Lock className="h-5 w-5 text-foreground/50" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-base">
                    {section.title}
                  </h3>
                  {section.duration && (
                    <span className="text-xs text-foreground/40">
                      {formatDuration(section.duration)}
                    </span>
                  )}
                </div>
                {/* 章节状态标签 */}
                {isPurchased && section.status && (
                  <div className="mr-4">
                    {section.status === SectionStatus.COMPLETED ? (
                      <span className="text-xs bg-green-500/10 text-green-500 border border-green-500/20 rounded-full px-2 py-0.5">
                        已完成
                      </span>
                    ) : section.status === SectionStatus.STARTED && section.progress ? (
                      <span className="text-xs bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full px-2 py-0.5">
                        进行中 {section.progress}%
                      </span>
                    ) : (
                      <span className="text-xs bg-foreground/10 text-foreground/60 border border-foreground/20 rounded-full px-2 py-0.5">
                        未开始
                      </span>
                    )}
                  </div>
                )}
                {(section.isPreview && !isPurchased) && (
                  <span className="text-xs bg-green-500/10 text-green-500 border border-green-500/20 rounded-full px-2 py-0.5 mr-4">
                    免费预览
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-foreground/[0.02] border-t border-white/[0.05]">
              <div className="p-4">
                <p className="text-sm text-foreground/70 mb-4">
                  {section.description || "暂无章节描述"}
                </p>
                {/* 章节进度条（仅购买后显示且有进度时显示） */}
                {isPurchased && section.status === SectionStatus.STARTED && section.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-foreground/60">已学习</span>
                      <span className="text-xs text-foreground/60">{section.progress}%</span>
                    </div>
                    <Progress value={section.progress} className="h-1.5 [&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-green-500" />
                  </div>
                )}
                <Button
                  onClick={() => playSection(section)}
                  disabled={(!isPurchased && !section.isPreview) || !isSignedIn}
                  className="transition-all duration-300 hover:scale-105 active:scale-95"
                  variant={isPurchased || section.isPreview ? "default" : "outline"}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  {isPurchased ? (
                    section.status === SectionStatus.COMPLETED ? "再次观看" : (
                      section.progress && section.progress > 0 ? "继续观看" : "开始学习"
                    )
                  ) : (
                    section.isPreview ? "观看预览" : "购买后观看"
                  )}
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
} 