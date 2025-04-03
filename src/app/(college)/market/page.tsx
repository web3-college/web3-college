"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, BookOpen, ArrowRight } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  level: "初级" | "中级" | "高级";
  duration: string;
  category: string;
}

export default function MarketPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 模拟从API加载课程
    setTimeout(() => {
      const dummyCourses: Course[] = [
        {
          id: "1",
          title: "区块链基础入门",
          description: "了解区块链核心概念、工作原理及其在各行业的应用",
          price: "50 YIDENG",
          imageUrl: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop",
          level: "初级",
          duration: "8小时",
          category: "基础"
        },
        {
          id: "2",
          title: "以太坊智能合约开发",
          description: "学习Solidity语言和智能合约开发，构建DApp应用",
          price: "120 YIDENG",
          imageUrl: "https://images.unsplash.com/photo-1659242504075-13479caa5fee?q=80&w=2787&auto=format&fit=crop",
          level: "中级",
          duration: "16小时",
          category: "以太坊"
        },
        {
          id: "3",
          title: "Web3.js & ethers.js 前端开发",
          description: "使用JavaScript库与区块链交互，开发Web3前端应用",
          price: "100 YIDENG",
          imageUrl: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2864&auto=format&fit=crop",
          level: "中级",
          duration: "12小时",
          category: "前端"
        },
        {
          id: "4",
          title: "DeFi协议开发与集成",
          description: "深入学习DeFi协议原理，开发和集成DeFi应用",
          price: "200 YIDENG",
          imageUrl: "https://images.unsplash.com/photo-1642059883504-4f21fbba5aec?q=80&w=2787&auto=format&fit=crop",
          level: "高级",
          duration: "20小时",
          category: "DeFi"
        },
        {
          id: "5",
          title: "NFT市场开发",
          description: "学习ERC-721和ERC-1155标准，构建NFT市场平台",
          price: "150 YIDENG",
          imageUrl: "https://images.unsplash.com/photo-1645911012997-9d235345fd71?q=80&w=2787&auto=format&fit=crop",
          level: "中级",
          duration: "15小时",
          category: "NFT"
        },
        {
          id: "6",
          title: "区块链安全与审计",
          description: "学习智能合约安全最佳实践，防范常见攻击和漏洞",
          price: "180 YIDENG",
          imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop",
          level: "高级",
          duration: "18小时",
          category: "安全"
        }
      ];
      setCourses(dummyCourses);
      setIsLoading(false);
    }, 1000);
  }, []);

  const categories = ["全部", "基础", "以太坊", "前端", "DeFi", "NFT", "安全"];
  
  const filteredCourses = selectedCategory === "全部" 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const levelBadgeColor = (level: string) => {
    switch(level) {
      case "初级": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "中级": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "高级": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            课程列表
          </h1>
          <p className="text-foreground/40 max-w-2xl mx-auto">
            使用yideng代币解锁优质的区块链和Web3开发课程
          </p>
        </div>
        
        {/* 分类过滤器 */}
        <div className="mb-10 flex flex-wrap gap-2 justify-center">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* 课程列表 */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-foreground/5 rounded-xl h-96"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <Card 
                key={course.id}
                className="overflow-hidden border border-white/[0.05] bg-gradient-to-br from-background/80 to-background/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 text-xs rounded-full border ${levelBadgeColor(course.level)}`}>
                      {course.level}
                    </span>
                    <span className="flex items-center text-sm text-foreground/40">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {course.duration}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold line-clamp-1">{course.title}</h3>
                  
                  <p className="text-foreground/40 text-sm line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center justify-between pt-4">
                    <p className="font-semibold flex items-center">
                      <Zap className="h-4 w-4 text-yellow-500 mr-1.5" />
                      {course.price}
                    </p>
                    
                    <Button size="sm" className="rounded-full">
                      购买课程 <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {/* 空状态 */}
        {!isLoading && filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">暂无课程</h3>
            <p className="text-foreground/40">
              当前分类下暂无课程，请尝试其他分类
            </p>
          </div>
        )}
      </div>
    </div>
  );
}