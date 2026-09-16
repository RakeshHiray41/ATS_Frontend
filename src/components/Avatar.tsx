import { useState } from "react";
import { User as UserIcon } from "lucide-react";

// A fixed, pleasant palette — colors chosen from the same design tokens
// used elsewhere in the app so avatars never clash with the UI.
const PALETTE = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
];

function colorFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-28 w-28 text-2xl",
  xl: "h-36 w-36 text-3xl",
} as const;

interface AvatarProps {
  name?: string;
  photoUrl?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}

export default function Avatar({ name, photoUrl, size = "md", className = "" }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const initial = name?.trim()?.charAt(0)?.toUpperCase();
  const colorClasses = colorFor(name || "?");
  const showPhoto = photoUrl && !errored;

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold ${SIZES[size]} ${
        showPhoto ? "" : colorClasses
      } ${className}`}
    >
      {showPhoto ? (
        <img
          src={photoUrl}
          alt={name ?? "Avatar"}
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : initial ? (
        initial
      ) : (
        <UserIcon size={size === "lg" || size === "xl" ? 32 : 16} />
      )}
    </div>
  );
}