import { baseUrl } from "./base";

/**
 * 上传图片到服务器
 * @param formData 包含文件的FormData对象
 * @returns 上传结果
 */
export async function uploadImage(formData: FormData) {
  const response = await fetch(`${baseUrl}/upload/image`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('图片上传失败');
  }
  
  return await response.json();
}

/**
 * 上传视频到服务器
 * @param formData 包含文件的FormData对象
 * @returns 上传结果
 */
export async function uploadVideo(formData: FormData) {
  const response = await fetch(`${baseUrl}/upload/video/small`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('视频上传失败');
  }
  
  return await response.json();
}

/**
 * 初始化大视频分片上传
 * @param fileName 原始文件名
 * @param contentType 文件MIME类型
 * @returns 上传初始化结果
 */
export async function initVideoMultipartUpload(file: Blob) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${baseUrl}/upload/video/init`, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('初始化视频上传失败');
  }
  
  return await response.json();
}

/**
 * 取消分片上传
 * @param key 文件唯一标识
 * @param uploadId 上传ID
 */
export async function abortVideoUpload(key: string, uploadId: string) {
  try {
    await fetch(`${baseUrl}/upload/video/abort`, {
      method: 'POST',
      body: JSON.stringify({ key, uploadId })
    });
  } catch (error) {
    console.error('取消上传失败:', error);
  }
}

/**
 * 上传视频分片
 * @param formData 包含分片信息的FormData对象
 * @returns 分片上传结果
 */
export async function uploadVideoChunk(formData: FormData) {
  const response = await fetch(`${baseUrl}/upload/video/part`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('视频分片上传失败');
  }
  
  return await response.json();
}

/**
 * 合并视频分片
 * @param fileName 原始文件名
 * @param totalChunks 总分片数
 * @param sectionIndex 章节索引
 * @returns 合并结果
 */
export async function completeVideoUpload(key: string, uploadId: string, parts: {ETag: string, PartNumber: number}[]) {
  const response = await fetch(`${baseUrl}/upload/video/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      key,
      uploadId,
      parts
    })
  });
  
  if (!response.ok) {
    throw new Error('视频分片合并失败');
  }
  
  return await response.json();
}

export async function getUploadStatus(key: string, uploadId: string) {
  const response = await fetch(`${baseUrl}/upload/video/parts?key=${key}&uploadId=${uploadId}`);
  if (!response.ok) {
    throw new Error('获取上传状态失败');
  }
  return await response.json();
}
