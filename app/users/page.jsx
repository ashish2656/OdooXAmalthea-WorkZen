"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { DataTable } from "@/components/data-table"
import { users } from "@/lib/mock-data"
import { motion } from "framer-motion"
import { useState } from "react"
import { Trash2, Edit2 } from "lucide-react"

export default function Users() {
  const [userList, setUserList] = useState(users)
  const [showForm, setShowForm] = useState(false)

  const headers = ["Name", "Email", "Role", "Status", "Actions"]
  const rows = userList.map((user) => [
    user.name,
    user.email,
    user.role,
    <span key={user.id} className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
      {user.status}
    </span>,
    <div key={user.id} className="flex gap-2">
      <button className="p-1 hover:bg-muted rounded transition-colors">
        <Edit2 size={16} />
      </button>
      <button className="p-1 hover:bg-red-50 rounded transition-colors text-red-600">
        <Trash2 size={16} />
      </button>
    </div>,
  ])

  return (
    <LayoutWrapper>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground">Manage users and roles</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {showForm ? "Close" : "Add User"}
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name</label>
              <input
                type="text"
                placeholder="Full name"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Role</label>
              <select className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                <option>Admin</option>
                <option>HR Officer</option>
                <option>Payroll Officer</option>
                <option>Employee</option>
              </select>
            </div>
            <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Add User
            </button>
          </motion.div>
        )}

        <DataTable headers={headers} rows={rows} />
      </motion.div>
    </LayoutWrapper>
  )
}
