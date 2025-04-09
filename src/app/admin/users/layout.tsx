import { ReactNode } from "react";

interface UsersLayoutProps {
  children: ReactNode;
}

export default function UsersLayout({ children }: UsersLayoutProps) {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* 页面头部 */}
        <div className="flex items-center mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">用户管理</h1>
            <p className="text-foreground/40">
              管理系统用户，包括查看、添加、编辑、删除用户，以及分配角色权限。
            </p>
          </div>
        </div>

        {/* 主内容 */}
        {children}
      </div>
    </div>
  );
} 