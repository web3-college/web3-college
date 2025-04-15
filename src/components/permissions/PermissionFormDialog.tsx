import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface PermissionFormData {
  name: string;
  action: string;
  description: string;
}

interface PermissionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogType: "add" | "edit";
  initialData: PermissionFormData;
  onSubmit: (data: PermissionFormData) => Promise<void>;
}

export function PermissionFormDialog({
  open,
  onOpenChange,
  dialogType,
  initialData,
  onSubmit
}: PermissionFormDialogProps) {
  const [formData, setFormData] = useState<PermissionFormData>(initialData);

  // 当初始数据变化时更新表单数据
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理表单提交
  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogType === "add" ? "添加权限" : "编辑权限"}</DialogTitle>
          <DialogDescription>
            {dialogType === "add"
              ? "创建一个新的系统权限。权限操作标识应该是唯一的。"
              : "修改现有权限的详细信息。"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              权限名称
            </label>
            <Input
              id="name"
              name="name"
              placeholder="例如：user:read"
              value={formData.name}
              onChange={handleInputChange}
            />
            <p className="text-sm text-muted-foreground">
              推荐格式: 资源:操作, 如: user:create, course:update
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="action" className="text-sm font-medium">
              操作标识
            </label>
            <Input
              id="action"
              name="action"
              placeholder="例如：read"
              value={formData.action}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              描述
            </label>
            <Input
              id="description"
              name="description"
              placeholder="权限的详细描述"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>
            {dialogType === "add" ? "创建" : "保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 