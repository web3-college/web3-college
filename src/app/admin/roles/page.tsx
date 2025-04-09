"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { RoleService } from "@/api/services/RoleService";
import { PermissionService } from "@/api/services/PermissionService";
import { toast } from "sonner";
import { RoleList } from "@/components/roles/RoleList";
import { RoleFormDialog } from "@/components/roles/RoleFormDialog";
import { Role, Permission } from "@/types/types";
import debounce from "lodash/debounce";

export default function RolesPage() {
  // 跟踪初始加载状态
  const isInitialMount = useRef(true);
  // 状态管理
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    description: "",
    permissionIds: [] as number[]
  });

  // 加载角色数据
  const loadRoles = async (currentPage = page, searchQuery = searchTerm) => {
    setLoading(true);
    try {
      const response = await RoleService.roleControllerFindAll({
        page: currentPage,
        pageSize: 10,
        name: searchQuery || undefined
      });

      if (response.code === 200 && response.data) {
        setRoles(response.data.items || []);
        if (response.data.total) {
          setTotalPages(Math.ceil(response.data.total / 10));
          setTotalItems(response.data.total);
        }
      } else {
        toast.error("加载角色失败: " + response.msg);
      }
    } catch (error) {
      console.error("加载角色错误:", error);
      toast.error("加载角色出错，请稍后重试");
    } finally {
      isInitialMount.current = false;
      setLoading(false);
    }
  };

  // 加载所有权限数据用于选择
  const loadAllPermissions = async () => {
    try {
      const response = await PermissionService.permissionControllerFindAll({
        page: 1,
        pageSize: 100
      });

      if (response.code === 200 && response.data) {
        setPermissions(response.data.items || []);
      } else {
        toast.error("加载权限失败: " + response.msg);
      }
    } catch (error) {
      console.error("加载权限错误:", error);
      toast.error("加载权限出错，请稍后重试");
    }
  };

  // 使用 lodash 的 debounce 实现搜索防抖
  // eslint-disable-next-line
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      setPage(1); // 重置为第一页
      loadRoles(1, searchValue);
    }, 500),
    []
  );
  // 初始加载
  useEffect(() => {
    // 只在组件首次挂载时加载数据
    loadRoles();
    loadAllPermissions();
  }, []);

  // 搜索词变化时触发防抖搜索
  useEffect(() => {
    // 跳过首次渲染时的搜索，避免重复请求
    if (isInitialMount.current) return;
    console.log("searchTerm", searchTerm);

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
    console.log("page", page);
    loadRoles();
  }, [page]);

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // 手动搜索按钮
  const handleManualSearch = () => {
    setPage(1);
    loadRoles(1, searchTerm);
  };

  // 处理分页
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 打开添加角色对话框
  const handleAddRole = () => {
    setFormData({
      id: 0,
      name: "",
      description: "",
      permissionIds: []
    });
    setEditMode(false);
    setOpenDialog(true);
  };

  // 打开编辑角色对话框
  const handleEditRole = (role: Role) => {
    setFormData({
      id: role.id,
      name: role.name,
      description: role.description || "",
      permissionIds: role.permissions.map(p => p.id)
    });
    setEditMode(true);
    setOpenDialog(true);
  };

  // 提交表单
  const handleSubmit = async (data: typeof formData) => {
    if (!data.name) {
      toast.error("角色名称不能为空");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (editMode) {
        response = await RoleService.roleControllerUpdate({
          id: data.id,
          requestBody: {
            name: data.name,
            description: data.description,
            permissionIds: data.permissionIds
          }
        });
      } else {
        response = await RoleService.roleControllerCreate({
          requestBody: {
            name: data.name,
            description: data.description,
            permissionIds: data.permissionIds
          }
        });
      }

      if (response.code === 200) {
        toast.success(editMode ? "角色更新成功" : "角色创建成功");
        setOpenDialog(false);
        loadRoles();
      } else {
        toast.error(editMode ? "更新角色失败: " : "创建角色失败: " + response.msg);
      }
    } catch (error) {
      console.error(editMode ? "更新角色错误:" : "创建角色错误:", error);
      toast.error(editMode ? "更新角色出错，请稍后重试" : "创建角色出错，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 删除角色
  const handleDeleteRole = async (id: number) => {
    if (!confirm("确定要删除这个角色吗？")) {
      return;
    }

    setLoading(true);
    try {
      const response = await RoleService.roleControllerRemove({ id });

      if (response.code === 200) {
        toast.success("角色删除成功");
        loadRoles();
      } else {
        toast.error("删除角色失败: " + response.msg);
      }
    } catch (error) {
      console.error("删除角色错误:", error);
      toast.error("删除角色出错，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <RoleList
        roles={roles}
        loading={loading}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={page}
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onManualSearch={handleManualSearch}
        onPageChange={handlePageChange}
        onEdit={handleEditRole}
        onDelete={handleDeleteRole}
        onAdd={handleAddRole}
      />

      <RoleFormDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        editMode={editMode}
        permissions={permissions}
        initialData={formData}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </>
  );
} 