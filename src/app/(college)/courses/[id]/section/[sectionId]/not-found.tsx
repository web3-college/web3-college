import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

export default function SectionNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">内容未找到</h1>
      <p className="text-lg text-foreground/60 mb-8 max-w-md">
        很抱歉，您要查看的课程章节似乎不存在或已被删除。
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/market">
            <HomeIcon className="mr-2 h-4 w-4" />
            浏览课程
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    </div>
  );
} 