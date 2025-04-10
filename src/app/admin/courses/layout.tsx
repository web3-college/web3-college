"use client";

import { ReactNode } from "react";

interface CoursesLayoutProps {
  children: ReactNode;
}

export default function CoursesLayout({ children }: CoursesLayoutProps) {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* 页面头部 */}
        <div className="flex items-center mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">课程管理</h1>
            <p className="text-foreground/40">
              管理Web3学院课程，包括添加、编辑和上架课程。
            </p>
          </div>
        </div>

        {/* 主内容 */}
        {children}
      </div>
    </div>
  );
} 