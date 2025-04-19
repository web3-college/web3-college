"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PermissionService } from "@/api";
import { toast } from "sonner";
import { PermissionList } from "@/components/permissions/PermissionList";
import { PermissionFormDialog } from "@/components/permissions/PermissionFormDialog";
import { Permission } from "@/types/types";
import debounce from "lodash/debounce";

export default function PermissionsPage() {
  // 跟踪初始加载状态
  const isInitialMount = useRef(true);
  // 状态定义
  const [permissions, setPermissions] = useState<Permission[]>([]);
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
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    name: "",
    action: "",
    description: ""
  });

  // 加载权限列表
  const loadPermissions = async (page = pagination.page, searchQuery = searchTerm) => {
    setIsLoading(true);
    try {
      const params: any = {
        page,
        pageSize: pagination.pageSize
      };

      // 添加搜索参数
      if (searchQuery) {
        if (searchQuery.includes(":")) {
          // 按操作搜索，如 "action:read:user"
          const [prefix, value] = searchQuery.split(":", 2);
          if (prefix === "action") {
            params.action = value;
          } else {
            params.name = searchQuery;
          }
        } else {
          // 默认按名称搜索
          params.name = searchQuery;
        }
      }

      const response = await PermissionService.permissionControllerFindAll(params);

      if (response && response.data && response.data.items) {
        setPermissions(response.data.items);
        setPagination({
          page: response.data.page || 1,
          pageSize: response.data.pageSize || 10,
          total: response.data.total || 0
        });
      }
    } catch (error) {
      console.error("获取权限列表失败:", error);
      toast.error("获取权限列表失败");
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
      loadPermissions(1, searchValue);
    }, 500),
    []
  );

  // 初始加载
  useEffect(() => {
    // 只在组件首次挂载时加载数据
    loadPermissions();
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
    loadPermissions(1, searchTerm);
  };

  // 打开添加权限对话框
  const openAddDialog = () => {
    setDialogType("add");
    setFormData({
      name: "",
      action: "",
      description: ""
    });
    setDialogOpen(true);
  };

  // 打开编辑权限对话框
  const openEditDialog = (permission: Permission) => {
    setDialogType("edit");
    setCurrentPermission(permission);
    setFormData({
      name: permission.name,
      action: permission.action,
      description: permission.description || ""
    });
    setDialogOpen(true);
  };

  // 表单提交处理
  const handleSubmit = async (data: typeof formData) => {
    try {
      if (dialogType === "add") {
        await PermissionService.permissionControllerCreate({
          requestBody: data
        });
        toast.success("权限创建成功");
      } else {
        if (currentPermission) {
          await PermissionService.permissionControllerUpdate({
            id: currentPermission.id,
            requestBody: data
          });
          toast.success("权限更新成功");
        }
      }
      setDialogOpen(false);
      loadPermissions();
    } catch (error) {
      console.error("操作失败:", error);
      toast.error(`${dialogType === "add" ? "创建" : "更新"}权限失败`);
    }
  };

  // 删除权限
  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这个权限吗？此操作不可撤销。")) {
      return;
    }

    try {
      await PermissionService.permissionControllerRemove({ id });
      toast.success("权限删除成功");
      loadPermissions();
    } catch (error) {
      console.error("删除权限失败:", error);
      toast.error("删除权限失败");
    }
  };

  // 分页处理
  const handlePageChange = (newPage: number) => {
    loadPermissions(newPage);
  };

  return (
    <>
      <PermissionList
        permissions={permissions}
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

      <PermissionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        dialogType={dialogType}
        initialData={formData}
        onSubmit={handleSubmit}
      />
    </>
  );
} 