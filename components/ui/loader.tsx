import { cn } from "@/lib/utils";

export default function Loader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white",
        className,
      )}
    />
  );
}
