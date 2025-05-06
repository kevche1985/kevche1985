"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, ShoppingCart, FileText, Package, LayoutDashboard, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/operator/dashboard",
      active: pathname === "/operator/dashboard",
    },
    {
      label: "Users",
      icon: Users,
      href: "/operator/dashboard/users",
      active: pathname === "/operator/dashboard/users",
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      href: "/operator/dashboard/orders",
      active: pathname === "/operator/dashboard/orders",
    },
    {
      label: "Quotes",
      icon: FileText,
      href: "/operator/dashboard/quotes",
      active: pathname === "/operator/dashboard/quotes",
    },
    {
      label: "Products",
      icon: Package,
      href: "/operator/dashboard/products",
      active: pathname === "/operator/dashboard/products",
    },
  ]

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-white text-white border-r transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[250px]",
      )}
    >
      <div className="p-4 flex justify-between items-center border-b bg-gray-800">
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          {!collapsed && <span className="text-xl font-bold">Operator</span>}
          {collapsed && <span className="text-xl font-bold">Op</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-gray-700"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      <ScrollArea className="flex-1 bg-gray-800">
        <div className="p-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 text-sm font-medium p-3 rounded-md hover:bg-gray-700 transition",
                route.active ? "bg-gray-700" : "text-zinc-300",
              )}
            >
              <route.icon size={20} />
              {!collapsed && <span>{route.label}</span>}
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-gray-800">
        {!collapsed && (
          <div className="flex flex-col gap-y-1 text-xs text-zinc-400">
            <div>Logged in as:</div>
            <div className="font-semibold text-white">{user?.name || "Operator"}</div>
            <div>{user?.email || ""}</div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <Users size={20} />
          </div>
        )}
      </div>
    </div>
  )
}
