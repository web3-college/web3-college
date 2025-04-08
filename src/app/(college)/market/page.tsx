import { CourseService, CategoryService } from "@/api";
import { MarketClient } from "@/components/market/MarketClient";
import { Suspense } from "react";

// 从CreateCourseDto派生出Course类型
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

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  order: number;
  isActive: boolean;
}

interface MarketPageProps {
  searchParams: Promise<{ categoryId?: string }>;
}

export default async function MarketPage({ searchParams }: MarketPageProps) {
  const params = await searchParams;
  const selectedCategoryId = params.categoryId ? parseInt(params.categoryId) : null;

  // 获取课程列表
  const coursesParams: any = { isActive: true };
  if (selectedCategoryId) {
    coursesParams.categoryId = selectedCategoryId;
  }

  const [courseResult, categoryResult] = await Promise.all([
    CourseService.courseControllerFindAllCourses(coursesParams),
    CategoryService.categoryControllerFindAllCategories({ isActive: true })
  ]);

  // 处理课程数据
  let courses: Course[] = [];
  if (courseResult && Array.isArray(courseResult.data.courses)) {
    courses = courseResult.data.courses;
  }

  // 处理分类数据
  let categories: Category[] = [];
  if (categoryResult && Array.isArray(categoryResult.data)) {
    // 按order排序
    categories = [...categoryResult.data].sort(
      (a: Category, b: Category) => a.order - b.order
    );
  }

  return (
    <MarketClient
      courses={courses}
      categories={categories}
    />
  );
}