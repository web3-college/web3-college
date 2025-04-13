"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CourseSkeletons } from "./CourseSkeletons";
import { CourseList } from "./CourseList";
import { CourseService } from "@/api";
import { CourseResponseDto as Course } from "@/api/models/CourseResponseDto";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  order: number;
  isActive: boolean;
}

interface MarketClientProps {
  courses: Course[];
  categories: Category[];
}

export function MarketClient({ courses, categories }: MarketClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initCategoryId = searchParams.get('categoryId')
    ? Number(searchParams.get('categoryId'))
    : null;

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(initCategoryId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [displayedCourses, setDisplayedCourses] = useState<Course[]>(courses);

  // 在组件加载时设置初始课程
  useEffect(() => {
    setDisplayedCourses(courses);
  }, [courses]);

  // 获取指定分类的课程
  const fetchCoursesByCategory = async (categoryId: number | null) => {
    try {
      setIsLoading(true);

      const params: any = { isActive: true };
      if (categoryId !== null) {
        params.categoryId = categoryId;
      }

      const result = await CourseService.courseControllerFindAllCourses(params);

      if (result?.data?.items && result.data.items.length > 0) {
        setDisplayedCourses(result.data.items as Course[]);
      } else {
        setDisplayedCourses([]);
        toast.warning("未找到课程", {
          description: "该分类下暂无课程"
        });
      }
    } catch (error) {
      console.error("获取课程出错:", error);
      toast.error("获取课程失败", {
        description: "加载课程数据时出现错误，请稍后重试"
      });
      // 出错时回退到原有数据
      setDisplayedCourses(courses);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理分类选择
  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    setIsLoading(true);
    // 更新URL查询参数
    const params = new URLSearchParams();
    if (categoryId !== null) {
      params.set('categoryId', categoryId.toString());
    }
    router.push(`/market${categoryId !== null ? `?${params.toString()}` : ''}`);
    fetchCoursesByCategory(categoryId);
  };

  return (
    <>
      {/* 分类过滤器 */}
      <div className="mb-10 flex flex-wrap gap-2 justify-center">
        <Button
          key="all"
          variant={selectedCategoryId === null ? "default" : "outline"}
          onClick={() => handleCategorySelect(null)}
          className="rounded-full cursor-pointer"
          disabled={isLoading}
        >
          全部
        </Button>

        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategoryId === category.id ? "default" : "outline"}
            onClick={() => handleCategorySelect(category.id)}
            className="rounded-full cursor-pointer"
            disabled={isLoading}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* 课程列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <CourseSkeletons count={6} />
        ) : (
          <CourseList courses={displayedCourses} />
        )}
      </div>
    </>
  );
} 