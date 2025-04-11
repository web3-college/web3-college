"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CourseSection, CourseSectionData } from "./CourseSection";

interface CourseSectionListProps {
  sections: CourseSectionData[];
  uploadStatus: { [key: string]: { progress: number, error: string | null } };
  onAddSection: () => void;
  onRemoveSection: (index: number) => void;
  onUpdateSection: (index: number, field: keyof CourseSectionData, value: string | boolean) => void;
  onVideoFileChange: (index: number, file: File | null) => void;
  onAbortUpload: (index: number) => void;
}

export function CourseSectionList({
  sections,
  uploadStatus,
  onAddSection,
  onRemoveSection,
  onUpdateSection,
  onVideoFileChange,
  onAbortUpload
}: CourseSectionListProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">课程章节</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddSection}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" /> 添加章节
        </Button>
      </div>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <CourseSection
            key={index}
            section={section}
            index={index}
            uploadStatus={uploadStatus[`video-${index}`]}
            onUpdate={onUpdateSection}
            onRemove={onRemoveSection}
            onVideoFileChange={onVideoFileChange}
            onAbortUpload={onAbortUpload}
          />
        ))}
      </div>
    </div>
  );
} 