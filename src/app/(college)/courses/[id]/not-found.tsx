"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CourseNotFound() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/market');
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">课程不存在</h1>
      <p className="text-foreground/40 mb-8">该课程可能已被删除或尚未发布</p>
      <Button
        onClick={handleBackClick}
        className="transition-all duration-300 hover:scale-105 hover:shadow-md"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
        返回课程列表
      </Button>
    </div>
  );
} 