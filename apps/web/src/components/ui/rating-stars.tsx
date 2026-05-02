import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RatingStars({ rating, count, size = "md", className }: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const starSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const starClass = cn(starSizes[size], "text-amber-500 fill-amber-500");
  const emptyStarClass = cn(starSizes[size], "text-muted-foreground/30");

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className={starClass} />
        ))}
        {hasHalfStar && <StarHalf className={starClass} />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className={emptyStarClass} />
        ))}
      </div>
      {rating > 0 && <span className="ml-1.5 font-medium text-foreground">{rating.toFixed(1)}</span>}
      {count !== undefined && (
        <span className="ml-1.5 text-muted-foreground text-xs">
          ({count})
        </span>
      )}
    </div>
  );
}
