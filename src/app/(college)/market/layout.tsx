export default function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold my-4 tracking-tight">
            课程列表
          </h1>
          <p className="text-foreground/40 max-w-2xl mx-auto">
            使用yideng代币解锁优质的区块链和Web3开发课程
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}