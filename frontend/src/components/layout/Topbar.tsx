import Logo from "@/assets/logo.svg?react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

interface TopbarProps {
  userName?: string;
}

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/transactions", label: "Transações" },
  { to: "/categories", label: "Categorias" },
];

export function Topbar({ userName }: TopbarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <Logo className="h-7 w-auto" aria-label="Financy" />

      <nav className="flex items-center gap-6">
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "text-sm font-medium transition-colors",
                isActive
                  ? "text-brand-base font-semibold"
                  : "text-gray-600 hover:text-gray-800"
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div
        aria-label={`Avatar de ${userName ?? "usuário"}`}
        className="flex size-9 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700 select-none"
      >
        {getInitials(userName)}
      </div>
    </header>
  );
}
