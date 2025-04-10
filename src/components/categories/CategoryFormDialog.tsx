import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface CategoryFormData {
  name: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogType: "add" | "edit";
  initialData: CategoryFormData;
  onSubmit: (data: CategoryFormData) => Promise<void>;
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  dialogType,
  initialData,
  onSubmit
}: CategoryFormDialogProps) {
  const [formData, setFormData] = useState<CategoryFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 当初始数据变化时更新表单数据
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'order') {
        return { ...prev, [name]: parseInt(value) || 0 };
      }
      return { ...prev, [name]: value };
    });
  };

  // 处理开关状态变化
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogType === "add" ? "添加分类" : "编辑分类"}</DialogTitle>
          <DialogDescription>
            {dialogType === "add"
              ? "添加一个新的课程分类，填写下列信息。"
              : "修改课程分类信息。"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">分类名称 *</Label>
            <Input
              id="name"
              name="name"
              placeholder="输入分类名称"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">分类描述</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="输入分类描述（可选）"
              value={formData.description || ""}
              onChange={handleInputChange}
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">图标</Label>
            <Input
              id="icon"
              name="icon"
              placeholder="输入图标名称或URL（可选）"
              value={formData.icon || ""}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order">排序</Label>
            <Input
              id="order"
              name="order"
              type="number"
              placeholder="数字越小排序越靠前"
              value={formData.order.toString()}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={handleSwitchChange}
              disabled={isSubmitting}
            />
            <Label htmlFor="isActive">启用分类</Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.name || isSubmitting}
          >
            {isSubmitting ? "处理中..." : dialogType === "add" ? "创建" : "保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}