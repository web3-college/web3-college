"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Image } from "lucide-react";
import { CourseResponseDto } from "@/api/models/CourseResponseDto";
import { Skeleton } from "@/components/ui/skeleton";

interface PurchasedCoursesListProps {
  courses: CourseResponseDto[];
  isLoading: boolean;
}

// 课程骨架屏组件
function CourseSkeletons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="h-full border border-white/[0.05] rounded-xl overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <div className="p-6 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}

// 空课程列表状态
function EmptyCoursesList() {
  return (
    <div className="text-center py-10 border border-dashed border-foreground/10 rounded-lg">
      <Image className="h-10 w-10 mx-auto mb-4 text-foreground/30" />
      <h3 className="text-lg font-medium mb-2">暂无已购课程</h3>
      <p className="text-foreground/40 mb-6">您尚未购买任何课程，去市场看看吧</p>
      <Button asChild>
        <Link href="/market">浏览课程市场</Link>
      </Button>
    </div>
  );
}

// 课程列表内容
function CourseContent({ courses }: { courses: CourseResponseDto[] }) {
  if (courses.length === 0) {
    return <EmptyCoursesList />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <Link key={course.id} href={`/courses/${course.id}`}>
          <Card className="h-full border border-white/[0.05] bg-gradient-to-br from-background/80 to-background/40 hover:border-purple-500/20 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/5 overflow-hidden cursor-pointer">
            <div className="aspect-video overflow-hidden">
              <img
                src={course.coverImage || ""}
                alt={course.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                  已购买
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  {course.category?.name || "未分类"}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 line-clamp-1">{course.name}</h3>
              <p className="text-foreground/40 text-sm mb-4 line-clamp-2">{course.description}</p>
              <Button variant="outline" size="sm" className="group">
                <PlayCircle className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                继续学习
              </Button>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function PurchasedCoursesList({ courses, isLoading }: PurchasedCoursesListProps) {
  if (isLoading) {
    return <CourseSkeletons />;
  }

  return (
    <CourseContent courses={courses} />
  );
} 