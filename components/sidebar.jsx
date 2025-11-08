"use client"

import { motion } from "framer-motion"
import { useAuth } from "@/app/context/auth-context"
import { useSidebar } from "@/app/context/sidebar-context"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Clock, Banknote, BarChart3, Settings } from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Clock, label: "Attendance", href: "/attendance" },
  { icon: Clock, label: "Leave Management", href: "/leave" },
  { icon: Banknote, label: "Payroll", href: "/payroll" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
]

export function Sidebar() {
  const { user } = useAuth()
  const { isOpen } = useSidebar()
  const pathname = usePathname()

  const adminOnlyItems = [
    { icon: Users, label: "Users", href: "/users" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  const visibleAdminItems = user?.role === "Admin" ? adminOnlyItems : []
  const allMenuItems = [...menuItems, ...visibleAdminItems]

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border shadow-sm overflow-y-auto z-30"
    >
      <nav className="p-4 space-y-2">
        {allMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </motion.aside>
  )
}
