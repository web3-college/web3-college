export default function MarketLoading() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* 页面标题占位 */}
        <div className="text-center mb-16">
          <div className="w-64 h-12 bg-foreground/5 rounded-lg mx-auto mb-4 animate-pulse" />
          <div className="w-96 h-6 bg-foreground/5 rounded-lg mx-auto animate-pulse" />
        </div>

        {/* 分类过滤器占位 */}
        <div className="mb-10 flex gap-2 justify-center">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="w-20 h-10 bg-foreground/5 rounded-full animate-pulse" />
          ))}
        </div>

        {/* 课程列表占位 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-foreground/5 rounded-xl h-96" />
          ))}
        </div>
      </div>
    </div>
  );
} 