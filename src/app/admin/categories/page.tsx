"use client";

import { useState, useEffect } from "react";
import { CategoryService } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreVertical, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { CreateCategoryDto, UpdateCategoryDto } from "@/api";
import { Textarea } from "@/components/ui/textarea";

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
  // 状态管理
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  // 新分类表单状态
  const [newCategory, setNewCategory] = useState<CreateCategoryDto>({
    name: "",
    description: "",
    icon: "",
    order: 0,
    isActive: true,
  });

  // 编辑分类表单状态
  const [editCategory, setEditCategory] = useState<UpdateCategoryDto>({
    name: "",
    description: "",
    icon: "",
    order: 0,
    isActive: true,
  });

  // 获取分类列表
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await CategoryService.categoryControllerFindAllCategories({});
      if (response && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("获取分类列表失败:", error);
      toast.error("获取分类列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取分类列表
  useEffect(() => {
    fetchCategories();
  }, []);

  // 搜索过滤
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 添加分类
  const handleAddCategory = async () => {
    try {
      const response = await CategoryService.categoryControllerCreateCategory({
        requestBody: newCategory,
      });

      if (response) {
        toast.success("分类添加成功");
        fetchCategories();
        setShowAddDialog(false);
        resetNewCategory();
      }
    } catch (error) {
      console.error("添加分类失败:", error);
      toast.error("添加分类失败");
    }
  };

  // 更新分类
  const handleUpdateCategory = async () => {
    if (!currentCategory) return;

    try {
      const response = await CategoryService.categoryControllerUpdateCategory({
        id: currentCategory.id,
        requestBody: editCategory,
      });

      if (response) {
        toast.success("分类更新成功");
        fetchCategories();
        setShowEditDialog(false);
      }
    } catch (error) {
      console.error("更新分类失败:", error);
      toast.error("更新分类失败");
    }
  };

  // 删除分类
  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("确定要删除这个分类吗？删除后无法恢复。")) {
      return;
    }

    try {
      const response = await CategoryService.categoryControllerDeleteCategory({
        id,
      });

      if (response) {
        toast.success("分类删除成功");
        fetchCategories();
      }
    } catch (error) {
      console.error("删除分类失败:", error);
      toast.error("删除分类失败");
    }
  };

  // 打开编辑对话框
  const openEditDialog = (category: Category) => {
    setCurrentCategory(category);
    setEditCategory({
      name: category.name,
      description: category.description,
      icon: category.icon,
      order: category.order,
      isActive: category.isActive,
    });
    setShowEditDialog(true);
  };

  // 重置新分类表单
  const resetNewCategory = () => {
    setNewCategory({
      name: "",
      description: "",
      icon: "",
      order: 0,
      isActive: true,
    });
  };

  return (
    <div className="p-6">
      {/* 标题和操作栏 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">课程分类</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索分类..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                添加分类
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加新分类</DialogTitle>
                <DialogDescription>
                  添加一个新的课程分类，填写下列信息。
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">分类名称 *</Label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="输入分类名称"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">分类描述</Label>
                  <Textarea
                    id="description"
                    value={newCategory.description || ""}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="输入分类描述（可选）"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="icon">图标</Label>
                  <Input
                    id="icon"
                    value={newCategory.icon || ""}
                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                    placeholder="输入图标名称或URL（可选）"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="order">排序</Label>
                  <Input
                    id="order"
                    type="number"
                    value={newCategory.order?.toString() || "0"}
                    onChange={(e) => setNewCategory({ ...newCategory, order: parseInt(e.target.value) })}
                    placeholder="数字越小排序越靠前"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={newCategory.isActive}
                    onCheckedChange={(checked: boolean) => setNewCategory({ ...newCategory, isActive: checked })}
                  />
                  <Label htmlFor="isActive">启用分类</Label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>取消</Button>
                <Button onClick={handleAddCategory} disabled={!newCategory.name}>添加分类</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 分类列表 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>名称</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>排序</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">加载中...</div>
                </TableCell>
              </TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <div className="text-muted-foreground">
                    {searchQuery ? "没有找到匹配的分类" : "暂无分类数据"}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{category.description || "-"}</TableCell>
                  <TableCell>{category.order}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                      }`}>
                      {category.isActive ? "启用" : "禁用"}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(category.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">打开菜单</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>操作</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEditDialog(category)}>
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)} className="text-red-600">
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

      {/* 编辑分类对话框 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑分类</DialogTitle>
            <DialogDescription>
              修改分类信息，所有字段都是可选的。
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">分类名称</Label>
              <Input
                id="edit-name"
                value={editCategory.name || ""}
                onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                placeholder="输入分类名称"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">分类描述</Label>
              <Textarea
                id="edit-description"
                value={editCategory.description || ""}
                onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                placeholder="输入分类描述（可选）"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-icon">图标</Label>
              <Input
                id="edit-icon"
                value={editCategory.icon || ""}
                onChange={(e) => setEditCategory({ ...editCategory, icon: e.target.value })}
                placeholder="输入图标名称或URL（可选）"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-order">排序</Label>
              <Input
                id="edit-order"
                type="number"
                value={editCategory.order?.toString() || "0"}
                onChange={(e) => setEditCategory({ ...editCategory, order: parseInt(e.target.value) })}
                placeholder="数字越小排序越靠前"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={editCategory.isActive}
                onCheckedChange={(checked: boolean) => setEditCategory({ ...editCategory, isActive: checked })}
              />
              <Label htmlFor="edit-isActive">启用分类</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>取消</Button>
            <Button onClick={handleUpdateCategory}>保存更改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 