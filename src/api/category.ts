import { baseUrl } from "./base";

export type CategoryData = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  order?: number;
  isActive: boolean;
}

/**
 * 获取课程分类列表
 * @param isActive 是否只获取启用状态的分类，默认为true
 * @returns 分类数据
 */
export async function getCategories(isActive: boolean = true) {
  try {
    const response = await fetch(`${baseUrl}/category?isActive=${isActive}`);
    if (!response.ok) {
      throw new Error(`获取分类失败：${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("获取分类API错误:", error);
  }
}
