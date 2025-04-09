"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataTablePaginationProps {
  currentPage: number;
  pageSize?: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageSize?: boolean;
}

/**
 * 通用数据表格分页组件
 */
export function DataTablePagination({
  currentPage,
  pageSize = 10,
  totalItems,
  totalPages,
  onPageChange,
  showPageSize = true,
}: DataTablePaginationProps) {
  // 计算当前显示的起始和结束记录
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center mt-4">
      {showPageSize && (
        <div className="text-sm text-muted-foreground">
          显示 {totalItems} 条结果中的 {startItem}-{endItem} 条
        </div>
      )}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* 第一页 */}
          {currentPage > 3 && (
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(1)}>
                1
              </PaginationLink>
            </PaginationItem>
          )}

          {/* 省略号 */}
          {currentPage > 4 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* 当前页的前一页 */}
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(currentPage - 1)}>
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {/* 当前页 */}
          <PaginationItem>
            <PaginationLink isActive onClick={() => onPageChange(currentPage)}>
              {currentPage}
            </PaginationLink>
          </PaginationItem>

          {/* 当前页的后一页 */}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(currentPage + 1)}>
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {/* 省略号 */}
          {currentPage < totalPages - 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* 最后一页 */}
          {currentPage < totalPages - 2 && (
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              aria-disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
} 