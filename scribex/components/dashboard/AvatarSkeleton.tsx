import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import SpotlightCard from "../SpotlightCard";

export function AvatarSkeleton() {
  return (
    <div className="w-full p-2">
      <div className="flex items-center gap-3">
        {/* Avatar Skeleton */}
        <Skeleton className="h-8 w-8 rounded-lg" />

        {/* Name & Email Skeletons */}
        <div className="flex-1 flex flex-col gap-1">
          <Skeleton className="h-4 w-24 rounded" /> {/* Name */}
          <Skeleton className="h-3 w-32 rounded" /> {/* Email */}
        </div>

        {/* Dropdown Icon Skeleton */}
        <Skeleton className="h-4 w-4 rounded" />
      </div>


    </div>
  );
}
