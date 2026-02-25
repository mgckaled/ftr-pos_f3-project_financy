import { cn } from "@/lib/utils";

type TagColor =
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "gray";

interface TagProps {
  label: string;
  color?: TagColor;
  className?: string;
}

const colorStyles: Record<TagColor, string> = {
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  pink: "bg-pink-100 text-pink-700",
  red: "bg-red-100 text-red-700",
  orange: "bg-orange-100 text-orange-700",
  yellow: "bg-yellow-100 text-yellow-700",
  green: "bg-green-100 text-green-700",
  gray: "bg-gray-200 text-gray-600",
};

export function Tag({ label, color = "gray", className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colorStyles[color],
        className
      )}
    >
      {label}
    </span>
  );
}
