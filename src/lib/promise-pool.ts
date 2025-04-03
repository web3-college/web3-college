export class PromisePool {
  private running = 0;
  private queue: Array<() => Promise<any>> = [];
  private results: any[] = [];
  private errors: Error[] = [];

  constructor(
    private readonly concurrency: number,
    private readonly timeout?: number
  ) {}

  // 创建一个单任务队列的静态方法
  static createSingleTaskQueue(timeout?: number): PromisePool {
    return new PromisePool(1, timeout);
  }

  add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await this.executeWithTimeout(fn);
          this.results.push(result);
          resolve(result);
        } catch (error) {
          this.errors.push(error as Error);
          reject(error);
        } finally {
          this.running--;
          this.processQueue();
        }
      });

      this.processQueue();
    });
  }

  // 检查是否有任务正在执行或等待执行
  isProcessing(): boolean {
    return this.running > 0 || this.queue.length > 0;
  }

  private async executeWithTimeout<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.timeout) {
      return fn();
    }

    return Promise.race([
      fn(),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Promise timeout')), this.timeout)
      ),
    ]);
  }

  private processQueue(): void {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        this.running++;
        task();
      }
    }
  }

  async wait(): Promise<{
    results: any[];
    errors: Error[];
  }> {
    while (this.running > 0 || this.queue.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return {
      results: this.results,
      errors: this.errors,
    };
  }
}
