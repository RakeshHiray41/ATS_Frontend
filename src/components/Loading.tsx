import { SkeletonTable, SkeletonCards } from "./Skeleton";

interface LoadingProps {
  label?: string;
  fullScreen?: boolean;
  variant?: "spinner" | "table" | "cards";
  rows?: number;
  columns?: number;
  cardCount?: number;
}

export default function Loading({
  label = "Loading...",
  fullScreen = false,
  variant = "spinner",
  rows = 5,
  columns = 5,
  cardCount = 3,
}: LoadingProps) {
  if (variant === "table") return <SkeletonTable rows={rows} columns={columns} />;
  if (variant === "cards") return <SkeletonCards count={cardCount} />;

  return (
    <div
      className={
        fullScreen
          ? "flex min-h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950"
          : "flex w-full items-center justify-center py-16"
      }
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-indigo-200 border-t-indigo-600" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}