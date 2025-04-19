"use client";

import { ReactNode } from "react";

interface CertificatesLayoutProps {
  children: ReactNode;
}

export default function CertificatesLayout({ children }: CertificatesLayoutProps) {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* 页面头部 */}
        <div className="flex items-center mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">证书管理</h1>
            <p className="text-foreground/40">
              管理学员证书申请，包括审批、拒绝证书请求。
            </p>
          </div>
        </div>

        {/* 主内容 */}
        {children}
      </div>
    </div>
  );
} 