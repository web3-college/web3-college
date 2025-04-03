"use client";

import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

interface StatusMessageProps {
  formStatus: 'idle' | 'submitting' | 'blockchain_success' | 'api_success' | 'error';
  isLoading?: boolean;
  contractStatus?: string;
  txHash?: string | null;
  formError?: string;
  error?: any;
}

export function StatusMessage({
  formStatus,
  isLoading,
  contractStatus,
  txHash,
  formError,
  error
}: StatusMessageProps) {
  if (formError) {
    return (
      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center">
        <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
        <span className="text-red-600">{formError}</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center">
        <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
        <span className="text-red-600">{String(error)}</span>
      </div>
    );
  }

  if (formStatus === 'submitting' || isLoading || contractStatus === 'loading') {
    return (
      <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center">
        <Loader2 className="h-5 w-5 mr-2 animate-spin text-blue-500" />
        <span>正在处理您的请求，请稍候...</span>
      </div>
    );
  } 
  
  if (formStatus === 'blockchain_success' && txHash) {
    return (
      <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
        <div className="flex items-center mb-2">
          <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
          <h4 className="font-medium text-green-500">课程创建成功!</h4>
        </div>
        
        <div className="pl-7">
          <p className="text-sm mb-1">数据库保存成功 ✓</p>
          <p className="text-sm mb-1">区块链交易成功 ✓</p>
          <p className="text-sm text-gray-500">交易哈希: {txHash}</p>
          <p className="text-sm mt-2 text-blue-500">您可以继续创建新课程或前往课程列表查看</p>
        </div>
      </div>
    );
  } 
  
  if (formStatus === 'api_success') {
    return (
      <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
        <div className="flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
          <h4 className="font-medium text-green-500">数据库保存成功!</h4>
        </div>
        <p className="text-sm pl-7 mt-1">正在等待区块链确认...</p>
      </div>
    );
  }
  
  return null;
} 