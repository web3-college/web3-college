import { CourseService } from "@/api";
import { notFound } from "next/navigation";
import { SectionDetailClient } from "@/components/course/SectionDetailClient";

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

export default async function SectionPage({
  params
}: {
  params: Promise<{ id: string; sectionId: string }>
}) {
  const newParams = await params;
  const courseId = Number(newParams.id);
  const sectionId = Number(newParams.sectionId);

  // 验证参数
  if (isNaN(courseId) || isNaN(sectionId)) {
    notFound();
  }

  try {
    // 并行获取课程和章节数据
    const [courseResponse, sectionsResponse] = await Promise.all([
      CourseService.courseControllerFindCourseById({
        id: courseId
      }),
      CourseService.courseControllerFindAllCourseSections({
        courseId
      })
    ]);

    // 验证课程数据
    const course = courseResponse.data;
    if (!course) {
      notFound();
    }

    // 验证并处理章节数据
    const sections = Array.isArray(sectionsResponse.data) ? sectionsResponse.data : [];
    if (sections.length === 0) {
      notFound();
    }

    // 按顺序排序章节
    const sortedSections = [...sections].sort(
      (a: CourseSection, b: CourseSection) => a.order - b.order
    );

    // 增强章节数据
    const enhancedSections = sortedSections.map((section, index) => ({
      ...section,
      isPreview: index === 0, // 假设第一个章节是免费预览
      courseDuration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
    }));

    // 查找当前章节
    const currentSection = enhancedSections.find(s => s.id === sectionId);
    if (!currentSection) {
      notFound();
    }

    // TODO: 检查用户是否已购买课程，实际应该调用API
    const isPurchased = false;

    // 将数据传递给客户端组件
    return (
      <SectionDetailClient
        course={course}
        sections={enhancedSections}
        currentSection={currentSection}
        isPurchased={isPurchased}
      />
    );
  } catch (error) {
    console.error("获取课程章节数据出错:", error);
    notFound();
  }
} 