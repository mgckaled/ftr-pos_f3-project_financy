import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionTypeProps {
  type: "income" | "expense";
  className?: string;
}

export function TransactionType({ type, className }: TransactionTypeProps) {
  const isIncome = type === "income";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium",
        isIncome ? "text-success" : "text-danger",
        className
      )}
    >
      {isIncome ? (
        <ArrowUpCircle size={16} aria-hidden="true" />
      ) : (
        <ArrowDownCircle size={16} aria-hidden="true" />
      )}
      {isIncome ? "Entrada" : "Saída"}
    </span>
  );
}
