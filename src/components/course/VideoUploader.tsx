"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Video, X } from "lucide-react";

interface VideoUploaderProps {
  videoUrl: string;
  index: number;
  onVideoUrlChange: (value: string) => void;
  onVideoFileChange: (file: File | null) => void;
  uploadStatus?: {
    progress: number;
    error: string | null;
  };
}

export function VideoUploader({
  videoUrl,
  index,
  onVideoUrlChange,
  onVideoFileChange,
  uploadStatus
}: VideoUploaderProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // 处理视频文件上传
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoFile(file);
    onVideoFileChange(file);
  };

  // 处理视频拖拽上传
  const handleVideoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      // 验证文件类型
      if (!file.type.match('video.*')) {
        return; // 错误处理由父组件完成
      }
      
      setVideoFile(file);
      onVideoFileChange(file);
    }
  };

  // 处理拖拽事件
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 处理拖拽进入事件
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 移除视频文件
  const removeVideoFile = () => {
    setVideoFile(null);
    onVideoFileChange(null);
  };

  // 渲染进度条
  const renderProgressBar = (progress: number) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  if (videoFile) {
    return (
      <div className="mt-2 border rounded-md p-3 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Video className="h-5 w-5 mr-2 text-blue-500" />
            <span className="text-sm truncate max-w-[200px]">
              {videoFile.name}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={removeVideoFile}
            className="h-7 w-7 text-red-500"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* 上传进度指示器 */}
        {uploadStatus && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>
                上传进度: {uploadStatus.progress}%
              </span>
              {uploadStatus.error && (
                <span className="text-red-500">
                  {uploadStatus.error}
                </span>
              )}
            </div>
            {renderProgressBar(uploadStatus.progress)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="flex items-center space-x-2">
        <label className="flex-1">
          <div 
            className="flex items-center justify-center border border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50"
            onDrop={handleVideoDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
          >
            <div className="flex flex-col items-center w-full">
              <Video className="h-10 w-10 text-gray-400 mb-3" />
              <span className="font-medium text-primary">点击上传视频</span>
              <span className="text-sm text-gray-500 mt-1">或拖放视频文件到此处</span>
              <p className="text-xs text-gray-500 mt-2">
                MP4, WebM, MOV 格式
              </p>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoFileChange}
              />
            </div>
          </div>
        </label>
        
        <span className="text-gray-400">或</span>
        
        <Input
          className="flex-1"
          placeholder="输入视频URL"
          value={videoUrl}
          onChange={(e) => onVideoUrlChange(e.target.value)}
        />
      </div>
      
      {/* 显示上传错误 */}
      {uploadStatus?.error && (
        <div className="mt-2 text-xs text-red-500">
          {uploadStatus.error}
        </div>
      )}
    </div>
  );
} 