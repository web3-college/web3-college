"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CategoryService } from "@/api";
import { toast } from "sonner";
import { CategoryList } from "@/components/categories/CategoryList";
import { CategoryFormDialog } from "@/components/categories/CategoryFormDialog";
import debounce from "lodash/debounce";

// 分类类型
interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  // 跟踪初始加载状态
  const isInitialMount = useRef(true);

  // 状态管理
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  });

  // 对话框状态
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"add" | "edit">("add");
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    order: 0,
    isActive: true
  });

  // 获取分类列表
  const fetchCategories = async (page = pagination.page, searchQuery = searchTerm) => {
    setIsLoading(true);
    try {
      const params: any = {
        page,
        pageSize: pagination.pageSize
      };

      // 添加搜索参数
      if (searchQuery) {
        params.name = searchQuery;
      }

      const response = await CategoryService.categoryControllerFindAllCategories(params);

      if (response?.data) {
        const data = response.data;
        // API可能返回数组或分页对象，需要适配两种情况
        if (Array.isArray(data)) {
          // 如果返回的是数组，手动构建分页数据
          setCategories(data as Category[]);
          setPagination(prev => ({
            ...prev,
            total: data.length,
          }));
        } else {
          // 如果返回的是分页对象，尝试提取分页数据
          const responseData = data as any;
          if (responseData.items) {
            setCategories(responseData.items as Category[]);
            setPagination({
              page: responseData.page || 1,
              pageSize: responseData.pageSize || 10,
              total: responseData.total || 0
            });
          }
        }
      }
    } catch (error) {
      console.error("获取分类列表失败:", error);
      toast.error("获取分类列表失败");
    } finally {
      // 设置初始挂载标志为false
      isInitialMount.current = false;
      setIsLoading(false);
    }
  };

  // 使用 lodash 的 debounce 实现搜索防抖
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      fetchCategories(1, searchValue);
    }, 500),
    []
  );

  // 初始加载
  useEffect(() => {
    // 只在组件首次挂载时加载数据
    fetchCategories();
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

  // 处理搜索输入变化
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // 手动搜索按钮
  const handleSearch = () => {
    fetchCategories(1, searchTerm);
  };

  // 打开添加分类对话框
  const openAddDialog = () => {
    setDialogType("add");
    setFormData({
      name: "",
      description: "",
      icon: "",
      order: 0,
      isActive: true
    });
    setDialogOpen(true);
  };

  // 打开编辑分类对话框
  const openEditDialog = (category: Category) => {
    setDialogType("edit");
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
      order: category.order,
      isActive: category.isActive
    });
    setDialogOpen(true);
  };

  // 表单提交处理
  const handleSubmit = async (data: typeof formData) => {
    try {
      if (dialogType === "add") {
        await CategoryService.categoryControllerCreateCategory({
          requestBody: data
        });
        toast.success("分类创建成功");
      } else {
        if (currentCategory) {
          await CategoryService.categoryControllerUpdateCategory({
            id: currentCategory.id,
            requestBody: data
          });
          toast.success("分类更新成功");
        }
      }
      setDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("操作失败:", error);
      toast.error(`${dialogType === "add" ? "创建" : "更新"}分类失败`);
    }
  };

  // 删除分类
  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这个分类吗？此操作不可撤销。")) {
      return;
    }

    try {
      await CategoryService.categoryControllerDeleteCategory({ id });
      toast.success("分类删除成功");
      fetchCategories();
    } catch (error) {
      console.error("删除分类失败:", error);
      toast.error("删除分类失败");
    }
  };

  // 分页处理
  const handlePageChange = (newPage: number) => {
    fetchCategories(newPage);
  };

  return (
    <>
      <CategoryList
        categories={categories}
        isLoading={isLoading}
        pagination={pagination}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        onAddNew={openAddDialog}
        onEdit={openEditDialog}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
      />

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        dialogType={dialogType}
        initialData={formData}
        onSubmit={handleSubmit}
      />
    </>
  );
} 