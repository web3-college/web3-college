"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCourseMarket } from "@/lib/contract-hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, Loader2 } from "lucide-react";
import { useAccount } from "wagmi"; // 导入 useAccount hook
// 使用统一导入方式
import {
  CourseBasicInfo,
  CourseSectionList,
  CourseSectionData,
  StatusMessage
} from "@/components/course";
import { generateFileId } from "@/lib/upload-storage";
import { uploadVideoFile, pauseUpload, cleanupUploadControl } from "@/lib/video-upload";
import { getAllUploadStates, cleanupExpiredStates } from "@/lib/upload-storage";
import { CourseService } from "@/api";
// 导入合约配置和工厂
import { COURSE_MARKET_ADDRESS } from "@/lib/contract-config";
import { CourseMarket__factory } from "@/types/contracts/factories";
// 导入确认对话框组件
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { getEthersProvider } from "@/lib/contract-hooks"



export default function NewCoursePage() {
  const router = useRouter();
  const { addCourse, status, isLoading, error } = useCourseMarket();
  const { address, isConnected } = useAccount(); // 获取当前钱包地址

  const curUploadId = useRef<string>(null)
  const curUploadKey = useRef<string>(null)

  // 使用状态管理视频上传队列
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<{ index: number, file: File }[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [sections, setSections] = useState<CourseSectionData[]>([
    { title: "", description: "", order: 1, videoUrl: "" }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'blockchain_success' | 'api_success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: { progress: number, error: string | null } }>({});

  // 确认对话框状态
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmPrice, setConfirmPrice] = useState<bigint>(BigInt(0));

  // 页面加载时检查未完成的上传并清理过期状态
  useEffect(() => {
    // 清理过期的上传状态
    cleanupExpiredStates();

    // 检查是否有未完成的上传
    const incompleteUploads = getAllUploadStates();

    if (incompleteUploads.length > 0) {
      // 显示未完成上传信息
      setFormError(`发现未完成的视频上传，可以继续上传`);

      // 3秒后清除错误信息
      setTimeout(() => {
        setFormError("");
      }, 3000);
    }
  }, []);

  // 在组件加载时检查钱包连接状态
  useEffect(() => {
    if (!isConnected) {
      setFormError("请先连接钱包才能创建课程");
    } else {
      console.log("当前连接的钱包地址:", address);
      setFormError(""); // 清除错误信息
    }
  }, [isConnected, address]);

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
  const handleVideoFileChange = (index: number, file: File | null) => {
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

      newSections[index].videoFile = file;
      // 初始化该视频的上传状态
      setUploadStatus(prev => ({
        ...prev,
        [`video-${index}`]: { progress: 0, error: null }
      }));

      // 添加到上传队列
      setUploadQueue(prev => [...prev, { index, file }]);
    } else {
      // 清除视频文件
      delete newSections[index].videoFile;
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
  const updateSection = (index: number, field: keyof CourseSectionData, value: string) => {
    const newSections = [...sections];
    newSections[index] = {
      ...newSections[index],
      [field]: value
    };
    setSections(newSections);
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // YiDeng代币只支持整数值
    const priceInTokens = price ? BigInt(parseInt(price)) : BigInt(0);

    // 验证价格必须大于0
    if (priceInTokens <= BigInt(0)) {
      setFormError("价格必须大于0");
      return;
    }

    // 打开确认对话框并设置价格
    setConfirmPrice(priceInTokens);
    setIsConfirmDialogOpen(true);
  };

  // 确认创建课程
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setFormError("");
    setFormStatus('submitting');

    try {
      // 验证钱包连接
      if (!isConnected || !address) {
        throw new Error("请先连接钱包");
      }

      // 验证表单
      if (!name || !confirmPrice || !categoryId) {
        throw new Error("请填写所有必填字段");
      }

      // 验证章节
      if (sections.some(section => !section.title || !section.videoUrl)) {
        throw new Error("章节标题和视频不能为空");
      }

      // 步骤1: 通过 API 在数据库中创建课程
      let courseId: number | null = null;
      try {
        setFormStatus('submitting');
        console.log('正在创建课程...');

        const response = await CourseService.courseControllerCreateCourse({
          requestBody: {
            name,
            description,
            price: Number(confirmPrice), // 使用整数价格
            categoryId: parseInt(categoryId),
            coverImage,
            creator: address || "",
            sections: sections.map(({ title, description, order, videoUrl }) => ({
              title, description, order, videoUrl
            }))
          }
        });

        if (response.code !== 200) {
          console.error("API创建课程失败:", response);
          throw new Error(response.message || "创建课程失败");
        }

        courseId = response.data.id;
        console.log('数据库课程创建成功，ID:', courseId);

        // 步骤2: 调用智能合约在链上添加课程
        try {
          console.log('正在链上添加课程...');
          setFormStatus('submitting');

          // 使用与前面相同的价格
          console.log('价格:', confirmPrice.toString(), 'YD');

          console.log('链上添加课程参数:', {
            courseId: String(courseId),
            name,
            price: confirmPrice.toString()
          });

          // 检查用户是否为合约所有者
          const provider = await getEthersProvider();
          if (!provider) throw new Error("无法连接以太坊网络");

          const marketContract = CourseMarket__factory.connect(COURSE_MARKET_ADDRESS, provider);
          const owner = await marketContract.owner();

          // 如果当前用户不是合约所有者，显示相应提示
          if (address && owner.toLowerCase() !== address.toLowerCase()) {
            console.warn("当前用户不是合约所有者，无法添加课程");
            setFormError("您不是合约所有者，无法添加课程到链上。请联系管理员协助添加该课程。");

            // 数据库中已经创建了课程，所以显示部分成功状态
            setFormStatus('api_success');
            return;
          }

          // 用户是合约所有者，调用合约添加课程
          const hash = await addCourse(String(courseId), name, confirmPrice);
          setTxHash(hash);

          console.log('课程已成功添加到链上，交易哈希:', hash);
          setFormStatus('blockchain_success');

        } catch (contractError: any) {
          console.error("链上添加课程失败:", contractError);

          // 提取更有用的错误信息
          let errorMessage = "链上添加课程失败";

          if (contractError.message) {
            // 常见错误类型处理
            if (contractError.message.includes("execution reverted")) {
              if (contractError.message.includes("OwnableUnauthorizedAccount")) {
                errorMessage = "您没有权限添加课程，需要合约所有者权限";
              } else if (contractError.message.includes("Course already exists")) {
                errorMessage = "该课程ID已存在于链上";
              } else if (contractError.message.includes("Web2 course ID cannot be empty")) {
                errorMessage = "Web2课程ID不能为空";
              } else {
                errorMessage = "合约执行被回滚，可能是参数错误或权限问题";
              }
            } else if (contractError.message.includes("insufficient funds")) {
              errorMessage = "钱包余额不足以支付交易费用";
            } else if (contractError.message.includes("user rejected")) {
              errorMessage = "您取消了交易签名";
            } else {
              errorMessage = contractError.message.slice(0, 100); // 截取前100个字符
            }
          }

          // 合约调用失败，调用API删除数据库中的课程
          if (courseId) {
            try {
              console.log('合约调用失败，删除数据库中的课程，ID:', courseId);
              const deleteResponse = await CourseService.courseControllerDeleteCourse({
                id: courseId
              });
              if (deleteResponse.code === 200) {
                console.log('成功删除数据库中的课程');
                errorMessage += "。已自动清理数据库中的课程数据。";
              } else {
                console.error('删除数据库中的课程失败:', deleteResponse);
                errorMessage += "。无法清理数据库中的课程数据，请联系管理员处理。";
              }
            } catch (deleteError) {
              console.error('删除数据库课程时出错:', deleteError);
              errorMessage += "。尝试清理数据库数据时出错，请联系管理员处理。";
            }
          }

          setFormError(errorMessage);
          setFormStatus('error');
        }
      } catch (apiError) {
        console.error("API创建课程错误:", apiError);
        setFormError(apiError instanceof Error ? apiError.message : "API创建课程失败");
        setFormStatus('error');
      }
    } catch (err: any) {
      console.error("创建课程验证错误:", err);
      setFormError(err.message || "创建课程失败，请检查表单内容");
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 添加重置表单的函数
  const resetForm = () => {
    // 清空所有表单字段
    setName("");
    setDescription("");
    setPrice("");
    setCategoryId("");
    setCoverImage("");
    setSections([
      { title: "", description: "", order: 1, videoUrl: "" }
    ]);

    // 清空上传状态和交易状态
    setUploadStatus({});
    setTxHash(null);
    setFormStatus('idle');
    setFormError("");

    // 滚动到页面顶部
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto">
      {/* 钱包连接状态提示 */}
      {!isConnected && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="font-medium text-yellow-600">请先连接钱包</p>
          <p className="text-sm text-yellow-600 mt-1">
            创建课程需要连接您的钱包账户，以便将课程信息写入区块链。
          </p>
        </div>
      )}

      <StatusMessage
        formStatus={formStatus}
        isLoading={isLoading}
        contractStatus={status}
        txHash={txHash}
        formError={formError}
        error={error}
      />

      {/* 创建成功后显示返回课程列表按钮 */}
      {(formStatus === 'blockchain_success' || formStatus === 'api_success') && (
        <div className="mb-6 flex justify-between">
          <Button
            variant="outline"
            onClick={resetForm}
            className="flex items-center"
          >
            继续创建新课程
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/courses")}
            className="flex items-center"
          >
            查看课程列表
          </Button>
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
              !isConnected || // 未连接钱包时禁用
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
                创建课程
              </>
            )}
          </Button>
        </div>
      </form>

      {/* 确认对话框 */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmSubmit}
        title="确认创建课程"
        description={`您确定要创建此课程吗？课程价格将设为 ${confirmPrice.toString()} YD。`}
        confirmText="确认创建"
        cancelText="取消"
      />
    </div>
  );
}