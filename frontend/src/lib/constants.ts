import type { TagColor } from "@/components/shared/Tag";

export const TAG_COLORS: TagColor[] = [
  "blue",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
];

export function getTagColor(index: number): TagColor {
  return TAG_COLORS[index % TAG_COLORS.length];
}

export function getInitials(name?: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}
