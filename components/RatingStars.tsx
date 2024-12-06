import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating?: number;
  onChange?: (value: number) => void;
  editable?: boolean;
}

export default function RatingStars({
  rating = 0,
  onChange,
  editable = false,
}: RatingStarsProps) {
  const handleStarClick = (index: number) => {
    if (editable && onChange) {
      onChange(index + 1);
    }
  };

  const handleStarHover = (event: React.MouseEvent, index: number) => {
    if (!editable) return;

    const stars = event.currentTarget.parentElement?.children;
    if (!stars) return;

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i] as HTMLElement;
      star.style.opacity = i <= index ? "1" : "0.5";
    }
  };

  const handleStarLeave = (event: React.MouseEvent) => {
    if (!editable) return;

    const stars = event.currentTarget.parentElement?.children;
    if (!stars) return;

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i] as HTMLElement;
      star.style.opacity = "1";
    }
  };

  if (!rating) {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    );
  }

  const fullStars = Math.floor(rating) || 0;
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className={cn("flex items-center", editable && "cursor-pointer")}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < fullStars ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
            editable && "transition-opacity duration-200",
          )}
          onClick={() => handleStarClick(i)}
          onMouseEnter={(e) => handleStarHover(e, i)}
          onMouseLeave={handleStarLeave}
        />
      ))}
    </div>
  );
}
