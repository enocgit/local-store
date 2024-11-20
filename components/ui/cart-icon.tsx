import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

type CartIconProps = {
  count: number;
  isLink?: boolean;
  className?: string;
};

export function CartIcon({ count, isLink = true, className }: CartIconProps) {
  return isLink ? (
    <Link href="/cart" className={className}>
      <CartIconButton count={count} isLink />
    </Link>
  ) : (
    <div className={className}>
      <CartIconButton count={count} isLink={false} />
    </div>
  );
}

function CartIconButton({
  count,
  isLink,
}: {
  count: number;
  isLink?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("relative hover:bg-gray-100", {
        "w-5 gap-0": !isLink,
      })}
    >
      <ShoppingCart className="h-5 w-5" />
      <span
        className={cn(
          "absolute -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white",
          {
            "-right-1": isLink,
            "-left-2": !isLink,
          },
        )}
      >
        {count}
      </span>
    </Button>
  );
}
