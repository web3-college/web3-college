// ES Module 风格导入
const openapi = require('openapi-typescript-codegen');
const path = require('path');
const fs = require('fs');

// 控制台颜色
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

// OpenAPI配置代码，将被插入到index.ts顶部
const openApiConfigCode = `
import { OpenAPI } from './core/OpenAPI';

// 自动配置API基础URL
OpenAPI.BASE = process.env.NEXT_PUBLIC_NEST_URL || '';
`;

// 直接从导出的JSON文件生成
async function generate() {
  console.log(`${colors.bright}${colors.cyan}=== Web3 College API 生成工具 ===${colors.reset}\n`);
  
  //修改为你的后端项目路径 - 使用绝对路径
  const apiPath = path.resolve(process.cwd(), '../web3-college-backend/openapi-spec.json');
  
  console.log(`${colors.yellow}[步骤 1/3]${colors.reset} 检查 OpenAPI 规范文件...`);
  
  if (fs.existsSync(apiPath)) {
    console.log(`${colors.green}✓ 找到规范文件:${colors.reset} ${apiPath}`);
  } else {
    console.log(`${colors.red}✕ 错误: 找不到规范文件:${colors.reset} ${apiPath}`);
    process.exit(1);
  }
  
  console.log(`\n${colors.yellow}[步骤 2/3]${colors.reset} 生成 API 客户端代码...`);

  try {
    await openapi.generate({
      input: apiPath,
      output: path.resolve(__dirname, '../src/api'),
      httpClient: 'fetch', // 可选择 'fetch', 'xhr', 'node' 或 'axios'
      useOptions: true,    // 使用选项对象而非多个参数
      useUnionTypes: true, // 联合类型替代枚举
      exportSchemas: true, // 同时导出接口定义
      exportCore: true,    // 导出核心功能类
      moduleNameFirstTag: true,  // 使用第一个标签作为模块名
      indent: '2',         // 缩进空格数
    });
    
    console.log(`${colors.green}✓ API 客户端代码生成成功!${colors.reset}`);
    
    // 修改index.ts文件，在顶部添加OpenAPI配置
    console.log(`\n${colors.yellow}[步骤 3/3]${colors.reset} 配置 OpenAPI...`);
    
    const indexFilePath = path.resolve(__dirname, '../src/api/index.ts');
    let indexFileContent = fs.readFileSync(indexFilePath, 'utf8');
    
    // 替换文件开头的注释，添加我们的配置代码
    indexFileContent = openApiConfigCode + indexFileContent.replace(/\/\* generated.*?\*\/\s*/s, '');
    
    // 写回文件
    fs.writeFileSync(indexFilePath, indexFileContent, 'utf8');
    
    console.log(`${colors.green}✓ OpenAPI 配置成功添加到 index.ts!${colors.reset}`);
    
    console.log(`\n${colors.bright}${colors.green}=== API 生成完成! ===${colors.reset}`);
    console.log(`${colors.cyan}您现在可以在项目中导入并使用这些 API 客户端。${colors.reset}`);
    console.log(`${colors.yellow}提示: API 已预配置，无需手动初始化，可以直接在任何组件中使用。${colors.reset}`);
  } catch (error) {
    console.log(`\n${colors.red}✕ 错误: API 生成失败${colors.reset}`);
    console.error(error);
    process.exit(1);
  }
}

generate().catch(err => {
  console.log(`\n${colors.red}✕ 发生意外错误:${colors.reset}`);
  console.error(err);
  process.exit(1);
});