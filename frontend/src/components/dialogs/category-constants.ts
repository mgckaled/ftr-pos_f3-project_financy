import type { LucideIcon } from "lucide-react"
import {
  BookOpen, Briefcase, Car, ClipboardList, Coffee,
  Dumbbell, Gift, Heart, Home, Newspaper, PiggyBank,
  ShoppingBag, ShoppingBasket, ShoppingCart, Ticket, Utensils,
} from "lucide-react"

export const CATEGORY_ICONS: { icon: LucideIcon; key: string }[] = [
  { icon: Briefcase,      key: "briefcase" },
  { icon: Car,            key: "car"       },
  { icon: Heart,          key: "heart"     },
  { icon: PiggyBank,      key: "piggybank" },
  { icon: ShoppingCart,   key: "cart"      },
  { icon: Ticket,         key: "ticket"    },
  { icon: ShoppingBag,    key: "bag"       },
  { icon: Utensils,       key: "utensils"  },
  { icon: Coffee,         key: "coffee"    },
  { icon: Home,           key: "home"      },
  { icon: Gift,           key: "gift"      },
  { icon: Dumbbell,       key: "dumbbell"  },
  { icon: BookOpen,       key: "book"      },
  { icon: ShoppingBasket, key: "basket"    },
  { icon: Newspaper,      key: "newspaper" },
  { icon: ClipboardList,  key: "clipboard" },
]

export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  CATEGORY_ICONS.map(({ key, icon }) => [key, icon])
)

export const CATEGORY_COLORS = [
  { key: "green",  bg: "bg-green-500"  },
  { key: "blue",   bg: "bg-blue-500"   },
  { key: "purple", bg: "bg-purple-500" },
  { key: "pink",   bg: "bg-pink-500"   },
  { key: "red",    bg: "bg-red-500"    },
  { key: "orange", bg: "bg-orange-500" },
  { key: "yellow", bg: "bg-yellow-500" },
]

export const CATEGORY_COLOR_BG: Record<string, string> = {
  green:  "bg-green-100 text-green-600",
  blue:   "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  pink:   "bg-pink-100 text-pink-600",
  red:    "bg-red-100 text-red-600",
  orange: "bg-orange-100 text-orange-600",
  yellow: "bg-yellow-100 text-yellow-600",
}

export const DEFAULT_ICON = "briefcase"
export const DEFAULT_COLOR = "green"
