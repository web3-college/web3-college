"use client";

import { useState, useEffect } from "react";
import { User, Role } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserRolesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  roles: Role[];
  loading: boolean;
  onSubmit: (userId: number, roleIds: number[]) => void;
}

export function UserRolesDialog({
  open,
  onOpenChange,
  user,
  roles,
  loading,
  onSubmit,
}: UserRolesDialogProps) {
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  // 当用户数据变化时，更新选中的角色
  useEffect(() => {
    if (user && open) {
      setSelectedRoles(user.roles.map(role => role.id));
    }
  }, [user, open]);

  // 处理角色选择变化
  const handleRoleChange = (roleId: number, checked: boolean) => {
    if (checked) {
      setSelectedRoles(prev => [...prev, roleId]);
    } else {
      setSelectedRoles(prev => prev.filter(id => id !== roleId));
    }
  };

  // 表单提交
  const handleSubmit = () => {
    if (user) {
      onSubmit(user.id, selectedRoles);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>修改用户角色</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <p>
              用户：<strong>{user.username}</strong> ({user.email})
            </p>
          </div>
          <div className="mb-4">
            <Label className="mb-2 block">选择角色：</Label>
            <ScrollArea className="h-[200px] border rounded-md p-4">
              <div className="space-y-2">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={selectedRoles.includes(role.id)}
                      onCheckedChange={(checked) =>
                        handleRoleChange(role.id, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`role-${role.id}`}
                      className="cursor-pointer"
                    >
                      {role.name} {role.description && `(${role.description})`}
                    </Label>
                  </div>
                ))}
                {roles.length === 0 && (
                  <p className="text-sm text-gray-500">没有可用的角色</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            取消
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                处理中...
              </>
            ) : (
              "保存"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 