import { CourseService } from "@/api";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

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

interface SectionLayoutProps {
  children: ReactNode;
  params: Promise<{ id: string, sectionId: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string, sectionId: string }> }) {
  try {
    const newParams = await params;
    const courseId = Number(newParams.id);
    const sectionId = Number(newParams.sectionId);

    const [courseResponse, sectionResponse] = await Promise.all([
      CourseService.courseControllerFindCourseById({ id: courseId }),
      CourseService.courseControllerFindAllCourseSections({ courseId })
    ]);

    if (!courseResponse?.data || !sectionResponse?.data) {
      return {
        title: '课程章节',
        description: '视频课程章节'
      };
    }

    const course = courseResponse.data;
    const sections = sectionResponse.data;
    const currentSection = sections.find((s: CourseSection) => s.id === sectionId);

    if (!currentSection) {
      return {
        title: course.title || course.name,
        description: course.description
      };
    }

    return {
      title: `${currentSection.title} - ${course.title || course.name}`,
      description: currentSection.description || course.description
    };
  } catch (e) {
    return {
      title: '课程章节',
      description: '视频课程章节'
    };
  }
}

export default async function SectionLayout({ children, params }: SectionLayoutProps) {
  const newParams = await params;
  const courseId = Number(newParams.id);
  const sectionId = Number(newParams.sectionId);

  if (isNaN(courseId) || isNaN(sectionId)) {
    notFound();
  }

  // 获取课程章节数据
  try {
    // 获取所有章节
    const sectionResponse = await CourseService.courseControllerFindAllCourseSections({
      courseId
    });

    if (!sectionResponse?.data || !Array.isArray(sectionResponse.data)) {
      notFound();
    }

    // 排序章节
    const sortedSections = [...sectionResponse.data].sort(
      (a: CourseSection, b: CourseSection) => a.order - b.order
    );

    // 增强章节数据
    const enhancedSections = sortedSections.map((section, index) => ({
      ...section,
      isPreview: index === 0, // 假设第一章是免费预览
      courseDuration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
    }));

    // 检查当前章节是否存在
    const currentSection = enhancedSections.find(s => s.id === sectionId);
    if (!currentSection) {
      notFound();
    }

    // 检查课程信息
    const courseResponse = await CourseService.courseControllerFindCourseById({
      id: courseId
    });

    if (!courseResponse?.data) {
      notFound();
    }

    // 将数据挂载到searchParams中用于客户端组件提取
    const searchParams = new URLSearchParams();
    searchParams.set("course", JSON.stringify(courseResponse.data));
    searchParams.set("sections", JSON.stringify(enhancedSections));
    searchParams.set("currentSection", JSON.stringify(currentSection));

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-5xl">
          {children}
        </div>
      </div>
    );
  } catch (error) {
    console.error("获取章节数据出错", error);
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-5xl p-4 md:p-8">
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <h1 className="text-2xl font-bold mb-4">加载出错</h1>
            <p className="text-foreground/40">无法加载章节数据，请稍后重试</p>
          </div>
        </div>
      </div>
    );
  }
} 