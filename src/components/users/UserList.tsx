"use client";

import { User, Role } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, Plus, Loader2, Edit, Trash2, UserCog, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

interface UserListProps {
  users: User[];
  loading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  searchTerm: string;
  onSearch: (value: string) => void;
  onManualSearch: () => void;
  onPageChange: (page: number) => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onEditRoles: (user: User) => void;
}

export function UserList({
  users,
  loading,
  totalItems,
  totalPages,
  currentPage,
  searchTerm,
  onSearch,
  onManualSearch,
  onPageChange,
  onEdit,
  onDelete,
  onEditRoles,
}: UserListProps) {
  // 用于跟踪复制状态
  const [copiedAddressId, setCopiedAddressId] = useState<number | null>(null);

  // 复制钱包地址到剪贴板
  const copyAddressToClipboard = (address: string, userId: number) => {
    navigator.clipboard.writeText(address).then(() => {
      setCopiedAddressId(userId);
      toast.success("已复制钱包地址");
      setTimeout(() => setCopiedAddressId(null), 2000);
    });
  };

  // 处理状态的不同样式
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">活跃</Badge>;
      case "inactive":
        return <Badge className="bg-yellow-500">未激活</Badge>;
      case "banned":
        return <Badge className="bg-red-500">已禁用</Badge>;
      default:
        return <Badge className="bg-gray-500">未知</Badge>;
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* 搜索部分 */}
      <div className="flex items-center">
        <div className="flex items-center w-1/3">
          <div className="relative flex items-center w-full">
            <Input
              placeholder="搜索钱包地址..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full max-w-sm"
            />
            <Button
              onClick={onManualSearch}
              variant="secondary"
              size="sm"
              className="ml-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "搜索"}
            </Button>
          </div>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>用户名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>钱包地址</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="w-[150px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    加载中...
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.avatar && (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="h-8 w-8 rounded-full"
                        />
                      )}
                      <span className="font-medium">{user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.address ? (
                      <div className="flex items-center">
                        <span className="font-mono text-xs cursor-pointer hover:text-blue-600" title={user.address}>
                          {user.address.substring(0, 6)}...
                          {user.address.substring(user.address.length - 4)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-1"
                          onClick={() => copyAddressToClipboard(user.address!, user.id)}
                        >
                          {copiedAddressId === user.id ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <span key={role.id} className="bg-muted text-xs px-2 py-1 rounded-md">
                            {role.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">无角色</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("zh-CN")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditRoles(user)}
                      >
                        <UserCog className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(user.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      {!loading && totalPages > 1 && (
        <DataTablePagination
          currentPage={currentPage}
          totalItems={totalItems}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
} 