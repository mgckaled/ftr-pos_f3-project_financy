import Logo from "@/assets/logo.svg?react";
import { cn } from "@/lib/utils";
import { NavLink, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

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
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

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

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Menu do usuário"
            onMouseEnter={() => setOpen(true)}
            className="flex size-9 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700 select-none hover:bg-gray-300 transition-colors outline-none cursor-pointer"
          >
            {getInitials(userName)}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-44"
          onMouseLeave={() => setOpen(false)}
        >
          <DropdownMenuItem
            className="cursor-pointer gap-2 text-gray-700"
            onClick={() => navigate("/profile")}
          >
            <User className="h-4 w-4 text-gray-500" />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer gap-2 text-danger focus:text-danger focus:bg-red-50"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
