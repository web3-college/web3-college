import { CourseService, CategoryService } from "@/api";
import { MarketClient } from "@/components/market/MarketClient";
import { CourseResponseDto as Course } from "@/api/models/CourseResponseDto";

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
  if (courseResult && Array.isArray(courseResult?.data?.items)) {
    courses = courseResult.data.items as Course[];
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