# Web3 College

基于Next.js构建的Web3教育平台，提供在线课程学习和Web3知识分享。

## 项目设置

### 1. 安装依赖

```bash
# 使用npm
npm install

# 或使用yarn
yarn

# 或使用pnpm
pnpm install
```

### 2. 配置环境变量

在项目根目录创建`.env`文件，添加以下配置：

```
# API服务器地址
NEXT_PUBLIC_NEST_URL=http://localhost:3001

# 项目ID（用于WalletConnect等）
NEXT_PUBLIC_PROJECT_ID=your_project_id
```

### 3. 生成API客户端

项目使用OpenAPI自动生成API客户端代码，确保后端已启动并暴露API文档，然后运行：

```bash
npm run gen:api
```

这将根据后端API规范生成TypeScript客户端代码，生成的代码位于`src/api`目录。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看项目。

## 项目结构

```
web3-college/
├── public/          # 静态资源
├── scripts/         # 脚本工具
│   └── gen-api.js   # API生成脚本
├── src/
│   ├── api/         # 自动生成的API客户端
│   ├── app/         # 应用页面
│   ├── components/  # 组件库
│   └── types/       # TypeScript类型定义
├── .env             # 环境变量
└── next.config.js   # Next.js配置
```

## 开发指南

### API调用

API客户端已配置好，可以直接在组件中导入使用：

```typescript
// 在服务端组件中
import { CourseService } from '@/api';

// 获取课程列表
const courses = await CourseService.findAllCourses();
```

### 文件上传

项目支持图片和视频上传，示例：

```typescript
import { UploadService } from '@/api';

// 上传图片
const uploadImage = async (file) => {
  const data = await UploadService.uploadControllerUploadImage({
    formData: { file }
  });
  return data;
};
```

## 生产部署

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm run start
```