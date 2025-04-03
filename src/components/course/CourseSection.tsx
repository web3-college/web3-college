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
}

interface CourseSectionProps {
  section: CourseSectionData;
  index: number;
  uploadStatus?: {
    progress: number;
    error: string | null;
  };
  onUpdate: (index: number, field: keyof CourseSectionData, value: string) => void;
  onRemove: (index: number) => void;
  onVideoFileChange: (index: number, file: File | null) => void;
}

export function CourseSection({
  section,
  index,
  uploadStatus,
  onUpdate,
  onRemove,
  onVideoFileChange
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
          />
        </div>
      </div>
    </div>
  );
} 