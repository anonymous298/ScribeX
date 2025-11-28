import { Skeleton } from "@/components/ui/skeleton";
import SpotlightCard from "../SpotlightCard";

export function NoteCardSkeleton() {

    const items = Array.from({ length: 5 }).map((_, i) => i);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {items.map((item) => {
            return (
                <SpotlightCard
                    key={item}
                    className="group relative bg-white dark:bg-neutral-900 p-4 md:p-6 shadow-md flex flex-col gap-6 justify-between min-h-[160px] md:min-h-[200px] w-full rounded-xl"
                    spotlightColor="rgba(0, 229, 255, 0.2)"
                >
                    {/* Card Header */}
                    <div className="w-full flex justify-between items-center">
                        <Skeleton className="w-5 h-5 rounded" />
                        <Skeleton className="w-5 h-5 rounded" />
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-6 md:h-8 w-3/4 md:w-2/3 rounded" />
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-full rounded" />
                        <Skeleton className="h-4 w-5/6 rounded" />
                    </div>

                    {/* Card Footer */}
                    <div className="w-full flex justify-between items-center mt-auto">
                        <Skeleton className="h-4 w-16 rounded" />
                        <Skeleton className="h-5 w-5 rounded-full" />
                    </div>
                </SpotlightCard>
            )
        })}
    </div>
  );
}
