"use client"

import { motion } from "framer-motion"

export function StatCard({ icon: Icon, label, value, color = "primary" }) {
  const colorClasses = {
    primary: "bg-blue-50 text-blue-600",
    success: "bg-green-50 text-green-600",
    warning: "bg-yellow-50 text-yellow-600",
    danger: "bg-red-50 text-red-600",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  )
}
