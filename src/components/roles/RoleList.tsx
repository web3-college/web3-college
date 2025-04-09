import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Search, Edit, Trash2, PlusCircle, Loader2 } from "lucide-react";
import { Role, Permission } from "@/types/types";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

interface RoleListProps {
  roles: Role[];
  loading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  searchTerm: string;
  onSearch: (value: string) => void;
  onManualSearch: () => void;
  onPageChange: (page: number) => void;
  onEdit: (role: Role) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export function RoleList({
  roles,
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
  onAdd
}: RoleListProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* 搜索和添加 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center w-1/3">
          <div className="relative flex items-center w-full">
            <Input
              placeholder="搜索角色名称..."
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
        <Button onClick={onAdd}>
          <PlusCircle className="mr-2 h-4 w-4" /> 添加角色
        </Button>
      </div>

      {/* 角色列表 */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>角色名称</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>拥有权限</TableHead>
              <TableHead className="w-[150px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    加载中...
                  </div>
                </TableCell>
              </TableRow>
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.length > 0 ?
                        role.permissions.map((permission: Permission) => (
                          <span key={permission.id} className="bg-muted text-xs px-2 py-1 rounded-md">
                            {permission.name}
                          </span>
                        )) : "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(role)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(role.id)}
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