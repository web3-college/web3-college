import { OpenAPI } from './core/OpenAPI';

/**
 * 配置API客户端的基础设置
 * @param options 配置选项
 */
export function configureAPI(options: {
  /**
   * API基础URL
   * 默认使用环境变量中的NEXT_PUBLIC_NEST_URL
   */
  baseUrl?: string;
  
  /**
   * 请求是否带上凭证（cookies）
   */
  withCredentials?: boolean;
  
  /**
   * 请求凭证类型
   * - include: 跨域请求时发送cookie
   * - same-origin: 只有同源请求时发送cookie
   * - omit: 不发送cookie
   */
  credentials?: 'include' | 'omit' | 'same-origin';
  
  /**
   * API版本
   */
  version?: string;
  
  /**
   * 认证令牌
   * 可以是静态字符串或返回令牌的函数
   */
  token?: string | (() => Promise<string>);
  
  /**
   * 自定义请求头
   */
  headers?: Record<string, string> | (() => Promise<Record<string, string>>);
  
  /**
   * 路径编码函数
   */
  encodePath?: (path: string) => string;
}) {
  // 设置基础URL
  OpenAPI.BASE = options.baseUrl || '';
  
  // 设置认证相关
  if (options.withCredentials !== undefined) {
    OpenAPI.WITH_CREDENTIALS = options.withCredentials;
  }
  
  if (options.credentials) {
    OpenAPI.CREDENTIALS = options.credentials;
  }
  
  // 设置版本
  if (options.version) {
    OpenAPI.VERSION = options.version;
  }
  
  // 设置令牌
  if (options.token) {
    if (typeof options.token === 'string') {
      OpenAPI.TOKEN = options.token;
    } else {
      // 转换为API期望的Resolver类型
      OpenAPI.TOKEN = async () => {
        const tokenFn = options.token as () => Promise<string>;
        return await tokenFn();
      };
    }
  }
  
  // 设置请求头
  if (options.headers) {
    if (typeof options.headers === 'function') {
      // 转换为API期望的Resolver类型
      OpenAPI.HEADERS = async () => {
        const headersFn = options.headers as () => Promise<Record<string, string>>;
        return await headersFn();
      };
    } else {
      OpenAPI.HEADERS = options.headers;
    }
  }
  
  // 设置路径编码
  if (options.encodePath) {
    OpenAPI.ENCODE_PATH = options.encodePath;
  }
}

/**
 * 设置授权令牌
 * @param token 授权令牌
 */
export function setAuthToken(token: string) {
  OpenAPI.TOKEN = token;
}

/**
 * 清除授权令牌
 */
export function clearAuthToken() {
  OpenAPI.TOKEN = undefined;
}

/**
 * 添加自定义请求头
 * @param headers 请求头对象
 */
export function addCustomHeaders(headers: Record<string, string>) {
  OpenAPI.HEADERS = {
    ...(OpenAPI.HEADERS as Record<string, string> || {}),
    ...headers
  };
} 