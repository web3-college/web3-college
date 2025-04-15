"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Search, RefreshCw, Clock, FileCheck, FileBadge, Award, Loader2 } from "lucide-react";
import { CertificateStatus } from "@/types";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useCallback } from "react";

interface CertificateRequest {
  id: number;
  userId: number;
  courseId: number;
  address: string;
  createdAt: string;
  updatedAt: string;
  status: CertificateStatus;
  notes?: string;
}

interface CertificateListProps {
  certificates: CertificateRequest[];
  isLoading: boolean;
  statusFilter: string;
  searchTerm: string;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onStatusFilterChange: (value: string) => void;
  onReview: (id: number, approved: boolean) => void;
  onPageChange: (page: number) => void;
  isProcessing: { [key: number]: boolean };
}

export function CertificateList({
  certificates,
  isLoading,
  statusFilter,
  searchTerm,
  pagination,
  onSearchChange,
  onSearch,
  onStatusFilterChange,
  onReview,
  onPageChange,
  isProcessing
}: CertificateListProps) {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  // 格式化日期显示
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 获取状态标签
  const getStatusBadge = useCallback((status: CertificateStatus) => {
    switch (status) {
      case CertificateStatus.PENDING:
        return (
          <span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
            <Clock className="h-3 w-3 mr-1" />
            审核中
          </span>
        );
      case CertificateStatus.APPROVED:
        return (
          <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            <FileCheck className="h-3 w-3 mr-1" />
            已批准
          </span>
        );
      case CertificateStatus.REJECTED:
        return (
          <span className="inline-flex items-center bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
            <X className="h-3 w-3 mr-1" />
            已拒绝
          </span>
        );
      case CertificateStatus.ISSUED:
        return (
          <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            <FileBadge className="h-3 w-3 mr-1" />
            已颁发
          </span>
        );
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* 搜索和筛选区域 */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex w-full sm:w-auto space-x-2">
          <Input
            placeholder="搜索用户地址"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-80"
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
          <Button
            onClick={onSearch}
            variant="secondary"
            size="sm"
            className="ml-2"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "搜索"}
          </Button>
        </div>
        <div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择证书状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">所有状态</SelectItem>
              <SelectItem value={CertificateStatus.PENDING}>审核中</SelectItem>
              <SelectItem value={CertificateStatus.APPROVED}>已批准</SelectItem>
              <SelectItem value={CertificateStatus.REJECTED}>已拒绝</SelectItem>
              <SelectItem value={CertificateStatus.ISSUED}>已颁发</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 证书请求列表 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="w-[200px]">申请用户</TableHead>
              <TableHead>课程名称</TableHead>
              <TableHead className="hidden md:table-cell">申请日期</TableHead>
              <TableHead className="w-[100px]">状态</TableHead>
              <TableHead className="hidden md:table-cell">审核日期</TableHead>
              <TableHead className="w-[150px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    加载中...
                  </div>
                </TableCell>
              </TableRow>
            ) : certificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center">
                    <Award className="h-10 w-10 text-muted-foreground/40 mb-2" />
                    <p className="text-muted-foreground">未找到证书申请记录</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              certificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell>#{cert.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground truncate max-w-32" title={cert.address}>
                        {cert.address}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{cert.courseId || '未知课程'}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {formatDate(cert.createdAt)}
                  </TableCell>
                  <TableCell>{getStatusBadge(cert.status)}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {formatDate(cert.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {cert.status === CertificateStatus.PENDING ? (
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 h-8"
                          onClick={() => onReview(cert.id, true)}
                          disabled={isProcessing[cert.id]}
                        >
                          {isProcessing[cert.id] ? (
                            <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5 mr-1" />
                          )}
                          批准
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-50 h-8"
                          onClick={() => onReview(cert.id, false)}
                          disabled={isProcessing[cert.id]}
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          拒绝
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">已处理</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分页控制 */}
      {!isLoading && certificates.length > 0 && (
        <DataTablePagination
          currentPage={pagination.page}
          pageSize={pagination.pageSize}
          totalItems={pagination.total}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
} 