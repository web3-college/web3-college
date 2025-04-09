import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { Permission } from "@/types/types";

interface RoleFormData {
  id: number;
  name: string;
  description: string;
  permissionIds: number[];
}

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editMode: boolean;
  permissions: Permission[];
  initialData: RoleFormData;
  loading: boolean;
  onSubmit: (data: RoleFormData) => Promise<void>;
}

export function RoleFormDialog({
  open,
  onOpenChange,
  editMode,
  permissions,
  initialData,
  loading,
  onSubmit
}: RoleFormDialogProps) {
  const [formData, setFormData] = useState<RoleFormData>(initialData);
  const [permissionSearchTerm, setPermissionSearchTerm] = useState<string>("");
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>(permissions);

  // 同步初始数据
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // 同步权限列表
  useEffect(() => {
    setFilteredPermissions(permissions);
  }, [permissions]);

  // 权限搜索逻辑
  useEffect(() => {
    if (permissionSearchTerm.trim() === "") {
      setFilteredPermissions(permissions);
    } else {
      const term = permissionSearchTerm.toLowerCase();
      const filtered = permissions.filter(
        (permission) =>
          permission.name.toLowerCase().includes(term) ||
          permission.action.toLowerCase().includes(term) ||
          (permission.description && permission.description.toLowerCase().includes(term))
      );
      setFilteredPermissions(filtered);
    }
  }, [permissionSearchTerm, permissions]);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理权限选择
  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          permissionIds: [...prev.permissionIds, permissionId]
        };
      } else {
        return {
          ...prev,
          permissionIds: prev.permissionIds.filter(id => id !== permissionId)
        };
      }
    });
  };

  // 处理表单提交
  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editMode ? "编辑角色" : "添加角色"}</DialogTitle>
          <DialogDescription>
            {editMode
              ? "修改角色信息和分配权限"
              : "创建一个新角色并分配权限"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              角色名称
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="输入角色名称"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              描述
            </Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="输入角色描述"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Label className="text-right pt-2">
              权限
            </Label>
            <div className="col-span-3 border rounded-md p-4 max-h-[300px] overflow-hidden flex flex-col">
              <div className="pb-2 mb-2 border-b">
                <div className="flex items-center">
                  <Search className="h-4 w-4 mr-2 opacity-50" />
                  <Input
                    placeholder="搜索权限..."
                    value={permissionSearchTerm}
                    onChange={(e) => setPermissionSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="overflow-y-auto">
                <div className="grid grid-cols-1 gap-3">
                  {filteredPermissions.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">没有找到匹配的权限</div>
                  ) : (
                    filteredPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={formData.permissionIds.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked === true)}
                        />
                        <Label htmlFor={`permission-${permission.id}`} className="flex-1">
                          <div>{permission.name}</div>
                          <div className="text-xs text-muted-foreground">{permission.description}</div>
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={loading} onClick={handleSubmit}>
            {loading ? "处理中..." : editMode ? "更新角色" : "创建角色"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 