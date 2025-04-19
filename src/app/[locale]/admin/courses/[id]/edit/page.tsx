"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, Loader2, ChevronLeft } from "lucide-react";
import {
  CourseBasicInfo,
  CourseSectionList,
  CourseSectionData,
} from "@/components/course";
import { generateFileId } from "@/lib/upload-storage";
import { uploadVideoFile, pauseUpload, cleanupUploadControl } from "@/lib/video-upload";
import { cleanupExpiredStates } from "@/lib/upload-storage";
import { CourseService } from "@/api";
import { getVideoDuration } from "@/lib/file";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { useAccount } from "wagmi";

export default function EditCoursePage() {
  const { id } = useParams();
  const courseId = Array.isArray(id) ? id[0] : id;

  // 课程价格在编辑时不可修改，因为它已经在区块链上发布
  // 修改价格需要进行额外的链上操作，会导致链上数据与后端数据不一致

  const curUploadId = useRef<string>(null);
  const curUploadKey = useRef<string>(null);

  // 使用状态管理视频上传队列
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<{ index: number, file: File }[]>([]);

  // 表单数据
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [sections, setSections] = useState<CourseSectionData[]>([]);

  // 状态管理
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'submitting' | 'success' | 'error'>('idle');
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: { progress: number, error: string | null } }>({});

  // 加载课程数据
  useEffect(() => {
    async function fetchCourseData() {
      if (!courseId) return;

      setFormStatus('loading');
      setIsLoading(true);

      try {
        const response = await CourseService.courseControllerFindCourseById({ id: Number(courseId) });

        if (response.code === 200 && response.data) {
          const courseData = response.data;

          // 初始化表单数据
          setName(courseData.name);
          setDescription(courseData.description || "");
          setPrice(courseData.price.toString()); // 仅用于界面显示，提交时不会使用
          setCategoryId(courseData.categoryId.toString());
          setCoverImage(courseData.coverImage || "");

          // 初始化章节数据
          if (courseData.sections && courseData.sections.length > 0) {
            const formattedSections = courseData.sections.map((section: any) => ({
              title: section.title,
              description: section.description || "",
              order: section.order,
              videoUrl: section.videoUrl || "",
              duration: section.duration || undefined,
              isPreview: section.isPreview || false
            }));
            setSections(formattedSections);
          } else {
            // 如果没有章节，初始化一个空章节
            setSections([{ title: "", description: "", order: 1, videoUrl: "" }]);
          }

          setFormStatus('idle');
        } else {
          setFormError("获取课程数据失败：" + (response.msg || "未知错误"));
          setFormStatus('error');
        }
      } catch (error) {
        console.error("获取课程数据错误:", error);
        setFormError("获取课程数据出错，请稍后重试");
        setFormStatus('error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourseData();
  }, [courseId]);

  // 页面加载时检查未完成的上传并清理过期状态
  useEffect(() => {
    // 清理过期的上传状态
    cleanupExpiredStates();
  }, []);

  // 处理视频上传主函数
  const processVideoUpload = async (index: number, file: File) => {
    const newSections = [...sections];

    // 更新上传状态为上传中
    setUploadStatus(prev => ({
      ...prev,
      [`video-${index}`]: { progress: 0, error: null }
    }));

    try {
      // 使用工具函数进行视频上传
      const videoUrl = await uploadVideoFile(
        file,
        (progress) => {
          // 更新上传进度
          setUploadStatus(prev => ({
            ...prev,
            [`video-${index}`]: { progress, error: null }
          }));
        },
        (key, uploadId) => {
          // 保存上传ID和Key，用于可能的中止操作
          curUploadKey.current = key;
          curUploadId.current = uploadId;
        }
      );

      // 更新视频URL和上传状态
      newSections[index].videoUrl = videoUrl;
      setSections(newSections);
      setUploadStatus(prev => ({
        ...prev,
        [`video-${index}`]: { progress: 100, error: null }
      }));

      return true;
    } catch (error) {
      throw error;
    }
  };

  const processQueue = useCallback(async () => {
    if (uploadQueue.length > 0 && !isUploading) {
      setIsUploading(true);
      const { index, file } = uploadQueue[0];

      try {
        // 直接处理当前视频
        await processVideoUpload(index, file);
      } catch (error) {
        if (error instanceof Error && error.message !== "上传已被用户取消") {
          console.error('视频上传失败:', error);
          setUploadStatus(prev => ({
            ...prev,
            [`video-${index}`]: { progress: 0, error: '视频上传失败，请重试' }
          }));
        }
      } finally {
        // 移除已处理的任务
        setUploadQueue(prev => prev.slice(1));
        setIsUploading(false);
      }
    }
  }, [uploadQueue, isUploading, sections]);

  // 监听上传队列变化
  useEffect(() => {
    processQueue();
  }, [processQueue]);

  // 处理视频文件变更
  const handleVideoFileChange = async (index: number, file: File | null) => {
    const newSections = [...sections];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('video/')) {
        setFormError('请上传有效的视频文件');
        return;
      }

      // 验证文件大小，最大 5GB
      const MAX_SIZE = 5 * 1024 * 1024 * 1024; // 5GB in bytes
      if (file.size > MAX_SIZE) {
        setFormError(`视频大小不能超过 5GB，当前大小为 ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        return;
      }

      try {
        // 获取视频时长
        const duration = await getVideoDuration(file);
        console.log(`视频时长: ${duration}秒`);

        // 更新视频信息
        newSections[index].videoFile = file;
        newSections[index].duration = duration; // 添加时长信息

        // 初始化该视频的上传状态
        setUploadStatus(prev => ({
          ...prev,
          [`video-${index}`]: { progress: 0, error: null }
        }));

        // 添加到上传队列
        setUploadQueue(prev => [...prev, { index, file }]);
      } catch (error) {
        console.error('获取视频时长失败:', error);
        setFormError('获取视频时长失败，请重新选择视频');
        return;
      }
    } else {
      // 清除视频文件
      delete newSections[index].videoFile;
      delete newSections[index].duration; // 清除时长信息

      // 清除上传状态
      const newUploadStatus = { ...uploadStatus };
      delete newUploadStatus[`video-${index}`];
      setUploadStatus(newUploadStatus);

      // 从上传队列中移除该视频
      setUploadQueue(prev => prev.filter(item => item.index !== index));
    }
    setSections(newSections);
  };

  // 取消视频上传
  const handleAbortUpload = async (index: number) => {
    console.log('取消视频上传');

    const section = sections[index];
    if (section?.videoFile) {
      // 使用全局变量控制机制暂停上传
      pauseUpload(section.videoFile);
      console.log(`通过控制变量取消视频上传: 索引=${index}, fileId=${generateFileId(section.videoFile)}`);

      // 更新上传状态
      setUploadStatus(prev => ({
        ...prev,
        [`video-${index}`]: { progress: 0, error: '上传已取消' }
      }));

      // 从上传队列中删除
      setUploadQueue(prev => prev.filter(item => item.index !== index));

      // 清理上传控制状态
      cleanupUploadControl(section.videoFile);
    }
  };

  // 添加课程章节
  const addSection = () => {
    setSections([
      ...sections,
      {
        title: "",
        description: "",
        order: sections.length + 1,
        videoUrl: ""
      }
    ]);
  };

  // 删除课程章节
  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);

    // 重新计算顺序
    newSections.forEach((section, idx) => {
      section.order = idx + 1;
    });

    setSections(newSections);
  };

  // 更新章节字段
  const updateSection = (index: number, field: keyof CourseSectionData, value: string | boolean) => {
    const newSections = [...sections];
    newSections[index] = {
      ...newSections[index],
      [field]: value
    };
    console.log(newSections);

    setSections(newSections);
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseId) {
      setFormError("课程ID无效");
      return;
    }

    setIsSubmitting(true);
    setFormError("");
    setFormStatus('submitting');

    try {
      // 验证表单
      if (!name || !categoryId) {
        throw new Error("请填写所有必填字段");
      }

      // 验证章节
      if (sections.some(section => !section.title || !section.videoUrl)) {
        throw new Error("章节标题和视频不能为空");
      }

      // 更新课程
      const response = await CourseService.courseControllerUpdateCourse({
        id: Number(courseId),
        requestBody: {
          name,
          description,
          categoryId: parseInt(categoryId),
          coverImage,
          sections: sections.map(({ title, description, order, videoUrl, duration, isPreview }) => ({
            title,
            description,
            order,
            videoUrl,
            duration: duration || 0,
            isPreview: isPreview || false
          }))
        }
      });

      if (response.code === 200) {
        setFormStatus('success');
        toast.success("课程更新成功");
      } else {
        throw new Error(response.msg || "更新课程失败");
      }
    } catch (err: any) {
      console.error("更新课程错误:", err);
      setFormError(err.message || "更新课程失败");
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">正在加载课程数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link href="/admin/courses">
            <ChevronLeft className="h-4 w-4 mr-1" />
            返回课程列表
          </Link>
        </Button>
      </div>

      {formError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {formError}
        </div>
      )}

      {formStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500">
          课程更新成功
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <CourseBasicInfo
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            price={price}
            setPrice={setPrice}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            setFormError={setFormError}
            isEditing={true}
          />
        </Card>

        <Card className="p-6">
          <CourseSectionList
            sections={sections}
            uploadStatus={uploadStatus}
            onAddSection={addSection}
            onRemoveSection={removeSection}
            onUpdateSection={updateSection}
            onVideoFileChange={handleVideoFileChange}
            onAbortUpload={handleAbortUpload}
          />
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              isUploading ||
              uploadQueue.length > 0 ||
              sections.some(s => s.videoFile && (!uploadStatus[`video-${sections.indexOf(s)}`] || uploadStatus[`video-${sections.indexOf(s)}`]?.progress < 100))
            }
            className="flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                提交中...
              </>
            ) : isUploading || uploadQueue.length > 0 ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                视频上传中...{uploadQueue.length > 0 ? `(${uploadQueue.length}个待上传)` : ''}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                保存修改
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 