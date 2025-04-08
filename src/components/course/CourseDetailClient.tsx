"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Zap, ShoppingCart, CheckCircle, BookOpen, FileText, ArrowLeft } from "lucide-react";
import { CourseSections } from "@/components/course/CourseSections";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

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
}

interface CourseDetailClientProps {
  course: Course;
  sections: CourseSection[];
}

export function CourseDetailClient({ course, sections }: CourseDetailClientProps) {
  const [isPurchased] = useState(false);
  const router = useRouter();


  const handlePurchaseCourse = () => {
    // TODO: 实现课程购买流程
    toast.success("准备购买课程", {
      description: "课程购买功能正在开发中"
    });
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
          <span className="transition-colors duration-300 group-hover:text-primary">返回课程列表</span>
        </Button>
      </div>
      {/* 课程封面 */}
      <div className="w-full aspect-[21/9] rounded-xl overflow-hidden mb-8 shadow-md relative group">
        <img
          src={course.coverImage || ""}
          alt={course.title || course.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 课程标题和分类 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="px-3 py-1 text-sm rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 transition-all duration-300 hover:bg-blue-500/20 hover:border-blue-500/30">
            {course.category?.name || "未分类"}
          </span>
          <span className="text-sm text-foreground/40">
            更新于 {new Date(course.updatedAt).toLocaleDateString('zh-CN')}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300 hover:text-primary/90">
          {course.title || course.name}
        </h1>

        <p className="text-xl text-foreground/60 mb-6">
          {course.description}
        </p>
      </div>

      {/* 价格和购买按钮 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-br from-background/80 to-background/40 border border-white/[0.05] rounded-xl transition-all duration-300 hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/5 mb-10">
        <div className="flex items-center group">
          <Zap className="h-5 w-5 text-yellow-500 mr-2 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-2xl font-bold transition-colors duration-300 group-hover:text-yellow-500">{course.price} YIDENG</span>
        </div>

        <Button
          size="lg"
          className="w-full sm:w-auto transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
          onClick={handlePurchaseCourse}
          disabled={isPurchased}
        >
          {isPurchased ? (
            <>
              <CheckCircle className="h-5 w-5" />
              <span>已购买</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              <span>购买该课程</span>
            </>
          )}
        </Button>
      </div>

      {/* 课程详情标签页 */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full mb-8 grid grid-cols-2 bg-background border border-white/[0.05] rounded-lg p-1 h-auto">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-foreground/5 data-[state=active]:text-foreground data-[state=inactive]:text-foreground/40 py-3 rounded-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 flex-shrink-0" />
              <span>课程概述</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="sections"
            className="data-[state=active]:bg-foreground/5 data-[state=active]:text-foreground data-[state=inactive]:text-foreground/40 py-3 rounded-md transition-all relative cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 flex-shrink-0" />
              <span>章节内容</span>
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
            <h2 className="text-xl font-semibold mb-4 text-primary/90">课程概述</h2>
            <p className="text-foreground/60 whitespace-pre-line">
              {course.description || "暂无详细介绍"}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="sections" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-primary/90">章节列表</h2>
            <p className="text-foreground/40 text-sm mt-1">
              {isPurchased
                ? "您已购买此课程，可以观看所有章节内容"
                : "购买课程后即可观看所有章节内容"}
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