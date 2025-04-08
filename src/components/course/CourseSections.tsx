"use client";

import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CourseService } from "@/api";
import { toast } from "sonner";
import { PlayCircle, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CourseSection {
  id: number;
  title: string;
  description: string | null;
  order: number;
  videoUrl: string | null;
  courseDuration?: string; // 如 "10:30"
  isPreview?: boolean;
  isCompleted?: boolean;
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

        // 为示例添加预览章节
        const enhancedSections = sortedSections.map((section, index) => ({
          ...section,
          // 假设第一章节是免费预览
          isPreview: index === 0,
          // 假设视频持续时间
          courseDuration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        }));

        setSections(enhancedSections);
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

  useEffect(() => {
    fetchSections();
  }, [courseId]);

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

    if (!section.videoUrl) {
      toast.error("视频未就绪", {
        description: "该章节视频尚未上传或处理"
      });
      return;
    }

    router.push(`/courses/${courseId}/section/${section.id}`);
  };

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
                {section.isCompleted ? (
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
                {section.courseDuration && (
                  <span className="text-xs text-foreground/40">
                    {section.courseDuration}
                  </span>
                )}
              </div>
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
              <Button
                onClick={() => playSection(section)}
                disabled={!isPurchased && !section.isPreview}
                className="transition-all duration-300 hover:scale-105 active:scale-95"
                variant={isPurchased || section.isPreview ? "default" : "outline"}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                {isPurchased || section.isPreview ? "观看视频" : "购买后观看"}
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
} 