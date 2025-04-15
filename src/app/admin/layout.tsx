"use client"

import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Book,
  LayoutDashboard,
  Users,
  BadgeDollarSign,
  FileText,
  FileCode,
  Settings,
  LogOut,
  Shield,
  UserCog,
  Award,
} from "lucide-react";
import { ConnectKitButton, useSIWE } from "connectkit";
import { redirect } from "next/navigation";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isSignedIn } = useSIWE()
  if (!isSignedIn) {
    redirect("/")
  }
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* 侧边栏 */}
      <aside className="w-64 border-r border-white/[0.05] bg-background/95">
        <div className="h-full flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold flex items-center">
              <FileCode className="h-6 w-6 mr-2 text-primary" />
              管理后台
            </h1>
          </div>
          <div className="px-4">
            <ConnectKitButton />
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <Link href="/admin">
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="h-4 w-4 mr-3" />
                控制面板
              </Button>
            </Link>

            <Link href="/admin/courses">
              <Button variant="ghost" className="w-full justify-start">
                <Book className="h-4 w-4 mr-3" />
                课程管理
              </Button>
            </Link>

            <Link href="/admin/categories">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-3" />
                分类管理
              </Button>
            </Link>

            <Link href="/admin/users">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="h-4 w-4 mr-3" />
                用户管理
              </Button>
            </Link>

            <Link href="/admin/transactions">
              <Button variant="ghost" className="w-full justify-start">
                <BadgeDollarSign className="h-4 w-4 mr-3" />
                交易记录
              </Button>
            </Link>

            <Link href="/admin/certificates">
              <Button variant="ghost" className="w-full justify-start">
                <Award className="h-4 w-4 mr-3" />
                证书管理
              </Button>
            </Link>

            {/* 权限管理导航 */}
            <div className="pt-4 border-t border-white/[0.05] mt-4">
              <h3 className="px-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-2">
                系统管理
              </h3>

              <Link href="/admin/roles">
                <Button variant="ghost" className="w-full justify-start">
                  <UserCog className="h-4 w-4 mr-3" />
                  角色与权限
                </Button>
              </Link>

              <Link href="/admin/permissions">
                <Button variant="ghost" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-3" />
                  权限配置
                </Button>
              </Link>
            </div>

            <Link href="/admin/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-3" />
                系统设置
              </Button>
            </Link>
          </nav>

          <div className="p-4 border-t border-white/[0.05]">
            <Link href="/">
              <Button variant="outline" className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                返回前台
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto">
        {/* 内容 */}
        <div>
          {children}
        </div>
      </main>
    </div>
  );
}