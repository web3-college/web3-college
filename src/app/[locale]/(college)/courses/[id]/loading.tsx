export default function CourseDetailLoading() {
  return (
    <>
      {/* 课程封面占位 */}
      <div className="w-full aspect-[21/9] rounded-xl overflow-hidden mb-8 bg-foreground/5 animate-pulse" />

      {/* 课程标题和分类占位 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-20 h-6 bg-foreground/5 rounded-full animate-pulse" />
          <div className="w-32 h-6 bg-foreground/5 rounded-full animate-pulse" />
        </div>

        <div className="w-3/4 h-10 bg-foreground/5 rounded-lg mb-4 animate-pulse" />
        <div className="w-full h-24 bg-foreground/5 rounded-lg animate-pulse" />
      </div>

      {/* 价格和购买按钮占位 */}
      <div className="flex items-center justify-between p-6 bg-foreground/5 rounded-xl mb-10 animate-pulse">
        <div className="w-32 h-8 bg-foreground/10 rounded-lg" />
        <div className="w-40 h-10 bg-foreground/10 rounded-lg" />
      </div>

      {/* 标签页占位 */}
      <div className="w-full">
        <div className="w-full h-12 bg-foreground/5 rounded-lg mb-8 animate-pulse" />
        <div className="w-full h-64 bg-foreground/5 rounded-xl animate-pulse" />
      </div>
    </>
  );
} 