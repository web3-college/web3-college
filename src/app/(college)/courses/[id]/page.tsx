import { CourseService } from "@/api";
import { CourseDetailClient } from "@/components/course/CourseDetailClient";
import { notFound } from "next/navigation";

interface CourseSection {
  id: number;
  title: string;
  description: string | null;
  order: number;
  videoUrl: string | null;
}

export default async function CourseDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const courseId = Number(id);

  if (isNaN(courseId)) {
    throw new Error("无效的课程ID");
  }

  // 获取课程详情
  const courseResponse = await CourseService.courseControllerFindCourseById({
    id: courseId
  });

  // 获取课程章节
  const sectionsResponse = await CourseService.courseControllerFindAllCourseSections({
    courseId
  });

  const course = courseResponse.data;
  if (!course) {
    notFound();
  }

  const sections = sectionsResponse.data || [];

  // 按章节顺序排序
  const sortedSections = [...sections].sort(
    (a: CourseSection, b: CourseSection) => a.order - b.order
  );

  return (
    <CourseDetailClient
      course={course}
      sections={sortedSections}
    />
  );
} 