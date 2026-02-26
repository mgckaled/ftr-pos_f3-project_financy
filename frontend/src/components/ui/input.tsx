import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-800 outline-none transition-colors",
        "placeholder:text-gray-400",
        "focus:border-brand-base",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
        "aria-invalid:border-danger",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  )
}

export { Input }
