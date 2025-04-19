"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CertificateService } from "@/api";
import { CertificateStatus } from "@/types";
import { toast } from "sonner";
import { CertificateList } from "@/components/certificates/CertificateList";
import debounce from "lodash/debounce";
import { useCourseMarket } from "@/lib/contract-hooks";

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

export default function CertificatesPage() {
  // 获取合约钩子
  const { verifyCourse } = useCourseMarket();

  // 跟踪初始加载状态
  const isInitialMount = useRef(true);

  // 状态管理
  const [certificates, setCertificates] = useState<CertificateRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  });
  const [isProcessing, setIsProcessing] = useState<{ [key: number]: boolean }>({});

  // 获取所有证书请求
  const fetchCertificates = async (page = pagination.page, status?: CertificateStatus | "ALL", search = searchTerm) => {
    setIsLoading(true);
    try {
      const params: {
        page?: number;
        pageSize?: number;
        status?: CertificateStatus;
        address?: string;
      } = {
        page,
        pageSize: pagination.pageSize
      };

      // 添加状态过滤
      if (status && status !== "ALL") {
        params.status = status as CertificateStatus;
      }

      // 添加搜索参数 - 假设搜索内容是钱包地址
      if (search && search.trim()) {
        // 检查是否像钱包地址的格式 (0x开头)
        if (search.trim().startsWith('0x')) {
          params.address = search.trim();
        }
      }

      const response = await CertificateService.certificateControllerGetAllCertificateRequests(params);

      if (response && response.data) {
        // 处理服务器响应数据
        const responseData = response.data;

        if (Array.isArray(responseData.items)) {
          setCertificates(responseData.items);
          setPagination({
            page: responseData.page || page,
            pageSize: responseData.pageSize || pagination.pageSize,
            total: responseData.total || responseData.items.length
          });
        } else if (Array.isArray(responseData)) {
          // 如果响应不是分页格式，而是直接返回数组
          setCertificates(responseData);
          setPagination(prev => ({
            ...prev,
            page,
            total: responseData.length
          }));
        } else {
          setCertificates([]);
          setPagination(prev => ({
            ...prev,
            page,
            total: 0
          }));
        }
      } else {
        setCertificates([]);
        setPagination(prev => ({
          ...prev,
          page,
          total: 0
        }));
      }
    } catch (error) {
      console.error("获取证书请求失败:", error);
      toast.error("获取数据失败", {
        description: "无法加载证书请求数据，请稍后重试"
      });
      setCertificates([]);
    } finally {
      isInitialMount.current = false;
      setIsLoading(false);
    }
  };

  // 处理状态筛选
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
    fetchCertificates(1, value as CertificateStatus | "ALL");
  };

  // 使用 lodash 的 debounce 实现搜索防抖
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      setPagination(prev => ({
        ...prev,
        page: 1
      }));
      fetchCertificates(1, statusFilter === "ALL" ? undefined : statusFilter as CertificateStatus, searchValue);
    }, 500),
    [statusFilter]
  );

  // 处理搜索输入变化
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (!isInitialMount.current) {
      debouncedSearch(value);
    }
  };

  // 手动搜索按钮
  const handleSearch = () => {
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
    fetchCertificates(1, statusFilter === "ALL" ? undefined : statusFilter as CertificateStatus, searchTerm);
  };

  // 分页变化处理
  const handlePageChange = (page: number) => {
    setPagination(prev => ({
      ...prev,
      page
    }));
    fetchCertificates(page, statusFilter === "ALL" ? undefined : statusFilter as CertificateStatus, searchTerm);
  };

  // 初始加载
  useEffect(() => {
    fetchCertificates();
    // 组件卸载时取消防抖
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  // 审核证书请求
  const handleReviewRequest = async (id: number, approved: boolean) => {
    // 防止重复点击
    if (isProcessing[id]) return;

    setIsProcessing(prev => ({ ...prev, [id]: true }));

    try {
      // 如果是批准操作，先验证用户是否完成课程
      if (approved) {
        // 找到当前证书请求
        const certificate = certificates.find(cert => cert.id === id);

        if (!certificate) {
          toast.error("无法找到证书请求", {
            description: "请刷新页面后重试"
          });
          return;
        }

        // 调用合约验证用户是否完成课程
        try {
          await verifyCourse(certificate.address, certificate.courseId.toString());
        } catch (error) {
          console.error("验证课程完成状态失败:", error);
          toast.error("合约验证失败", {
            description: (error as Error).message
          });
          setIsProcessing(prev => ({ ...prev, [id]: false }));
          return;
        }
      }

      // 通过验证或者是拒绝操作，继续更新证书状态
      await CertificateService.certificateControllerUpdateCertificateStatus({
        requestBody: {
          id,
          status: approved ? CertificateStatus.APPROVED : CertificateStatus.REJECTED
        }
      });

      toast.success(approved ? "证书已批准" : "已拒绝证书请求", {
        description: approved ? "证书已成功批准并发送给用户" : "已拒绝用户的证书请求"
      });

      // 重新获取数据
      fetchCertificates(
        pagination.page,
        statusFilter === "ALL" ? undefined : statusFilter as CertificateStatus,
        searchTerm
      );
    } catch (error) {
      console.error("更新证书状态失败:", error);
      toast.error("操作失败", {
        description: "处理证书请求时出错，请稍后重试"
      });
    } finally {
      setIsProcessing(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <CertificateList
      certificates={certificates}
      isLoading={isLoading}
      statusFilter={statusFilter}
      searchTerm={searchTerm}
      pagination={pagination}
      onSearchChange={handleSearchChange}
      onSearch={handleSearch}
      onStatusFilterChange={handleStatusFilterChange}
      onReview={handleReviewRequest}
      onPageChange={handlePageChange}
      isProcessing={isProcessing}
    />
  );
} 