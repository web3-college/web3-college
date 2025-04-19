"use client"

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useSIWE } from "connectkit";
import { useAccount } from "wagmi";
import { useYiDengToken } from "@/lib/contract-hooks";
import { useCourseMarket } from "@/lib/contract-hooks";
import { useCourseCertificate } from "@/lib/contract-hooks";
import {
  BookOpen,
  Award,
  Wallet,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { CourseService } from "@/api";
import { CourseResponseDto } from "@/api/models/CourseResponseDto";
import { redirect } from "next/navigation";
import PurchasedCoursesList from "./PurchasedCoursesList";
import CertificatesList from "./CertificatesList";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

export default function CoursesClient() {
  const tCourses = useTranslations('Courses');
  const tUser = useTranslations('User');
  const { isSignedIn } = useSIWE();
  const { isConnected } = useAccount();
  const [purchasedCourses, setPurchasedCourses] = useState<CourseResponseDto[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingCertificates, setIsLoadingCertificates] = useState(true);
  const [yidengBalance, setYidengBalance] = useState<bigint>(BigInt(0));
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  const { getBalance } = useYiDengToken();
  const { getUserCourses } = useCourseMarket();
  const { getMyCertificates, getCertificateDetails } = useCourseCertificate();

  // 如果用户未登录，重定向到首页
  useEffect(() => {
    if (!isSignedIn) {
      toast.error(tUser("login"), {
        description: tUser("loginDesc")
      });
      redirect("/");
    }
  }, [isSignedIn]);

  // 获取用户购买的课程
  const fetchPurchasedCourses = async (): Promise<void> => {
    try {
      setIsLoadingCourses(true);

      // 先从链上获取用户购买的课程ID
      const onchainCourses = await getUserCourses();
      console.log("链上课程:", onchainCourses);

      // 根据链上课程ID从后端获取详细信息
      const courseIds = onchainCourses.map(course => course.web2CourseId);

      if (courseIds.length === 0) {
        setPurchasedCourses([]);
        setIsLoadingCourses(false);
        return;
      }

      // 从后端获取课程详情
      const coursesData: CourseResponseDto[] = [];

      for (const id of courseIds) {
        try {
          const response = await CourseService.courseControllerFindCourseById({
            id: parseInt(id)
          });
          if (response.data) {
            coursesData.push(response.data);
          }
        } catch (error) {
          console.error(`获取课程${id}详情失败:`, error);
        }
      }

      setPurchasedCourses(coursesData);
    } catch (error) {
      console.error("获取用户课程失败:", error);
      toast.error(tCourses("loadCoursesError"), {
        description: tCourses("loadCoursesErrorDesc")
      });
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // 获取用户证书
  const fetchCertificates = async () => {
    try {
      setIsLoadingCertificates(true);

      // 获取所有课程ID
      const onchainCourses = await getUserCourses();
      const courseIds = onchainCourses.map(course => course.web2CourseId);

      if (courseIds.length === 0) {
        setCertificates([]);
        return;
      }

      // 存储所有证书
      const allCertificates = [];

      // 遍历每个课程ID，获取对应的证书
      for (const courseId of courseIds) {
        try {
          // 从智能合约获取该课程的证书
          const courseCertificateIds = await getMyCertificates(courseId);

          if (courseCertificateIds.length > 0) {
            // 获取课程详情以获取课程名称
            const courseResponse = await CourseService.courseControllerFindCourseById({
              id: parseInt(courseId)
            });

            const courseName = courseResponse.data?.name || `课程 #${courseId}`;

            // 将每个证书转换为前端所需格式
            for (const tokenId of courseCertificateIds) {
              // 获取证书详细信息
              const certificateDetails = await getCertificateDetails(tokenId);

              if (certificateDetails) {
                // 将时间戳转换为日期
                const issueDate = new Date(Number(certificateDetails.timestamp) * 1000).toISOString();

                // 生成证书图片URL - 使用更好的动态图片服务
                // 这里使用UI Avatars服务生成基于课程名的动态图片
                // 实际项目中应该从metadataURI获取真实的证书图片
                const encodedCourseName = encodeURIComponent(courseName);
                const colorHash = Math.abs(courseName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 1000;
                const bgColor = `${colorHash}6${(colorHash % 9)}c`; // 生成动态颜色
                const fgColor = 'ffffff'; // 白色文字

                allCertificates.push({
                  id: allCertificates.length + 1, // 前端显示用
                  courseId: parseInt(courseId),
                  courseName: courseName,
                  tokenId: tokenId.toString(),
                  issueDate: issueDate,
                  metadataURI: certificateDetails.metadataURI,
                  imageUrl: `https://ui-avatars.com/api/?name=${encodedCourseName}&background=${bgColor}&color=${fgColor}&size=512&bold=true&format=png`
                });
              }
            }
          }
        } catch (error) {
          console.error(`获取课程 ${courseId} 的证书失败:`, error);
        }
      }

      setCertificates(allCertificates);
    } catch (error) {
      console.error("获取证书失败:", error);
      toast.error(tCourses("loadCertificatesError"), {
        description: tCourses("loadCertificatesErrorDesc")
      });
    } finally {
      setIsLoadingCertificates(false);
    }
  };

  // 获取YIDENG代币余额
  const fetchYidengBalance = async () => {
    try {
      setIsLoadingBalance(true);
      if (isConnected) {
        const balance = await getBalance();
        setYidengBalance(balance);
      }
    } catch (error) {
      console.error("获取代币余额失败:", error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // 页面加载时获取数据
  useEffect(() => {
    if (isSignedIn && isConnected) {
      fetchPurchasedCourses();
      fetchCertificates();
      fetchYidengBalance();
    }
  }, [isSignedIn, isConnected]);

  // 刷新代币余额
  const handleRefreshBalance = () => {
    fetchYidengBalance();
    toast.success(tCourses("refreshBalanceSuccess"));
  };

  // 数据卡片的骨架屏
  const DataCardSkeleton = () => (
    <div className="border border-white/[0.05] rounded-xl">
      <div className="p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-12" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* 顶部卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 课程数量 */}
        <Card className="border border-white/[0.05] bg-gradient-to-br from-background/80 to-background/40">
          <CardContent className="pt-6">
            {isLoadingCourses ? (
              <DataCardSkeleton />
            ) : (
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-foreground/40 text-sm">{tCourses("purchasedCourses")}</p>
                  <h3 className="text-2xl font-bold">{purchasedCourses.length}</h3>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 证书数量 */}
        <Card className="border border-white/[0.05] bg-gradient-to-br from-background/80 to-background/40">
          <CardContent className="pt-6">
            {isLoadingCertificates ? (
              <DataCardSkeleton />
            ) : (
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-foreground/40 text-sm">{tCourses("getCertificate")}</p>
                  <h3 className="text-2xl font-bold">{certificates.length}</h3>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 代币余额 */}
        <Card className="border border-white/[0.05] bg-gradient-to-br from-background/80 to-background/40">
          <CardContent className="pt-6">
            {isLoadingBalance ? (
              <DataCardSkeleton />
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-foreground/40 text-sm">{tCourses("yidengBalance")}</p>
                    <h3 className="text-2xl font-bold">{yidengBalance.toString()}</h3>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleRefreshBalance} disabled={isLoadingBalance}>
                  <RefreshCw className={`h-4 w-4 ${isLoadingBalance ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 主要内容 - 使用Tabs组件 */}
      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="w-full mb-8 grid grid-cols-2 bg-background border border-white/[0.05] rounded-lg p-1 h-auto">
          <TabsTrigger
            value="courses"
            className="data-[state=active]:bg-foreground/5 data-[state=active]:text-foreground data-[state=inactive]:text-foreground/40 py-3 rounded-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 flex-shrink-0" />
              <span>{tCourses("courses")}</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="certificates"
            className="data-[state=active]:bg-foreground/5 data-[state=active]:text-foreground data-[state=inactive]:text-foreground/40 py-3 rounded-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 flex-shrink-0" />
              <span>{tCourses("certificates")}</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-primary/90">{tCourses("courses")}</h2>
            <p className="text-foreground/40 text-sm mt-1">
              {tCourses("coursesDesc")}
            </p>
          </div>
          <PurchasedCoursesList courses={purchasedCourses} isLoading={isLoadingCourses} />
        </TabsContent>

        <TabsContent value="certificates" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-primary/90">{tCourses("certificates")}</h2>
            <p className="text-foreground/40 text-sm mt-1">
              {tCourses("certificatesDesc")}
            </p>
          </div>
          <CertificatesList certificates={certificates} isLoading={isLoadingCertificates} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
