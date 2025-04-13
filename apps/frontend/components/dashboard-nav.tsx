"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, Home, MessageSquare, Settings, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Agents",
    href: "/dashboard/agents",
    icon: Bot,
  },
  {
    title: "Chats",
    href: "/dashboard/chats",
    icon: MessageSquare,
  },
  {
    title: "Community",
    href: "/dashboard/community",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="group border-r bg-background w-16 hover:w-64 transition-all duration-300 ease-in-out overflow-hidden">
      <div className="flex h-full flex-col py-4">
        <nav className="flex flex-col gap-2 px-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 px-3",
                  pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.title}
                </span>
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
