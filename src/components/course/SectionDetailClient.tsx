"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import VideoPlayer from "./VideoPlayer";

interface Course {
  id: number;
  title: string;
  name: string;
  description: string;
  coverImage: string;
  price: number;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
  isActive: boolean;
  creator: string;
  onChainId?: number;
  updatedAt: string;
  createdAt: string;
}

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
  course: Course;
  sections: CourseSection[];
  currentSection: CourseSection;
  isPurchased: boolean;
}

export function SectionDetailClient({
  course,
  sections,
  currentSection,
  isPurchased
}: SectionDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // 检查权限 - 如果未购买且不是预览章节，显示购买提示
    if (!isPurchased && !currentSection.isPreview) {
      toast("需要购买课程", {
        description: "该章节需要购买后才能观看",
        action: {
          label: "购买课程",
          onClick: () => navigateToCoursePage()
        }
      });
    }
  }, [currentSection.id, isPurchased]);

  // 返回课程详情页
  const navigateToCoursePage = () => {
    startTransition(() => {
      router.push(`/courses/${course.id}`);
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
      router.push(`/courses/${course.id}/section/${targetSection.id}`);
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
        {currentSection.isPreview && !isPurchased && (
          <div className="inline-block bg-green-500/10 text-green-500 border border-green-500/20 rounded-full px-3 py-1 mb-4 text-sm">
            免费预览
          </div>
        )}
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
    </div>
  );
} 