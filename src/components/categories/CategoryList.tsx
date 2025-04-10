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
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreVertical, Pencil, Trash2, Loader2 } from "lucide-react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

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

interface CategoryListProps {
  categories: Category[];
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
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
}

export function CategoryList({
  categories,
  isLoading,
  pagination,
  searchTerm,
  onSearchChange,
  onSearch,
  onAddNew,
  onEdit,
  onDelete,
  onPageChange
}: CategoryListProps) {
  return (
    <div className="space-y-6">
      {/* 搜索和添加按钮 */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex w-full sm:w-auto space-x-2">
          <Input
            placeholder="搜索分类名称..."
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
          添加分类
        </Button>
      </div>

      {/* 分类列表 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="w-[200px]">分类名称</TableHead>
              <TableHead className="hidden md:table-cell">描述</TableHead>
              <TableHead className="hidden md:table-cell w-[100px]">排序</TableHead>
              <TableHead className="w-[100px]">状态</TableHead>
              <TableHead className="hidden md:table-cell">创建时间</TableHead>
              <TableHead className="w-[100px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    加载中...
                  </div>
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  未找到分类记录
                </TableCell>
              </TableRow>
            ) : (
              categories.map(category => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-xs truncate">
                    {category.description || "-"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {category.order}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400"
                      }`}>
                      {category.isActive ? "启用" : "禁用"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(category.createdAt).toLocaleString()}
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
                        <DropdownMenuLabel>操作</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(category)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(category.id)}
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
      {!isLoading && categories.length > 0 && (
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