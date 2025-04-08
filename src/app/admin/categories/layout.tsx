import { ReactNode } from "react";

interface CategoriesLayoutProps {
  children: ReactNode;
}

export default function CategoriesLayout({ children }: CategoriesLayoutProps) {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* 页面头部 */}
        <div className="flex items-center mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">课程分类</h1>
            <p className="text-foreground/40">
              管理课程分类，包括添加、编辑和删除分类。
            </p>
          </div>
        </div>

        {/* 主内容 */}
        {children}
      </div>
    </div>
  );
} 