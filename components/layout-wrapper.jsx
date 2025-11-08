"use client"

import { Navbar } from "./navbar"
import { Sidebar } from "./sidebar"
import { useSidebar } from "@/app/context/sidebar-context"
import { motion } from "framer-motion"

export function LayoutWrapper({ children }) {
  const { isOpen } = useSidebar()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <motion.main
          animate={{ marginLeft: isOpen ? 256 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-6 md:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
