import { useTranslations } from "next-intl";

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('Market');
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold my-4 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-foreground/40 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}