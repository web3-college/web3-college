import { UploadService } from "@/api";
import { sliceFile } from "@/lib/file";
import { PromisePool } from "@/lib/promise-pool";
import { 
  saveUploadState, 
  getUploadState, 
  removeUploadState, 
  generateFileId, 
  isFileMatch, 
  UploadState 
} from "@/lib/upload-storage";


// 上传进度回调类型
export type ProgressCallback = (progress: number) => void;

// 全局上传控制映射，用于控制特定文件的上传
interface UploadControl {
  shouldContinue: boolean;
}

// 使用文件ID作为键的上传控制映射
const uploadControls: Record<string, UploadControl> = {};

/**
 * 获取上传控制对象
 * @param fileId 文件ID
 * @returns 上传控制对象
 */
function getUploadControl(fileId: string): UploadControl {
  if (!uploadControls[fileId]) {
    uploadControls[fileId] = { shouldContinue: true };
  }
  return uploadControls[fileId];
}

/**
 * 暂停指定文件的上传
 * @param file 文件对象
 */
export function pauseUpload(file: File): void {
  const fileId = generateFileId(file);
  const control = getUploadControl(fileId);
  control.shouldContinue = false;
  console.log(`暂停文件上传: ${file.name} (ID: ${fileId})`);
}

/**
 * 暂停指定ID的上传
 * @param fileId 文件ID
 */
export function pauseUploadById(fileId: string): void {
  const control = getUploadControl(fileId);
  control.shouldContinue = false;
  console.log(`暂停文件上传, ID: ${fileId}`);
}

/**
 * 恢复指定文件的上传
 * @param file 文件对象
 */
export function resumeUpload(file: File): void {
  const fileId = generateFileId(file);
  const control = getUploadControl(fileId);
  control.shouldContinue = true;
  console.log(`恢复文件上传: ${file.name} (ID: ${fileId})`);
}

/**
 * 恢复指定ID的上传
 * @param fileId 文件ID
 */
export function resumeUploadById(fileId: string): void {
  const control = getUploadControl(fileId);
  control.shouldContinue = true;
  console.log(`恢复文件上传, ID: ${fileId}`);
}

/**
 * 清理指定文件的上传控制状态
 * @param file 文件对象 
 */
export function cleanupUploadControl(file: File): void {
  const fileId = generateFileId(file);
  delete uploadControls[fileId];
}

// 处理小文件上传
export const uploadSmallFile = async (file: File, onProgress?: ProgressCallback): Promise<string> => {
  const formData = {
    file
  };
  
  if (onProgress) {
    onProgress(0);
  }
  
  const result = await UploadService.uploadControllerUploadSmallVideo({
    formData
  });
  
  if (result && result.data && result.data.url) {
    if (onProgress) {
      onProgress(100);
    }
    return result.data.url;
  }
  throw new Error("小文件上传失败");
};

// 初始化分片上传
export const initChunkUpload = async (file: File): Promise<{key: string, uploadId: string, directUrl?: string}> => {
  const initResult = await UploadService.uploadControllerInitiateVideoUpload({
    formData:{
      file
    }
  });
  
  if (initResult && initResult.data.uploadId) {
    return {
      key: initResult.data.key,
      uploadId: initResult.data.uploadId
    };
  } else if (initResult && initResult.data.url) {
    // 某些情况下可能直接返回url而不是uploadId
    return {
      key: initResult.data.key || "",
      uploadId: "",
      directUrl: initResult.data.url
    };
  }
  
  throw new Error("初始化分片上传失败");
};

// 上传文件分片
export const uploadFileChunks = async (
  chunks: Blob[], 
  key: string, 
  uploadId: string,
  file: File,
  fileId: string,
  onProgress?: ProgressCallback,
  existingUploadState?: UploadState
): Promise<{ETag: string, PartNumber: number}[]> => {
  // 如果有现有的上传状态，使用它初始化partList
  let partList: {ETag: string, PartNumber: number}[] = [];
  
  // 获取文件的上传控制对象
  const control = getUploadControl(fileId);
  
  if (existingUploadState?.uploadedChunks) {
    partList = [...existingUploadState.uploadedChunks];
    // 如果有进度回调，根据已上传的分片更新进度
    if (onProgress) {
      const progress = Math.round((partList.length / chunks.length) * 100);
      onProgress(progress);
    }
  }
  
  const retryLimit = 3; // 每个分片的最大重试次数
  let totalUploaded = partList.length;
  
  // 创建一个用于跟踪每个分片上传状态的数组，标记已上传的分片
  const chunkStates = chunks.map((_, index) => {
    const partNumber = index + 1;
    const alreadyUploaded = !!partList.find(p => p.PartNumber === partNumber);
    
    return {
      index,
      partNumber,
      uploaded: alreadyUploaded,
      retries: 0
    };
  });
  
  // 上传单个分片的函数
  const uploadChunk = async (chunkState: {index: number, partNumber: number, uploaded: boolean, retries: number}) => {
    // 在每个分片上传前检查是否应该继续
    if (!control.shouldContinue) {
      console.log(`分片 ${chunkState.partNumber} 上传被暂停`);
      return;
    }
    
    if (chunkState.uploaded || chunkState.retries >= retryLimit) {
      return;
    }
    
    try {
      const formData = {
        file: chunks[chunkState.index],
        key,
        uploadId,
        partNumber: chunkState.partNumber
      };
      
      const result = await UploadService.uploadControllerUploadVideoPart({
        formData
      });
      
      // 再次检查是否应该继续
      if (!control.shouldContinue) {
        console.log(`分片 ${chunkState.partNumber} 上传完成，但上传已被取消`);
        return;
      }
      
      if (result && result.data) {
        // 更新或添加到已上传列表
        const existingIndex = partList.findIndex(p => p.PartNumber === chunkState.partNumber);
        if (existingIndex >= 0) {
          partList[existingIndex] = result.data;
        } else {
          partList.push(result.data);
        }
        
        chunkState.uploaded = true;
        totalUploaded++;
        
        // 更新进度
        if (onProgress) {
          const progress = Math.round((totalUploaded / chunks.length) * 100);
          onProgress(progress);
        }
        
        // 保存上传状态到localStorage
        const uploadState: UploadState = {
          fileId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          fileLastModified: file.lastModified,
          key,
          uploadId,
          uploadedChunks: partList,
          chunkSize: chunks[0].size,
          totalChunks: chunks.length,
          createdAt: existingUploadState?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        saveUploadState(uploadState);
      } else {
        throw new Error(`分片 ${chunkState.partNumber} 上传失败`);
      }
    } catch (error) {
      
      console.error(`分片 ${chunkState.partNumber} 上传失败，正在重试 (${chunkState.retries + 1}/${retryLimit})`, error);
      chunkState.retries++;
      
      // 如果未超过重试次数，则重新加入上传队列
      if (chunkState.retries < retryLimit) {
        await uploadChunk(chunkState); // 立即重试该分片
      }
    }
  };
  
  // 并行上传，但限制并发数
  const chunkPool = new PromisePool(4);
  
  for (const chunkState of chunkStates) {
    // 跳过已上传的分片
    if (!chunkState.uploaded) {
      chunkPool.add(() => uploadChunk(chunkState));
    }
  }
  
  await chunkPool.wait();

  if (!control.shouldContinue) {
    throw new Error("上传已被用户取消");
  }
  
  // 检查是否所有分片都上传成功
  const failedChunks = chunkStates.filter(chunk => !chunk.uploaded);
  
  if (failedChunks.length > 0) {
    const failedPartNumbers = failedChunks.map(chunk => chunk.partNumber).join(', ');
    throw new Error(`部分分片上传失败 (分片号: ${failedPartNumbers})，请重试上传`);
  }
  
  // 确保分片列表按照 PartNumber 排序
  partList.sort((a, b) => a.PartNumber - b.PartNumber);
  
  return partList;
};

// 合并已上传的分片
export const mergeUploadedChunks = async (
  key: string, 
  uploadId: string, 
  partList: {ETag: string, PartNumber: number}[], 
  file: File,
  fileId: string
): Promise<string> => {
  // 获取文件的上传控制对象
  const control = getUploadControl(fileId);
  
  // 在合并前再次检查是否应该继续
  if (!control.shouldContinue) {
    throw new Error("上传已被用户取消");
  }
  
  try {
    const mergeResult = await UploadService.uploadControllerCompleteVideoUpload({
      requestBody:{
        key,
        uploadId,
        parts: partList
      }
    });
    
    if (mergeResult && mergeResult.data.url) {
      // 合并成功后删除上传状态
      removeUploadState(fileId);
      
      // 清理上传控制对象
      delete uploadControls[fileId];
      
      return mergeResult.data.url;
    }
    
    throw new Error("合并结果缺少URL");
  } catch (error) {
    console.error(`合并上传失败`, error);
    throw new Error("视频合并失败，请重试上传");
  }
};

// 检查文件是否有未完成的上传
export const checkIncompleteUpload = (file: File): UploadState | undefined => {
  const fileId = generateFileId(file);
  const state = getUploadState(fileId);
  
  if (state && isFileMatch(file, state)) {
    return state;
  }
  
  return undefined;
};

// 处理大文件分片上传
export const uploadLargeFile = async (
  file: File, 
  fileId: string,
  onProgress?: ProgressCallback,
  onUploadStarted?: (key: string, uploadId: string) => void
): Promise<string> => {
  // 获取文件的上传控制对象
  const control = getUploadControl(fileId);
  control.shouldContinue = true; // 初始化时设置为继续状态
  
  // 检查是否有未完成的上传
  const existingUpload = checkIncompleteUpload(file);
  
  let key: string, uploadId: string, chunks: Blob[];
  
  if (existingUpload) {
    console.log(`发现未完成的上传: ${file.name}`);
    key = existingUpload.key;
    uploadId = existingUpload.uploadId;
    
    // 通知上传已开始
    if (onUploadStarted) {
      onUploadStarted(key, uploadId);
    }
    
    // 使用原始分片大小（MB单位）
    const originalChunkSizeMB = existingUpload.chunkSize / (1024 * 1024);
    // 分片文件
    chunks = await sliceFile(file, originalChunkSizeMB);
    
    if (chunks.length !== existingUpload.totalChunks) {
      console.warn(`分片数量不匹配：预期 ${existingUpload.totalChunks}，实际 ${chunks.length}`);
    }
  } else {
    // 在初始化前检查是否应该继续
    if (!control.shouldContinue) {
      throw new Error("上传已被用户取消");
    }
    
    // 正常初始化上传
    const initResult = await initChunkUpload(file);
    key = initResult.key;
    uploadId = initResult.uploadId;
    
    // 如果初始化时直接返回了url，直接使用
    if (initResult.directUrl) {
      if (onProgress) {
        onProgress(100);
      }
      // 清理上传控制对象
      delete uploadControls[fileId];
      return initResult.directUrl;
    }
    
    // 通知上传已开始
    if (onUploadStarted) {
      onUploadStarted(key, uploadId);
    }
    
    // 分片文件
    chunks = await sliceFile(file);
    
    // 初始化上传状态
    const uploadState: UploadState = {
      fileId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileLastModified: file.lastModified,
      key,
      uploadId,
      uploadedChunks: [],
      chunkSize: chunks[0].size,
      totalChunks: chunks.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveUploadState(uploadState);
  }
  
  try {
    // 上传所有分片，失败会自动重试
    const partList = await uploadFileChunks(chunks, key, uploadId, file, fileId, onProgress, existingUpload);
    
    // 只有当所有分片上传成功后，才尝试合并
    return await mergeUploadedChunks(key, uploadId, partList, file, fileId);
  } catch (error) {
    throw error;
  }
};

// 统一的视频上传接口
export const uploadVideoFile = async (
  file: File, 
  onProgress?: ProgressCallback,
  onUploadStarted?: (key: string, uploadId: string) => void
): Promise<string> => {
  if (onProgress) {
    onProgress(0);
  }
  
  // 获取文件ID，用于外部控制
  const fileId = generateFileId(file);
  console.log(`开始上传文件: ${file.name}, fileId: ${fileId}`);
  
  try {
    if (file.size > 50 * 1024 * 1024) {
      return await uploadLargeFile(file, fileId, onProgress, onUploadStarted);
    } else {
      return await uploadSmallFile(file, onProgress);
    }
  } catch (error) {
    console.error('视频上传失败:', error);
    throw error;
  }
}; 