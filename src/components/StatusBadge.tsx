interface StatusBadgeProps {
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  applied: "bg-slate-100 text-slate-700 ring-slate-200",
  shortlisted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  interview_scheduled: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  hired: "bg-amber-50 text-amber-700 ring-amber-200",
};

function formatLabel(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_STYLES[status?.toLowerCase()] ?? "bg-slate-100 text-slate-700 ring-slate-200";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${style}`}
    >
      {formatLabel(status ?? "unknown")}
    </span>
  );
}
