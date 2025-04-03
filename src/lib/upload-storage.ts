// 上传状态接口
export interface UploadState {
  fileId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileLastModified: number;
  key: string;
  uploadId: string;
  uploadedChunks: Array<{
    ETag: string;
    PartNumber: number;
  }>;
  chunkSize: number;
  totalChunks: number;
  createdAt: string;
  updatedAt: string;
}

// 存储前缀，用于区分不同类型的localStorage项
const STORAGE_PREFIX = 'upload_state_';

// 生成文件唯一ID
export function generateFileId(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

// 检查文件是否匹配存储的状态
export function isFileMatch(file: File, state: UploadState): boolean {
  return (
    file.name === state.fileName &&
    file.size === state.fileSize &&
    file.lastModified === state.fileLastModified
  );
}

// 保存上传状态
export function saveUploadState(state: UploadState): void {
  try {
    const storageKey = STORAGE_PREFIX + state.fileId;
    const stateToSave = {
      ...state,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    console.log(`保存上传状态成功: ${state.fileId}`);
  } catch (error) {
    console.error('保存上传状态失败:', error);
  }
}

// 获取上传状态
export function getUploadState(fileId: string): UploadState | undefined {
  try {
    const storageKey = STORAGE_PREFIX + fileId;
    const stateJson = localStorage.getItem(storageKey);
    if (stateJson) {
      return JSON.parse(stateJson) as UploadState;
    }
    return undefined;
  } catch (error) {
    console.error('获取上传状态失败:', error);
    return undefined;
  }
}

// 删除上传状态
export function removeUploadState(fileId: string): void {
  try {
    const storageKey = STORAGE_PREFIX + fileId;
    localStorage.removeItem(storageKey);
    console.log(`删除上传状态成功: ${fileId}`);
  } catch (error) {
    console.error('删除上传状态失败:', error);
  }
}

// 获取所有未完成的上传
export function getAllUploadStates(): UploadState[] {
  try {
    const states: UploadState[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const stateJson = localStorage.getItem(key);
        if (stateJson) {
          states.push(JSON.parse(stateJson) as UploadState);
        }
      }
    }
    return states;
  } catch (error) {
    console.error('获取所有上传状态失败:', error);
    return [];
  }
}

// 清理过期的上传状态（超过5天）
export function cleanupExpiredStates(): void {
  try {
    const now = new Date();
    const expiryTime = 5 * 24 * 60 * 60 * 1000; // 5天的毫秒数
    
    getAllUploadStates().forEach(state => {
      const stateDate = new Date(state.updatedAt);
      if (now.getTime() - stateDate.getTime() > expiryTime) {
        removeUploadState(state.fileId);
        console.log(`清理过期上传状态: ${state.fileId}`);
      }
    });
  } catch (error) {
    console.error('清理过期上传状态失败:', error);
  }
} 