"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CoursesLayoutProps {
  children: ReactNode;
}

export default function CoursesLayout({ children }: CoursesLayoutProps) {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* 页面头部 */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">课程管理</h1>
            <p className="text-foreground/40">
              管理Web3学院课程，包括添加、编辑和上架课程。
            </p>
          </div>
          <Link href="/admin/courses/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" /> 新建课程
            </Button>
          </Link>
        </div>

        {/* 主内容 */}
        {children}
      </div>
    </div>
  );
} 