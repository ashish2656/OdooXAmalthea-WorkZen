"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { DataTable } from "@/components/data-table"
import { leaveRequests } from "@/lib/mock-data"
import { motion } from "framer-motion"
import { useState } from "react"

export default function Leave() {
  const [leaves, setLeaves] = useState(leaveRequests)
  const [showForm, setShowForm] = useState(false)

  const headers = ["Name", "Type", "Start Date", "End Date", "Status", "Reason"]
  const rows = leaves.map((leave) => [
    leave.employeeName,
    leave.type,
    leave.startDate,
    leave.endDate,
    <span
      key={leave.id}
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        leave.status === "Approved"
          ? "bg-green-50 text-green-700"
          : leave.status === "Pending"
            ? "bg-yellow-50 text-yellow-700"
            : "bg-red-50 text-red-700"
      }`}
    >
      {leave.status}
    </span>,
    leave.reason,
  ])

  return (
    <LayoutWrapper>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leave Management</h1>
            <p className="text-muted-foreground">Manage employee leaves</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {showForm ? "Close" : "Request Leave"}
          </button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Leave Type</label>
              <select className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                <option>Sick Leave</option>
                <option>Vacation</option>
                <option>Personal Leave</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Reason</label>
              <textarea
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                rows={3}
              />
            </div>
            <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Submit Request
            </button>
          </motion.div>
        )}

        <DataTable headers={headers} rows={rows} />
      </motion.div>
    </LayoutWrapper>
  )
}
