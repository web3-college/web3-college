/* eslint-disable no-restricted-globals */

declare const hashwasm: any;
declare const importScripts: any;
// Worker上下文
const ctx: Worker = self as any;

importScripts('https://cdn.jsdelivr.net/npm/hash-wasm@4');

// 处理消息
ctx.onmessage = async (event) => {
  if (event.data.type === 'calculate') {
    const file = event.data.file;
    const taskId = event.data.taskId;
    try {
      // 初始化MD5哈希器
      const hasher = await hashwasm.createMD5();

      // 分块读取文件
      const chunkSize = 4 * 1024 * 1024; // 4MB分块
      const fileSize = file.size;

      for (let offset = 0; offset < fileSize; offset += chunkSize) {
        // 进度通知
        ctx.postMessage({
          type: 'progress',
          taskId,
          progress: Math.min(100, Math.round((offset / fileSize) * 100))
        });

        // 读取分块
        const chunk = file.slice(offset, Math.min(offset + chunkSize, fileSize));
        const buffer = await chunk.arrayBuffer();

        // 更新哈希值
        hasher.update(new Uint8Array(buffer));
      }

      // 获取最终哈希值
      const hash = hasher.digest('hex');
      ctx.postMessage({ type: 'complete', taskId, hash });
    } catch (error: any) {
      console.log(error);
      ctx.postMessage({ type: 'error', taskId, error: error.message });
    }
  }
}; 