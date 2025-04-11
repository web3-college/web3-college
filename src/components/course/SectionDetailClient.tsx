"use client";

import { useEffect, useState, useTransition } from "react";
import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import VideoPlayer from "./VideoPlayer";
import { useCourseMarket } from "@/lib/contract-hooks";
import { CourseService } from "@/api/services/CourseService";
import { useSIWE } from "connectkit";



interface CourseSection {
  id: number;
  title: string;
  description: string | null;
  order: number;
  videoUrl: string | null;
  courseDuration?: string;
  isPreview?: boolean;
  isCompleted?: boolean;
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
  }, []);

  // 返回课程详情页
  const navigateToCoursePage = () => {
    startTransition(() => {
      router.push(`/courses/${courseId}`);
    });
  };

  // 切换到上一章或下一章
  const navigateToSection = (direction: 'prev' | 'next') => {

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
                <VideoPlayer src={currentSection.videoUrl} />
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