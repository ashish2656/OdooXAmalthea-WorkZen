"use client"

import { motion } from "framer-motion"
import { LogOut, User, Menu } from "lucide-react"
import { useAuth } from "@/app/context/auth-context"
import { useSidebar } from "@/app/context/sidebar-context"
import Link from "next/link"
import { useState } from "react"

export function Navbar() {
  const { user, logout } = useAuth()
  const { toggle } = useSidebar()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 bg-card border-b border-border shadow-sm z-40"
    >
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={toggle} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Menu size={20} />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">WZ</span>
            </div>
            <span className="font-bold text-lg text-foreground">WorkZen</span>
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user?.avatar || "U"}
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.role || "Role"}</p>
            </div>
          </button>

          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg p-2"
            >
              <Link
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-lg transition-colors text-sm"
              >
                <User size={16} />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-lg transition-colors text-sm text-red-600"
              >
                <LogOut size={16} />
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
