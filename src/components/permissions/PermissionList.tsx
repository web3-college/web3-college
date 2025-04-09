import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, Plus, Search, MoreVertical, Pencil, Trash2, Loader2 } from "lucide-react";
import { Permission } from "@/types/types";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

interface PermissionListProps {
  permissions: Permission[];
  isLoading: boolean;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearch: () => void;
  onAddNew: () => void;
  onEdit: (permission: Permission) => void;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
}

export function PermissionList({
  permissions,
  isLoading,
  pagination,
  searchTerm,
  onSearchChange,
  onSearch,
  onAddNew,
  onEdit,
  onDelete,
  onPageChange
}: PermissionListProps) {
  return (
    <div className="space-y-6">
      {/* 搜索和添加按钮 */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex w-full sm:w-auto space-x-2">
          <Input
            placeholder="搜索权限名称或操作 (action:read)"
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
        <Button onClick={onAddNew} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          添加权限
        </Button>
      </div>

      {/* 权限列表 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="w-[200px]">权限名称</TableHead>
              <TableHead>操作标识</TableHead>
              <TableHead className="hidden md:table-cell">描述</TableHead>
              <TableHead className="w-[100px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    加载中...
                  </div>
                </TableCell>
              </TableRow>
            ) : permissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  未找到权限记录
                </TableCell>
              </TableRow>
            ) : (
              permissions.map(permission => (
                <TableRow key={permission.id}>
                  <TableCell>{permission.id}</TableCell>
                  <TableCell className="font-medium">{permission.name}</TableCell>
                  <TableCell>
                    <code className="bg-secondary/30 p-1 rounded text-sm">{permission.action}</code>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {permission.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">操作菜单</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(permission)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(permission.id)}
                          className="text-red-600 focus:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分页控制 */}
      {!isLoading && permissions.length > 0 && (
        <DataTablePagination
          currentPage={pagination.page}
          pageSize={pagination.pageSize}
          totalItems={pagination.total}
          totalPages={Math.ceil(pagination.total / pagination.pageSize)}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
} 