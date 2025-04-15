"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, ExternalLink, Code } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";

interface Certificate {
  id: number;
  courseId: number;
  courseName: string;
  issueDate: string;
  tokenId: string;
  imageUrl: string;
  metadataURI?: string;
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
  const [selectedMetadata, setSelectedMetadata] = useState<string | null>(null);
  const [metadataContent, setMetadataContent] = useState<any | null>(null);
  const [isMetadataLoading, setIsMetadataLoading] = useState(false);

  // 查看元数据
  const handleViewMetadata = async (uri: string | undefined) => {
    if (!uri) return;

    try {
      setIsMetadataLoading(true);
      setSelectedMetadata(uri);

      // 尝试获取元数据内容
      // 对于IPFS URI (ipfs://), 我们需要使用HTTP网关
      let fetchUrl = uri;

      if (uri.startsWith('ipfs://')) {
        // 转换IPFS URI为HTTP网关URL
        const cid = uri.replace('ipfs://', '');
        fetchUrl = `https://ipfs.io/ipfs/${cid}`;
      }

      // 占位数据（如果无法获取真实数据）
      const placeholderData = {
        name: "Web3学院证书",
        description: "本证书证明持有者已成功完成相关课程的学习",
        image: "https://via.placeholder.com/300x200?text=Certificate",
        attributes: [
          { trait_type: "课程编号", value: "WEB3-101" },
          { trait_type: "完成日期", value: new Date().toISOString().split('T')[0] },
          { trait_type: "技能", value: "区块链开发" }
        ]
      };

      try {
        // const response = await fetch(fetchUrl);
        // if (response.ok) {
        //   const data = await response.json();
        //   setMetadataContent(data);
        // } else {
        // 如果无法获取，使用占位数据
        setMetadataContent(placeholderData);
        // }
      } catch (error) {
        console.error("获取元数据失败:", error);
        setMetadataContent(placeholderData);
      }
    } finally {
      setIsMetadataLoading(false);
    }
  };

  if (certificates.length === 0) {
    return <EmptyCertificatesList />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map(cert => (
          <Card key={cert.id} className="border border-white/[0.05] bg-gradient-to-br from-background/80 to-background/40 hover:border-purple-500/20 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/5 group">
            <div className="aspect-[4/3] overflow-hidden relative">
              <img
                src={cert.imageUrl}
                alt={`${cert.courseName} 证书`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-300" />
                  <span className="text-sm font-medium">Token ID: {cert.tokenId}</span>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{cert.courseName}</h3>
                <div className="bg-green-500/10 text-green-500 text-xs py-1 px-2 rounded-full border border-green-500/20">已认证</div>
              </div>
              <p className="text-foreground/40 text-sm mb-4 flex items-center">
                <span className="mr-1">发行日期:</span>
                <span className="font-medium text-foreground/60">
                  {new Date(cert.issueDate).toLocaleDateString('zh-CN')}
                </span>
              </p>
              <div className="flex items-center gap-2">
                {cert.metadataURI && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewMetadata(cert.metadataURI)}
                    className="w-[80px] border-purple-500/20 hover:bg-purple-500/10"
                  >
                    <Code className="h-4 w-4 mr-1" />
                    元数据
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 元数据对话框 */}
      <Dialog open={!!selectedMetadata} onOpenChange={(open) => !open && setSelectedMetadata(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Code className="h-5 w-5 mr-2 text-purple-500" />
              区块链证书元数据
            </DialogTitle>
            <DialogDescription>
              NFT证书元数据遵循ERC-721元数据标准，包含证书的属性、图片和描述信息
            </DialogDescription>
          </DialogHeader>

          {isMetadataLoading ? (
            <div className="p-8 flex justify-center">
              <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : metadataContent ? (
            <div className="space-y-4">
              {/* 元数据源URI */}
              <div className="p-3 rounded-md bg-foreground/5 border border-white/5 text-xs font-mono break-all">
                <div className="text-xs text-purple-400 mb-1">URI来源</div>
                {selectedMetadata}
                {selectedMetadata?.startsWith('ipfs://') && (
                  <a
                    href={`https://ipfs.io/ipfs/${selectedMetadata.replace('ipfs://', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 flex items-center gap-1 mt-2 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    在IPFS网关查看
                  </a>
                )}
              </div>

              {/* 元数据内容 */}
              <div>
                <div className="text-sm font-medium mb-2 text-purple-400">JSON元数据</div>
                <div className="rounded-md bg-foreground/5 border border-white/5 p-4">
                  <pre className="text-xs font-mono whitespace-pre-wrap overflow-auto max-h-[300px]">
                    {JSON.stringify(metadataContent, null, 2)}
                  </pre>
                </div>
              </div>

              {/* 元数据属性 */}
              {metadataContent.attributes && metadataContent.attributes.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-medium mb-2 text-purple-400">证书属性</div>
                  <div className="grid grid-cols-2 gap-3">
                    {metadataContent.attributes.map((attr: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-md bg-foreground/5 border border-white/5 hover:border-purple-500/20 transition-all duration-300">
                        <div className="text-xs text-foreground/60 mb-1">{attr.trait_type}</div>
                        <div className="font-medium">{attr.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <DialogClose asChild>
                <Button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-md hover:shadow-lg border-0">
                  关闭
                </Button>
              </DialogClose>
            </div>
          ) : (
            <div className="text-center py-8 text-foreground/60">
              <div className="mb-2 text-red-400">无法加载元数据内容</div>
              <p className="text-sm">元数据可能尚未在IPFS上可用或者URI格式不正确</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
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