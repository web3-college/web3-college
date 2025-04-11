"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { VideoUploader } from "./VideoUploader";

export interface CourseSectionData {
  title: string;
  description: string;
  order: number;
  videoUrl: string;
  videoFile?: File;
  uploadId?: string;
  duration?: number; // 视频时长（秒）
  isPreview?: boolean; // 是否为预览章节
}

interface CourseSectionProps {
  section: CourseSectionData;
  index: number;
  uploadStatus?: {
    progress: number;
    error: string | null;
  };
  onUpdate: (index: number, field: keyof CourseSectionData, value: string | boolean) => void;
  onRemove: (index: number) => void;
  onVideoFileChange: (index: number, file: File | null) => void;
  onAbortUpload: (index: number) => void;
}

export function CourseSection({
  section,
  index,
  uploadStatus,
  onUpdate,
  onRemove,
  onVideoFileChange,
  onAbortUpload
}: CourseSectionProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">章节 {index + 1}</h3>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="h-8 w-8 text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor={`section-title-${index}`}>章节标题 *</Label>
          <Input
            id={`section-title-${index}`}
            value={section.title}
            onChange={(e) => onUpdate(index, "title", e.target.value)}
            className="mt-1"
            placeholder="输入章节标题"
            required
          />
        </div>

        <div>
          <Label htmlFor={`section-description-${index}`}>章节描述</Label>
          <Textarea
            id={`section-description-${index}`}
            value={section.description}
            onChange={(e) => onUpdate(index, "description", e.target.value)}
            rows={2}
            className="mt-1"
            placeholder="简要描述本章节内容"
          />
        </div>

        <div>
          <Label>章节视频 *</Label>
          <VideoUploader
            videoUrl={section.videoUrl}
            index={index}
            onVideoUrlChange={(value) => onUpdate(index, "videoUrl", value)}
            onVideoFileChange={(file) => onVideoFileChange(index, file)}
            uploadStatus={uploadStatus}
            onAbortUpload={() => onAbortUpload(index)}
            duration={section.duration}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`section-preview-${index}`}
            checked={section.isPreview || false}
            onChange={(e) => onUpdate(index, "isPreview", e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor={`section-preview-${index}`} className="font-normal cursor-pointer">
            设为预览章节（未购买课程的用户可观看）
          </Label>
        </div>
      </div>
    </div>
  );
} 