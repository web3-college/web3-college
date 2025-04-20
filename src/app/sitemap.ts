import { MetadataRoute } from 'next'
import { CourseService } from '@/api'

// 支持的语言列表
const languages = ['en', 'zh']

// 所有页面的路径（不包含语言前缀）
const routes = [
  '',                 // 首页
  '/courses',         // 课程页面
  '/market',          // 市场页面
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 基础URL
  const baseUrl = 'https://www.web3-college.org'

  // 创建站点地图项目
  const sitemapItems: MetadataRoute.Sitemap = []

  // 为每种语言生成基本页面URLs
  languages.forEach(lang => {
    routes.forEach(route => {
      // 构建完整URL路径
      const url = `${baseUrl}/${lang}${route}`

      // 为不同类型的页面设置不同的优先级和更新频率
      let priority = 0.7
      let changeFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly'

      // 设置首页更高的优先级
      if (route === '') {
        priority = 1.0
        changeFrequency = 'daily'
      }

      // 添加到站点地图
      sitemapItems.push({
        url,
        lastModified: new Date(),
        changeFrequency,
        priority,
      })
    })
  })

  try {
    // 获取所有课程
    const response = await CourseService.courseControllerFindAllCourses({
      pageSize: 100, // 一次获取较多课程
      isActive: true // 仅包含已激活的课程
    })

    // 如果成功获取课程
    if (response.code === 200 && response.data && Array.isArray(response.data.items)) {
      const courses = response.data.items

      // 为每个课程生成URL
      courses.forEach(course => {
        if (course && course.id) {
          // 为每种语言添加课程详情页
          languages.forEach(lang => {
            sitemapItems.push({
              url: `${baseUrl}/${lang}/courses/${course.id}`,
              lastModified: new Date(course.updatedAt || course.createdAt || new Date()),
              changeFrequency: 'weekly',
              priority: 0.8, // 课程详情页优先级比普通页面高
            })
          })
        }
      })
    }
  } catch (error) {
    console.error('获取课程列表以生成站点地图时出错:', error)
    // 出错时继续使用已有的基础页面URLs
  }

  return sitemapItems
} 