"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { UsersService } from "@/api/services/UsersService";
import { RoleService } from "@/api/services/RoleService";
import { toast } from "sonner";
import { UserList } from "@/components/users/UserList";
import { UserFormDialog } from "@/components/users/UserFormDialog";
import { UserRolesDialog } from "@/components/users/UserRolesDialog";
import { Role, User } from "@/types/types";
import debounce from "lodash/debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// 定义API返回的用户数据类型
interface UserResponseDto {
  id: number;
  address?: string;
  name?: any;
  email?: any;
  avatar?: any;
  bio?: any;
  createdAt: any;
  roles: Array<any>;
}

// 用户表单数据类型
interface UserFormData {
  id: number;
  username: string;
  email: string;
  status: 'active' | 'inactive' | 'banned';
  password?: string;
}

export default function UsersPage() {
  // 初始加载标记
  const isInitialMount = useRef(true);

  // 用户数据状态
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  // 用户表单对话框状态
  const [userFormOpen, setUserFormOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserFormData>({
    id: 0,
    username: "",
    email: "",
    status: "active",
  });

  // 角色分配对话框状态
  const [roleDialogOpen, setRoleDialogOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserResponseDto | null>(null);

  // 删除确认对话框状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // 加载用户数据
  const loadUsers = async (currentPage = page, searchQuery = searchTerm) => {
    setLoading(true);
    try {
      const response = await UsersService.usersControllerFindAll({
        page: currentPage,
        pageSize: 10,
        address: searchQuery || undefined
      });

      // 检查响应是否成功
      if (response.code === 200 && response.data) {
        const userData = response.data as {
          items: UserResponseDto[];
          total: number;
          page: number;
          pageSize: number;
        };

        setUsers(userData.items || []);
        setTotalPages(Math.ceil(userData.total / userData.pageSize));
        setTotalItems(userData.total);
      } else {
        toast.error("加载用户列表失败: " + response.msg);
      }
    } catch (error) {
      console.error("加载用户错误:", error);
      toast.error("加载用户出错，请稍后重试");
    } finally {
      isInitialMount.current = false;
      setLoading(false);
    }
  };

  // 加载所有角色
  const loadAllRoles = async () => {
    try {
      const response = await RoleService.roleControllerFindAll({
        page: 1,
        pageSize: 100
      });

      if (response.code === 200 && response.data) {
        setRoles(response.data.items || []);
      } else {
        toast.error("加载角色失败: " + response.msg);
      }
    } catch (error) {
      console.error("加载角色错误:", error);
      toast.error("加载角色出错，请稍后重试");
    }
  };

  // 使用 lodash 的 debounce 实现搜索防抖
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      setPage(1); // 重置为第一页
      loadUsers(1, searchValue);
    }, 500),
    []
  );

  // 初始加载
  useEffect(() => {
    loadUsers();
    loadAllRoles();
  }, []);

  // 搜索词变化时触发防抖搜索
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

    loadUsers();
  }, [page]);

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // 手动搜索按钮
  const handleManualSearch = () => {
    setPage(1);
    loadUsers(1, searchTerm);
  };

  // 处理分页
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 打开编辑用户对话框
  const handleEditUser = (user: UserResponseDto | User) => {
    // 检查是User类型还是UserResponseDto类型
    const name = 'username' in user ? user.username : (user.name?.toString() || "");
    const email = 'email' in user && typeof user.email === 'string' ? user.email : (user.email?.toString() || "");

    setFormData({
      id: user.id,
      username: name,
      email: email,
      status: "active", // 假设API返回的用户没有状态字段，默认设置为active
    });
    setEditMode(true);
    setUserFormOpen(true);
  };

  // 打开编辑角色对话框
  const handleEditRoles = (user: UserResponseDto | User) => {
    if ('username' in user) {
      // 已经是转换后的User类型
      const userDto = users.find(u => u.id === user.id);
      if (userDto) {
        setSelectedUser(userDto);
      }
    } else {
      // 直接是UserResponseDto类型
      setSelectedUser(user);
    }
    setRoleDialogOpen(true);
  };

  // 提交用户表单
  const handleSubmitUser = async (data: UserFormData) => {
    if (!data.username || !data.email) {
      toast.error("用户名和邮箱不能为空");
      return;
    }

    setLoading(true);
    try {
      const response = await UsersService.usersControllerUpdate({
        id: String(data.id),
        requestBody: {
          name: data.username,
          email: data.email,
          // 新API可能需要其他字段
        },
      });

      toast.success("用户更新成功");
      setUserFormOpen(false);
      loadUsers();
    } catch (error) {
      console.error("更新用户错误:", error);
      toast.error("更新用户出错，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 提交角色修改
  const handleSubmitRoles = async (userId: number, roleIds: number[]) => {
    setLoading(true);
    try {
      const response = await UsersService.usersControllerUpdateRoles({
        id: String(userId),
        requestBody: {
          roleIds,
        },
      });

      toast.success("用户角色更新成功");
      setRoleDialogOpen(false);
      loadUsers();
    } catch (error) {
      console.error("更新用户角色错误:", error);
      toast.error("更新用户角色出错，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 确认删除用户
  const confirmDeleteUser = (id: number) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  // 删除用户
  const handleDeleteUser = async (id: number) => {
    setLoading(true);
    try {
      await UsersService.usersControllerRemove({
        id: String(id),
      });

      toast.success("用户删除成功");
      loadUsers();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("删除用户错误:", error);
      toast.error("删除用户出错，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 将UserResponseDto转换为给组件使用的用户模型
  const mapUsersForDisplay = (users: UserResponseDto[]): User[] => {
    return users.map(user => ({
      id: user.id,
      username: String(user.name || ""),
      email: String(user.email || ""),
      address: user.address,
      avatar: user.avatar ? String(user.avatar) : undefined,
      roles: user.roles.map((r: any) => ({
        id: Number(r.id),
        name: String(r.name),
        description: r.description ? String(r.description) : undefined,
        permissions: []
      })),
      createdAt: user.createdAt
    }));
  };

  return (
    <>
      <UserList
        users={mapUsersForDisplay(users)}
        loading={loading}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={page}
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onManualSearch={handleManualSearch}
        onPageChange={handlePageChange}
        onEdit={handleEditUser as (user: User) => void}
        onDelete={confirmDeleteUser}
        onEditRoles={handleEditRoles as (user: User) => void}
      />

      <UserFormDialog
        open={userFormOpen}
        onOpenChange={setUserFormOpen}
        editMode={editMode}
        initialData={formData}
        loading={loading}
        onSubmit={handleSubmitUser}
      />

      <UserRolesDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        user={selectedUser ? mapUsersForDisplay([selectedUser])[0] : null}
        roles={roles}
        loading={loading}
        onSubmit={handleSubmitRoles}
      />

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除这个用户吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={() => userToDelete && handleDeleteUser(userToDelete)}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  删除中...
                </div>
              ) : (
                "确认删除"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 