"use client";

import { useEffect, useState, useTransition, useRef, useCallback, useMemo } from "react";
import { notFound } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import VideoPlayer from "./VideoPlayer";
import { useCourseMarket } from "@/lib/contract-hooks";
import { CourseService } from "@/api/services/CourseService";
import { useSIWE } from "connectkit";
import { SectionStatus } from "@/types";
import { useTranslations } from "next-intl";

interface CourseSection {
  id: number;
  title: string;
  description: string | null;
  order: number;
  videoUrl: string | null;
  courseDuration?: string;
  isPreview?: boolean;
  isCompleted?: boolean;
  progress?: number;
  status?: SectionStatus;
  lastPosition?: number;
}

interface SectionDetailClientProps {
  courseId: number;
  sectionId: number;
}

export function SectionDetailClient({
  courseId,
  sectionId
}: SectionDetailClientProps) {
  const tCourseSections = useTranslations('CourseSections');
  const router = useRouter();
  const [isPurchased, setIsPurchased] = useState(false);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [currentSection, setCurrentSection] = useState<CourseSection>({} as CourseSection);
  const { hasCourse } = useCourseMarket();
  const [isPending, startTransition] = useTransition();
  const { isSignedIn } = useSIWE();
  const [isLoadingSections, setIsLoadingSections] = useState(true);

  // 视频播放进度状态
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingProgress = useRef(false);

  const hasPermission = useMemo(() => {
    return isPurchased || currentSection.isPreview;
  }, [isPurchased, currentSection.isPreview]);

  const fetchSections = async () => {
    setIsLoadingSections(true);
    try {
      const sectionsResponse =
        await CourseService.courseControllerFindAllCourseSections({
          courseId
        })

      // 验证并处理章节数据
      const sections = Array.isArray(sectionsResponse.data) ? sectionsResponse.data : [];
      if (sections.length === 0) {
        notFound();
      }
      // 按顺序排序章节
      const sortedSections = [...sections].sort(
        (a: CourseSection, b: CourseSection) => a.order - b.order
      );
      setSections(sortedSections);

      // 查找当前章节
      const currentSection = sortedSections.find(s => s.id === sectionId);
      if (!currentSection) {
        notFound();
      }
      console.log('currentSection', currentSection);

      setCurrentSection(currentSection);
      const hasAccess = currentSection.isPreview || await hasCourse(courseId.toString());
      setIsPurchased(!currentSection.isPreview && hasAccess);

      // 如果没有访问权限，才显示提示
      if (!hasAccess) {
        toast(tCourseSections("needPurchase"), {
          description: tCourseSections("needPurchaseDesc"),
          action: {
            label: tCourseSections("purchaseWatch"),
            onClick: () => navigateToCoursePage()
          }
        });
      } else if (!isSignedIn) {
        toast(tCourseSections("needLogin"), {
          description: tCourseSections("needLoginDesc"),
        });
      }
      // 如果有之前的观看位置，设置初始时间
      if (currentSection.lastPosition && currentSection.lastPosition > 0) {
        setCurrentTime(currentSection.lastPosition);
      }

      // 设置初始进度
      if (currentSection.progress) {
        setProgress(currentSection.progress);
      }
    } catch (error) {
      console.error("获取章节数据失败:", error);
      toast.error(tCourseSections("getSectionsError"), {
        description: tCourseSections("getSectionsErrorDesc")
      });
    } finally {
      setIsLoadingSections(false);
    }
  }

  useEffect(() => {
    fetchSections();

    // 监听页面离开事件
    const handleBeforeUnload = () => {
      if (hasPermission && isSignedIn) {
        updateProgress(true);
      }
    };

    // 添加页面卸载前的事件监听器
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 每30秒更新一次进度
    if (hasPermission && isSignedIn) {
      progressInterval.current = setInterval(() => {
        updateProgress();
      }, 30000); // 30秒保存一次进度
    }

    return () => {
      // 清理定时器和事件监听器
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // 组件卸载时也保存进度
      if (hasPermission && isSignedIn) {
        updateProgress(true);
      }
    };
  }, [courseId, sectionId, isSignedIn]);

  // 更新进度的函数
  const updateProgress = useCallback(async (isExiting = false) => {
    // 防止重复更新
    if (isUpdatingProgress.current) return;

    try {
      // 如果进度小于1%或者没有播放，不更新
      if (!currentSection.id || !hasPermission || !isSignedIn || progress < 1) {
        return;
      }

      isUpdatingProgress.current = true;

      // 判断是否完成 (进度超过95%视为完成)
      const isCompleted = progress >= 95;
      const status = isCompleted ? SectionStatus.COMPLETED : SectionStatus.STARTED;

      // 调用API更新进度
      await CourseService.courseControllerUpdateProgress({
        requestBody: {
          courseId,
          sectionId: currentSection.id,
          progress: Math.round(progress),
          lastPosition: Math.floor(currentTime)
        }
      });

      // 如果是退出时保存且是完成状态，显示提示
      if (isExiting && isCompleted) {
        toast.success(tCourseSections("sectionCompleted"), {
          description: tCourseSections("sectionCompletedDesc")
        });
      }

      console.log("进度已更新:", {
        courseId,
        sectionId: currentSection.id,
        progress: Math.round(progress),
        lastPosition: Math.floor(currentTime),
        status
      });
    } catch (error) {
      console.error("更新进度失败:", error);
    } finally {
      isUpdatingProgress.current = false;
    }
  }, [courseId, sectionId, currentSection.id, hasPermission, isSignedIn, progress, currentTime]);

  // 视频播放时间更新处理
  const handleTimeUpdate = useCallback((currentTime: number, duration: number) => {
    setCurrentTime(currentTime);
    setDuration(duration);

    // 计算进度百分比
    if (duration > 0) {
      const newProgress = (currentTime / duration) * 100;
      setProgress(newProgress);
    }
  }, []);

  // 视频结束处理
  const handleVideoEnded = useCallback(() => {
    // 视频结束时，设置为完成状态并保存进度
    setProgress(100);
    updateProgress(true);

    // 如果有下一个视频，提示是否播放
    const currentIndex = sections.findIndex(s => s.id === currentSection.id);
    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];

      // 如果下一节是免费或已购买，显示提示
      if (nextSection.isPreview || isPurchased) {
        toast(tCourseSections("sectionCompleted"), {
          description: tCourseSections("sectionCompletedDesc"),
          action: {
            label: tCourseSections("playNext"),
            onClick: () => navigateToSection('next')
          }
        });
      }
    } else {
      // 如果是最后一个视频，显示完成提示
      toast.success(tCourseSections("congratulations"), {
        description: tCourseSections("congratulationsDesc"),
        action: {
          label: tCourseSections("backToCourse"),
          onClick: () => navigateToCoursePage()
        }
      });
    }
  }, [sections, currentSection.id, isPurchased]);

  // 返回课程详情页
  const navigateToCoursePage = () => {
    // 在导航前更新进度
    if (isPurchased && isSignedIn) {
      updateProgress(true);
    }

    startTransition(() => {
      router.push(`/courses/${courseId}`);
    });
  };

  // 切换到上一章或下一章
  const navigateToSection = (direction: 'prev' | 'next') => {
    // 在导航前更新当前章节进度
    if (isPurchased && isSignedIn) {
      updateProgress(true);
    }

    const currentIndex = sections.findIndex(s => s.id === currentSection.id);
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
    } else {
      newIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : currentIndex;
    }

    // 检查是否有权限访问
    const targetSection = sections[newIndex];
    if (!isPurchased && !targetSection.isPreview) {
      toast(tCourseSections("needPurchase"), {
        description: tCourseSections("needPurchaseDesc"),
        action: {
          label: tCourseSections("purchaseWatch"),
          onClick: () => navigateToCoursePage()
        }
      });
      return;
    }

    // 导航到新章节
    startTransition(() => {
      router.push(`/courses/${courseId}/section/${targetSection.id}`);
    });
  };

  return (
    <div className="p-4 md:p-8 flex flex-col">
      {/* 顶部导航 */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="pl-0 hover:bg-transparent group transition-all duration-300"
          onClick={navigateToCoursePage}
          disabled={isPending}
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="transition-colors duration-300 group-hover:text-primary">{tCourseSections("backToCourse")}</span>
        </Button>
      </div>

      {/* 加载状态 */}
      {isLoadingSections ? (
        <div className="w-full aspect-video flex items-center justify-center bg-background/40 rounded-lg border border-white/10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-foreground/60">{tCourseSections("loading")}</p>
          </div>
        </div>
      ) : (
        <>
          {/* 视频播放区域 */}
          <div className="mb-8 w-full">
            {currentSection.videoUrl ? (
              <div className="rounded-lg overflow-hidden border border-white/[0.05] bg-black/20">
                <VideoPlayer
                  src={currentSection.videoUrl}
                  initialTime={currentSection.lastPosition}
                  onTimeUpdate={handleTimeUpdate}
                  onProgress={setProgress}
                  onEnded={handleVideoEnded}
                />
              </div>
            ) : (
              <div className="w-full aspect-video flex items-center justify-center bg-background/40 rounded-lg border border-white/10">
                <p className="text-foreground/40">{tCourseSections("videoNotFound")}</p>
              </div>
            )}
          </div>

          {/* 章节信息 */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{currentSection.title}</h1>
            <p className="text-foreground/60 whitespace-pre-line">
              {currentSection.description || tCourseSections("noDescription")}
            </p>

            {/* 播放进度信息 - 仅对已购买用户显示 */}
            {isPurchased && (
              <div className="mt-4 p-4 bg-background/10 rounded-lg border border-white/[0.05]">
                <div className="flex justify-between items-center text-sm text-foreground/60">
                  <span>{tCourseSections("watchProgress")}: {Math.round(progress)}%</span>
                  <span>
                    {new Date(currentTime * 1000).toISOString().substring(14, 5)} /
                    {duration ? new Date(duration * 1000).toISOString().substring(14, 5) : "00:00"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 章节导航 */}
          <div className="flex justify-between mt-auto pt-6 border-t border-white/[0.05]">
            <Button
              variant="outline"
              onClick={() => navigateToSection('prev')}
              disabled={isPending || sections.findIndex(s => s.id === currentSection.id) === 0}
              className="transition-all duration-300 hover:bg-foreground/5 active:scale-95"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {tCourseSections("prevSection")}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigateToSection('next')}
              disabled={isPending || sections.findIndex(s => s.id === currentSection.id) === sections.length - 1}
              className="transition-all duration-300 hover:bg-foreground/5 active:scale-95"
            >
              {tCourseSections("nextSection")}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
} 