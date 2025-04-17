// MD5计算器配置
const MAX_WORKERS = 4; // 最大worker数量

// Worker状态管理
interface WorkerInfo {
  worker: Worker;
  busy: boolean;
  taskId: string | number | null;
}

// 任务队列
let workers: WorkerInfo[] = [];
let calculationQueue: Array<{
  file: File;
  resolve: (hash: string) => void;
  reject: (error: Error) => void;
  taskId: string | number;
}> = [];

// 初始化Worker
const createWorker = (): WorkerInfo => {
  // 检查浏览器环境
  if (typeof window === 'undefined') {
    return {
      worker: {} as Worker,
      busy: false,
      taskId: null
    };
  }

  try {
    // 创建Worker
    const worker = new Worker(new URL('./md5.worker.ts', import.meta.url));
    console.log(worker);
    const workerInfo: WorkerInfo = {
      worker,
      busy: false,
      taskId: null
    };

    // 处理Worker消息
    worker.onmessage = (e: MessageEvent) => {
      const { type, hash, progress, error, taskId } = e.data;

      // 找出当前任务
      const taskIndex = calculationQueue.findIndex(task => task.taskId === taskId);
      if (taskIndex === -1) return;

      const task = calculationQueue[taskIndex];

      if (type === 'progress') {
        // 可以在这里处理进度通知
        console.log(`MD5计算进度 [任务${taskId}]: ${progress}%`);
      } else if (type === 'complete') {
        // 完成任务，从队列中移除
        calculationQueue.splice(taskIndex, 1);
        task.resolve(hash);

        // 标记worker为空闲
        const workerIndex = workers.findIndex(w => w.taskId === taskId);
        if (workerIndex !== -1) {
          workers[workerIndex].busy = false;
          workers[workerIndex].taskId = null;
        }

        // 处理下一个任务
        processQueue();
      } else if (type === 'error') {
        // 错误处理，从队列中移除
        calculationQueue.splice(taskIndex, 1);
        task.reject(new Error(error));

        // 标记worker为空闲
        const workerIndex = workers.findIndex(w => w.taskId === taskId);
        if (workerIndex !== -1) {
          workers[workerIndex].busy = false;
          workers[workerIndex].taskId = null;
        }

        // 处理下一个任务
        processQueue();
      }
    };

    // 处理错误
    worker.onerror = (error: ErrorEvent) => {
      // 查找此worker正在处理的任务
      const workerIndex = workers.findIndex(w => w.worker === worker);
      if (workerIndex !== -1) {
        const taskId = workers[workerIndex].taskId;
        if (taskId !== null) {
          const taskIndex = calculationQueue.findIndex(task => task.taskId === taskId);
          if (taskIndex !== -1) {
            const task = calculationQueue[taskIndex];
            calculationQueue.splice(taskIndex, 1);
            task.reject(new Error(`Worker错误: ${error || '未知错误'}`));
          }

          // 标记worker为空闲
          workers[workerIndex].busy = false;
          workers[workerIndex].taskId = null;

          // 处理下一个任务
          processQueue();
        }
      }
    };

    return workerInfo;
  } catch (error) {
    console.error('创建Worker时出错:', error);
    // 返回一个虚拟的Worker信息对象
    return {
      worker: {} as Worker,
      busy: false,
      taskId: null
    };
  }
};

// 确保有足够的worker
const ensureWorkers = () => {
  // 仅在客户端环境中创建worker
  if (typeof window === 'undefined') return;

  // 创建新worker直到达到最大数量
  while (workers.length < MAX_WORKERS) {
    workers.push(createWorker());
  }
};

// 处理队列中的任务
const processQueue = () => {
  if (calculationQueue.length === 0 || typeof window === 'undefined') return;

  // 确保有足够的worker
  ensureWorkers();

  // 遍历所有任务，找出未分配的任务
  for (let i = 0; i < calculationQueue.length; i++) {
    const task = calculationQueue[i];

    // 检查此任务是否已分配给worker（通过检查是否有worker的taskId与此任务匹配）
    const isTaskAssigned = workers.some(worker => worker.taskId === task.taskId && worker.busy);

    // 如果任务未分配，则寻找空闲worker来处理
    if (!isTaskAssigned) {
      // 查找空闲的worker
      const availableWorker = workers.find(worker => !worker.busy);
      if (!availableWorker) break; // 没有空闲worker，退出循环

      // 标记worker为忙碌状态，并分配此任务
      availableWorker.busy = true;
      availableWorker.taskId = task.taskId;

      // 发送文件到Worker
      try {
        availableWorker.worker.postMessage({
          type: 'calculate',
          file: task.file,
          taskId: task.taskId
        });
      } catch (error) {
        console.error('发送消息到Worker时出错:', error);
        // 重置worker状态
        availableWorker.busy = false;
        availableWorker.taskId = null;
      }
    }
  }
};

// 清理所有Worker资源
export const cleanupWorkers = () => {
  if (typeof window === 'undefined') return;

  for (const { worker } of workers) {
    try {
      worker.terminate();
    } catch (error) {
      console.error('终止Worker时出错:', error);
    }
  }

  workers = [];
  calculationQueue = [];
};

// 计算文件的MD5哈希值
export const calculateMd5 = async (file: File): Promise<string> => {
  // 如果不在浏览器环境中，返回一个占位符哈希值
  if (typeof window === 'undefined') {
    return Promise.resolve('server-side-placeholder-hash');
  }
  console.log('calculateMd5');
  return new Promise((resolve, reject) => {
    // 创建新任务，确保taskId唯一
    const taskId = Date.now() + Math.floor(Math.random() * 10000000) + '_' + Math.random().toString(36).substr(2, 9);
    calculationQueue.push({
      file,
      resolve,
      reject,
      taskId
    });

    // 处理队列
    processQueue();
  });
}; 