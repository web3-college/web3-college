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


  // 将数据传递给客户端组件
  return (
    <SectionDetailClient
      courseId={courseId}
      sectionId={sectionId}
    />
  );
} 