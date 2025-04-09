"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Eye, Trash2 } from "lucide-react";

interface CourseSection {
  id: number;
  title: string;
  description: string | null;
  order: number;
  videoUrl: string | null;
}

interface Course {
  id: number;
  web2CourseId: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  level: string;
  category: string;
  status: string;
  txHash: string | null;
  sections: CourseSection[];
}

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取课程列表
  useEffect(() => {
    async function fetchCourses() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/courses");

        if (!response.ok) {
          throw new Error("获取课程列表失败");
        }

        const data = await response.json();
        setCourses(data.courses || []);
      } catch (err: any) {
        console.error("获取课程错误:", err);
        setError(err.message || "获取课程列表失败");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourses();
  }, []);

  // 处理课程状态的颜色显示
  const statusBadgeColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "DRAFT": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "INACTIVE": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  // 课程状态翻译
  const statusText = (status: string) => {
    switch (status) {
      case "ACTIVE": return "已上线";
      case "DRAFT": return "草稿";
      case "INACTIVE": return "已下线";
      default: return status;
    }
  };

  return (
    <div>
      {/* 错误信息显示 */}
      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      {/* 加载状态 */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 animate-pulse">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-40 bg-foreground/5 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <>
          {/* 课程列表 */}
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="p-6 border border-white/[0.05] bg-gradient-to-br from-background/80 to-background/40"
                >
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                      <div className="w-24 h-24 rounded-lg overflow-hidden">
                        <img
                          src={course.imageUrl || "https://via.placeholder.com/100"}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`px-3 py-1 text-xs rounded-full border ${statusBadgeColor(course.status)}`}>
                          {statusText(course.status)}
                        </span>
                        <span className="px-3 py-1 text-xs rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
                          {course.level}
                        </span>
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          {course.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                      <p className="text-foreground/40 text-sm mb-4 line-clamp-2">{course.description}</p>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap gap-2 mt-4 md:mt-0 md:ml-4">
                      <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                        <Eye className="h-4 w-4 mr-1.5" /> 查看
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                        <Pencil className="h-4 w-4 mr-1.5" /> 编辑
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 md:flex-none text-red-500 hover:text-red-600 hover:bg-red-500/10">
                        <Trash2 className="h-4 w-4 mr-1.5" /> 删除
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold mb-2">暂无课程</h3>
              <p className="text-foreground/40 mb-8">
                您还没有创建任何课程，马上开始创建吧！
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
} 