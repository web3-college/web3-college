import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseSkeletonsProps {
  count?: number;
}

export function CourseSkeletons({ count = 6 }: CourseSkeletonsProps) {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="transform transition-all duration-300">
          <Card className="h-full overflow-hidden border border-white/[0.05] bg-gradient-to-br from-background/80 to-background/40">
            <Skeleton className="w-full aspect-video" />
            <div className="p-6 space-y-4">
              <Skeleton className="h-7 w-3/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="flex items-center justify-between pt-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-9 w-28 rounded-full" />
              </div>
            </div>
          </Card>
        </div>
      ))}
    </>
  );
} 