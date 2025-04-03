"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "./ImageUploader";
import { getCategories } from "@/api/category";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 使用API响应中定义的分类数据类型
interface CategoryData {
  id: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CourseBasicInfoProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  price: string;
  setPrice: (price: string) => void;
  categoryId: string;
  setCategoryId: (categoryId: string) => void;
  coverImage: string;
  setCoverImage: (coverImage: string) => void;
  setFormError: (error: string) => void;
}

export function CourseBasicInfo({
  name,
  setName,
  description,
  setDescription,
  price,
  setPrice, 
  categoryId,
  setCategoryId,
  coverImage,
  setCoverImage,
  setFormError
}: CourseBasicInfoProps) {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const result = await getCategories();
        console.log("分类数据:", result); // 调试输出
        
        if (result && result.code === 200 && Array.isArray(result.data)) {
          setCategories(result.data);
        } else if (result && Array.isArray(result.data)) {
          // 兼容没有code字段的情况
          setCategories(result.data);
        } else {
          console.error("获取分类数据格式错误:", result);
          setFormError("获取分类数据失败：格式错误");
        }
      } catch (error) {
        console.error("获取分类数据错误:", error);
        setFormError("获取分类数据错误");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [setFormError]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">基本信息</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">课程名称 *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1"
            placeholder="输入课程名称"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="price">价格 (YIDENG) *</Label>
          <Input
            id="price"
            type="number"
            step="1"
            min="1"
            value={price}
            onChange={(e) => {
              // 只接受整数输入
              const value = e.target.value;
              const intValue = parseInt(value);
              if (!isNaN(intValue) && intValue.toString() === value) {
                setPrice(value);
              } else if (value === "") {
                setPrice("");
              } else {
                // 如果输入的不是整数，转换为整数
                setPrice(Math.floor(parseFloat(value)).toString());
              }
            }}
            onBlur={(e) => {
              // 失去焦点时确保值为整数
              const value = e.target.value;
              if (value !== "") {
                setPrice(Math.floor(parseFloat(value)).toString());
              }
            }}
            className="mt-1"
            placeholder="100"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            价格将以YIDENG代币支付，仅支持整数金额 (例如: 100 YD)
          </p>
        </div>
        
        <div>
          <Label htmlFor="category">课程分类 *</Label>
          <Select 
            value={categoryId} 
            onValueChange={setCategoryId}
          >
            <SelectTrigger id="category" className="mt-1">
              <SelectValue placeholder="选择课程分类" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>加载中...</SelectItem>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-data" disabled>暂无分类数据</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="description">课程描述</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1"
            placeholder="详细描述课程内容和学习目标"
          />
        </div>
        
        <ImageUploader
          imageUrl={coverImage}
          setImageUrl={setCoverImage}
          setFormError={setFormError}
          required={false}
          label="课程封面图片"
        />
      </div>
    </div>
  );
} 