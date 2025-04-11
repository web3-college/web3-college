export async function sliceFile(targetFile: File, chunkSize: number = 8) {
    const chunkSizeBytes = chunkSize * 1024 * 1024;
    const chunks = [];
    let start = 0;
    while (start < targetFile.size) {
        const chunk = targetFile.slice(start, start + chunkSizeBytes);
        chunks.push(chunk);
        start += chunkSizeBytes;
    }
    return chunks;
}

export async function getArrayBufFromBlobChunks(chunks: Blob[]): Promise<ArrayBuffer[]> {
    return Promise.all(chunks.map((chunk) => {
        return chunk.arrayBuffer();
    }));
}

// 获取视频文件的时长
export const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = () => {
            // 获取时长（以秒为单位）并解除引用
            window.URL.revokeObjectURL(video.src);
            resolve(video.duration);
        };

        video.onerror = () => {
            reject(new Error('无法获取视频时长'));
        };

        video.src = URL.createObjectURL(file);
    });
};

export const formatDuration = (seconds?: number): string => {
    if (!seconds) return '';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};