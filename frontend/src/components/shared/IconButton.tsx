import { type ButtonHTMLAttributes, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive";
  icon?: LucideIcon;
  children?: ReactNode;
}

export function IconButton({
  variant = "default",
  icon: Icon,
  className,
  children,
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md border border-gray-200 bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-base cursor-pointer",
        variant === "default" &&
          "text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed",
        variant === "destructive" &&
          "text-danger hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" /> : children}
    </button>
  );
}
