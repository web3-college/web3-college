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
