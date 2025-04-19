"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { CourseService } from "@/api/services/CourseService";
import { CourseList, DeleteCourseDialog } from "@/components/course";
import { CourseResponseDto as Course } from "@/api/models/CourseResponseDto";
import debounce from "lodash/debounce";

export default function CoursesAdminPage() {
  // 跟踪初始加载状态
  const isInitialMount = useRef(true);

  // 状态管理
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  });

  // 删除确认对话框状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);

  // 获取课程列表
  const fetchCourses = async (page = pagination.page, searchQuery = searchTerm) => {
    try {
      setIsLoading(true);
      const params: any = {
        page,
        limit: pagination.pageSize
      };

      // 添加搜索参数
      if (searchQuery) {
        params.name = searchQuery;
      }

      const response = await CourseService.courseControllerFindAllCourses(params);

      if (response.code === 200 && response.data) {
        setCourses(response.data.items as Course[]);
        setPagination({
          page: page,
          pageSize: pagination.pageSize,
          total: response.data.total || 0
        });
        setError(null);
      } else {
        setError(response.msg || "获取课程列表失败");
      }
    } catch (err: any) {
      console.error("获取课程错误:", err);
      setError(err.message || "获取课程列表失败");
      toast.error("获取课程列表失败");
    } finally {
      isInitialMount.current = false;
      setIsLoading(false);
    }
  };

  // 使用 lodash 的 debounce 实现搜索防抖
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      setPagination(prev => ({
        ...prev,
        page: 1
      }));
      fetchCourses(1, searchValue);
    }, 500),
    []
  );

  // 初始加载
  useEffect(() => {
    fetchCourses();
  }, []);

  // 监听搜索词变化，使用防抖自动搜索
  useEffect(() => {
    // 跳过首次渲染时的搜索，避免重复请求
    if (isInitialMount.current) return;

    debouncedSearch(searchTerm);
    // 组件卸载时取消防抖
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  // 分页变化时重新加载
  useEffect(() => {
    // 跳过首次渲染时的分页加载，避免重复请求
    if (isInitialMount.current) return;
    fetchCourses(pagination.page);
  }, [pagination.page]);

  // 处理搜索输入变化
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // 手动搜索按钮
  const handleSearch = () => {
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
    fetchCourses(1, searchTerm);
  };

  // 处理页码变化
  const handlePageChange = (page: number) => {
    setPagination(prev => ({
      ...prev,
      page
    }));
  };

  // 确认删除课程
  const confirmDeleteCourse = (id: number) => {
    setCourseToDelete(id);
    setDeleteDialogOpen(true);
  };

  // 删除课程
  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setIsLoading(true);
      const response = await CourseService.courseControllerDeleteCourse({ id: courseToDelete });

      if (response.code === 200) {
        toast.success("课程删除成功");
        fetchCourses(pagination.page);
      } else {
        toast.error(response.msg || "删除课程失败");
      }
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    } catch (err: any) {
      console.error("删除课程错误:", err);
      toast.error(err.message || "删除课程失败");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 错误信息显示 */}
      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      {/* 课程列表组件 */}
      <CourseList
        courses={courses}
        isLoading={isLoading}
        totalItems={pagination.total}
        totalPages={Math.ceil(pagination.total / pagination.pageSize)}
        currentPage={pagination.page}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onDelete={confirmDeleteCourse}
      />

      {/* 删除确认对话框 */}
      <DeleteCourseDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteCourse}
        isLoading={isLoading}
      />
    </>
  );
} 