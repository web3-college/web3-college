"use client";

import { useCallback, useRef, useState, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
  initialTime?: number;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onProgress?: (progress: number) => void;
  onEnded?: () => void;
}

export default function VideoPlayer({
  src,
  initialTime = 0,
  onTimeUpdate,
  onProgress,
  onEnded
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 视频加载完成
  const handleLoadedMetadata = useCallback(() => {
    setIsLoading(false);

    // 设置初始播放位置
    if (videoRef.current && initialTime > 0) {
      videoRef.current.currentTime = initialTime;
    }
  }, [initialTime]);

  // 时间更新处理
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 0;

      // 计算进度百分比 (0-100)
      const progressPercent = duration > 0 ? Math.floor((currentTime / duration) * 100) : 0;

      // 调用回调函数
      onTimeUpdate?.(currentTime, duration);
      onProgress?.(progressPercent);
    }
  }, [onTimeUpdate, onProgress]);

  // 视频结束处理
  const handleEnded = useCallback(() => {
    onEnded?.();
  }, [onEnded]);

  return (
    <div className="relative w-full aspect-video bg-black/50">
      {/* 加载指示器 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* 视频播放器 */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        controls
        playsInline
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
}