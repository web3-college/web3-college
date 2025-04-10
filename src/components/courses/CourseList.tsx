import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Eye, Trash2, PlusCircle, Loader2 } from "lucide-react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Input } from "@/components/ui/input";
import { CourseResponseDto as Course } from "@/api/models/CourseResponseDto";

interface CourseListProps {
  courses: Course[];
  isLoading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize?: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => void;
  onAdd?: () => void;
  addUrl?: string;
}

export function CourseList({
  courses,
  isLoading,
  totalItems,
  totalPages,
  currentPage,
  pageSize = 10,
  searchTerm,
  onSearchChange,
  onSearch,
  onPageChange,
  onDelete,
  onAdd,
  addUrl = "/admin/courses/new",
}: CourseListProps) {
  // 处理课程状态的颜色显示
  const statusBadgeColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-500/10 text-green-500 border-green-500/20"
      : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  };

  // 课程状态翻译
  const statusText = (isActive: boolean) => {
    return isActive ? "已上线" : "草稿";
  };

  return (
    <div className="space-y-6">
      {/* 搜索和添加按钮 */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex w-full sm:w-auto space-x-2">
          <Input
            placeholder="搜索课程名称..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-80"
          />
          <Button
            onClick={onSearch}
            variant="secondary"
            size="sm"
            className="ml-2"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "搜索"}
          </Button>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href={addUrl}>
            <PlusCircle className="h-4 w-4 mr-2" /> 添加课程
          </Link>
        </Button>
      </div>

      {/* 加载状态 */}
      {isLoading && courses.length === 0 ? (
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
                          src={course.coverImage || "https://via.placeholder.com/100"}
                          alt={course.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`px-3 py-1 text-xs rounded-full border ${statusBadgeColor(course.isActive)}`}>
                          {statusText(course.isActive)}
                        </span>
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                          {course.category?.name || "未分类"}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                      <p className="text-foreground/40 text-sm mb-4 line-clamp-2">{course.description}</p>
                    </div>

                    <div className="flex flex-wrap md:flex-nowrap gap-2 mt-4 md:mt-0 md:ml-4">
                      <Button variant="outline" size="sm" className="flex-1 md:flex-none" asChild>
                        <Link href={`/courses/${course.id}`}>
                          <Eye className="h-4 w-4 mr-1.5" /> 查看
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 md:flex-none" asChild>
                        <Link href={`/admin/courses/${course.id}/edit`}>
                          <Pencil className="h-4 w-4 mr-1.5" /> 编辑
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 md:flex-none text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        onClick={() => onDelete(course.id)}
                      >
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
              <Button asChild>
                <Link href="/admin/courses/new">创建第一个课程</Link>
              </Button>
            </div>
          )}

          {/* 分页控件 */}
          {!isLoading && totalPages > 1 && (
            <DataTablePagination
              currentPage={currentPage}
              totalItems={totalItems}
              totalPages={totalPages}
              onPageChange={onPageChange}
              pageSize={pageSize}
            />
          )}
        </>
      )}
    </div>
  );
} 