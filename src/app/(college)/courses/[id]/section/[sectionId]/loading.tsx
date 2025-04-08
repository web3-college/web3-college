export default function SectionLoading() {
  return (
    <div className="p-4 md:p-8 flex flex-col animate-pulse">
      {/* 顶部导航 */}
      <div className="mb-6">
        <div className="h-10 w-32 bg-foreground/5 rounded-md"></div>
      </div>

      {/* 视频播放区域 */}
      <div className="mb-8 w-full">
        <div className="w-full aspect-video bg-foreground/5 rounded-lg"></div>
      </div>

      {/* 章节信息 */}
      <div className="mb-8">
        <div className="h-8 w-64 bg-foreground/5 rounded-md mb-3"></div>
        <div className="h-4 w-24 bg-foreground/5 rounded-md mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-foreground/5 rounded-md"></div>
          <div className="h-4 w-3/4 bg-foreground/5 rounded-md"></div>
          <div className="h-4 w-1/2 bg-foreground/5 rounded-md"></div>
        </div>
      </div>

      {/* 章节导航 */}
      <div className="flex justify-between mt-auto pt-6 border-t border-white/[0.05]">
        <div className="h-10 w-28 bg-foreground/5 rounded-md"></div>
        <div className="h-10 w-28 bg-foreground/5 rounded-md"></div>
      </div>
    </div>
  );
} 