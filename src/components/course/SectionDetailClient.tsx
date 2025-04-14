"use client";

import { useEffect, useState, useTransition, useRef, useCallback } from "react";
import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import VideoPlayer from "./VideoPlayer";
import { useCourseMarket } from "@/lib/contract-hooks";
import { CourseService } from "@/api/services/CourseService";
import { useSIWE } from "connectkit";
import { SectionStatus } from "@/types";

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
  const router = useRouter();
  const [isPurchased, setIsPurchased] = useState(false);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [currentSection, setCurrentSection] = useState<CourseSection>({} as CourseSection);
  const { hasCourse, status, isLoading, error } = useCourseMarket();
  const [isPending, startTransition] = useTransition();
  const { isSignedIn } = useSIWE();
  const [isLoadingSections, setIsLoadingSections] = useState(true);

  // 视频播放进度状态
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingProgress = useRef(false);

  const checkPurchased = async () => {
    const isPurchased = await hasCourse(courseId.toString());
    setIsPurchased(isPurchased);
    // 检查权限 - 如果未购买且不是预览章节，显示购买提示
    if (!isPurchased && !currentSection.isPreview) {
      toast("需要购买课程", {
        description: "该章节需要购买后才能观看",
        action: {
          label: "购买课程",
          onClick: () => navigateToCoursePage()
        }
      });
    } else if (!isSignedIn) {
      toast("需要登录", {
        description: "请先登录才能观看课程",
      });
    }
  }

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
      setCurrentSection(currentSection);

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
      toast.error("获取章节数据失败", {
        description: "请稍后重试"
      });
    } finally {
      setIsLoadingSections(false);
    }
  }

  useEffect(() => {
    checkPurchased();
    fetchSections();

    // 监听页面离开事件
    const handleBeforeUnload = () => {
      if (isPurchased && isSignedIn) {
        updateProgress(true);
      }
    };

    // 添加页面卸载前的事件监听器
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 每30秒更新一次进度
    if (isPurchased && isSignedIn) {
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
      if (isPurchased && isSignedIn) {
        updateProgress(true);
      }
    };
  }, [courseId, sectionId, isPurchased, isSignedIn]);

  // 更新进度的函数
  const updateProgress = useCallback(async (isExiting = false) => {
    // 防止重复更新
    if (isUpdatingProgress.current) return;

    try {
      // 如果进度小于1%或者没有播放，不更新
      if (!currentSection.id || !isPurchased || !isSignedIn || progress < 1) {
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
        toast.success("章节已完成", {
          description: "您已成功完成本章节学习"
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
  }, [courseId, sectionId, currentSection.id, isPurchased, isSignedIn, progress, currentTime]);

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
        toast("本章节已完成", {
          description: "是否播放下一章节？",
          action: {
            label: "播放下一章",
            onClick: () => navigateToSection('next')
          }
        });
      }
    } else {
      // 如果是最后一个视频，显示完成提示
      toast.success("恭喜！", {
        description: "您已完成课程的所有章节",
        action: {
          label: "返回课程",
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
      toast("需要购买课程", {
        description: "购买课程后即可观看所有章节",
        action: {
          label: "购买课程",
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
          <span className="transition-colors duration-300 group-hover:text-primary">返回课程</span>
        </Button>
      </div>

      {/* 加载状态 */}
      {isLoadingSections ? (
        <div className="w-full aspect-video flex items-center justify-center bg-background/40 rounded-lg border border-white/10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-foreground/60">加载章节数据中...</p>
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
                <p className="text-foreground/40">视频不存在</p>
              </div>
            )}
          </div>

          {/* 章节信息 */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{currentSection.title}</h1>
            <p className="text-foreground/60 whitespace-pre-line">
              {currentSection.description || "暂无章节描述"}
            </p>

            {/* 播放进度信息 - 仅对已购买用户显示 */}
            {isPurchased && (
              <div className="mt-4 p-4 bg-background/10 rounded-lg border border-white/[0.05]">
                <div className="flex justify-between items-center text-sm text-foreground/60">
                  <span>观看进度: {Math.round(progress)}%</span>
                  <span>
                    {new Date(currentTime * 1000).toISOString().substr(14, 5)} /
                    {duration ? new Date(duration * 1000).toISOString().substr(14, 5) : "00:00"}
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
              上一章
            </Button>

            <Button
              variant="outline"
              onClick={() => navigateToSection('next')}
              disabled={isPending || sections.findIndex(s => s.id === currentSection.id) === sections.length - 1}
              className="transition-all duration-300 hover:bg-foreground/5 active:scale-95"
            >
              下一章
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
} 