import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight } from "lucide-react";
import { CourseResponseDto as Course } from "@/api/models/CourseResponseDto";
import Link from "next/link";

interface CourseListProps {
  courses: Course[];
}

export function CourseList({ courses }: CourseListProps) {
  // 处理空数据情况
  if (!courses || courses.length === 0) {
    return (
      <div className="col-span-full text-center py-20">
        <h3 className="text-xl font-semibold mb-2">暂无课程</h3>
        <p className="text-foreground/40">
          当前分类下暂无课程，请尝试其他分类
        </p>
      </div>
    );
  }

  return (
    <>
      {courses.map(course => (
        <Link
          key={course.id}
          href={`/courses/${course.id}`}
          className="block cursor-pointer"
        >
          <div className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10">
            <Card
              className="h-full overflow-hidden border border-white/[0.05] bg-gradient-to-br from-background/80 to-background/40 transition-all duration-300 hover:border-purple-500/20"
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={course.coverImage || "https://via.placeholder.com/600x400?text=课程图片"}
                  alt={course.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300"></div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold line-clamp-1">{course.name}</h3>

                <p className="text-foreground/40 text-sm line-clamp-2">{course.description}</p>

                <div className="flex items-center justify-between pt-4">
                  <p className="font-semibold flex items-center">
                    <Zap className="h-4 w-4 text-yellow-500 mr-1.5" />
                    {course.price} YIDENG
                  </p>

                  <Button
                    size="sm"
                    className="rounded-full transition-all duration-300 hover:bg-primary-600 active:scale-95"
                  >
                    查看详情 <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </Link>
      ))}
    </>
  );
} 