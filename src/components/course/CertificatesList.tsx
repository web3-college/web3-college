"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Certificate {
  id: number;
  courseId: number;
  courseName: string;
  issueDate: string;
  tokenId: string;
  imageUrl: string;
}

interface CertificatesListProps {
  certificates: Certificate[];
  isLoading: boolean;
}

// 证书骨架屏组件
function CertificatesSkeletons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(2)].map((_, index) => (
        <div key={index} className="border border-white/[0.05] rounded-xl overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-6 space-y-3">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 空证书列表状态
function EmptyCertificatesList() {
  return (
    <div className="text-center py-10 border border-dashed border-foreground/10 rounded-lg">
      <Award className="h-10 w-10 mx-auto mb-4 text-foreground/30" />
      <h3 className="text-lg font-medium mb-2">暂无证书</h3>
      <p className="text-foreground/40 mb-6">完成课程并通过考核即可获得区块链证书</p>
      <Button asChild>
        <Link href="/market">浏览课程</Link>
      </Button>
    </div>
  );
}

// 证书列表内容
function CertificatesContent({ certificates }: { certificates: Certificate[] }) {
  if (certificates.length === 0) {
    return <EmptyCertificatesList />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {certificates.map(cert => (
        <Card key={cert.id} className="border border-white/[0.05] bg-gradient-to-br from-background/80 to-background/40 hover:border-purple-500/20 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/5">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={cert.imageUrl}
              alt={`${cert.courseName} 证书`}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">{cert.courseName}</h3>
            <p className="text-foreground/40 text-sm mb-4">
              发行日期: {new Date(cert.issueDate).toLocaleDateString('zh-CN')}
            </p>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                查看证书
              </Button>
              <Button size="sm" variant="outline">
                分享
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function CertificatesList({ certificates, isLoading }: CertificatesListProps) {
  if (isLoading) {
    return <CertificatesSkeletons />;
  }

  return (
    <CertificatesContent certificates={certificates} />
  );
} 