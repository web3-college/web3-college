"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Image, X } from "lucide-react";
import { s3UploadSmall } from "@/lib/s3-upload";

interface ImageUploaderProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  setFormError: (error: string) => void;
  required?: boolean;
  label?: string;
}

export function ImageUploader({
  imageUrl,
  setImageUrl,
  setFormError,
  required = false,
  label = "图片"
}: ImageUploaderProps) {
  const imageFileRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 处理图片上传
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setFormError('请上传 PNG、JPG 或 GIF 格式的图片');
      return;
    }

    // 验证文件大小，最大 5MB
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_SIZE) {
      setFormError(`图片大小不能超过 5MB，当前大小为 ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    // 创建预览URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 立即上传图片
    try {
      setUploadProgress(10);
      const result = await uploadImageToServer(file);

      if (result && result.url) {
        setImageUrl(result.url);
        setUploadProgress(100);
      }
    } catch (error) {
      console.error('封面上传失败:', error);
      setFormError('封面上传失败，请重试');
      setUploadProgress(0);
    }
  };

  // 上传图片到服务器
  const uploadImageToServer = async (file: File) => {

    // 显示上传进度
    setUploadProgress(20);

    try {
      const data = await s3UploadSmall(file);

      setUploadProgress(80);
      setUploadProgress(100);
      return data;
    } catch (error) {
      setUploadProgress(0);
      console.error('图片上传错误:', error);
      throw error;
    }
  };

  // 处理拖拽上传
  const handleImageDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];

      // 验证文件类型
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setFormError('请上传 PNG、JPG 或 GIF 格式的图片');
        return;
      }

      // 验证文件大小，最大 5MB
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > MAX_SIZE) {
        setFormError(`图片大小不能超过 5MB，当前大小为 ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        return;
      }

      // 创建预览URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // 立即上传图片
      try {
        setUploadProgress(10);
        const result = await uploadImageToServer(file);
        if (result && result.url) {
          setImageUrl(result.url);
          setUploadProgress(100);
        }
      } catch (error) {
        console.error('封面上传失败:', error);
        setFormError('封面上传失败，请重试');
        setUploadProgress(0);
      }
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

  // 移除图片
  const removeImage = () => {
    setImagePreview(null);
    setImageUrl('');
    setUploadProgress(0);
    if (imageFileRef.current) {
      imageFileRef.current.value = "";
    }
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

  if (imagePreview) {
    return (
      <div className="md:col-span-2">
        <Label>{label} {required && '*'}</Label>
        <div className="mt-2">
          <div className="relative rounded-md overflow-hidden w-full max-w-md mx-auto">
            <img
              src={imagePreview}
              alt={`${label}预览`}
              className="w-full h-60 object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* 上传进度条 */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                <div className="flex items-center">
                  <span className="text-xs mr-2">上传中 {uploadProgress}%</span>
                  {renderProgressBar(uploadProgress)}
                </div>
              </div>
            )}
          </div>
        </div>
        <Input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="或者输入图片URL"
          className="mt-2"
        />
      </div>
    );
  }

  return (
    <div className="md:col-span-2">
      <Label>{label} {required && '*'}</Label>
      <div className="mt-2">
        <div
          className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center transition-colors hover:bg-gray-50 cursor-pointer"
          onDrop={handleImageDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onClick={() => imageFileRef.current?.click()}
        >
          <Image className="h-16 w-16 mx-auto text-gray-400" />
          <div className="mt-4 text-center">
            <span className="font-medium text-primary">点击上传</span>
            <span className="text-sm text-gray-600"> 或拖放图片到此处</span>
            <input
              ref={imageFileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            PNG, JPG, GIF 最大 5MB
          </p>
        </div>
      </div>
      <Input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="或者输入图片URL"
        className="mt-2"
      />
    </div>
  );
} 