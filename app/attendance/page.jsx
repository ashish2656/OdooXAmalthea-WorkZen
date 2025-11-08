"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { DataTable } from "@/components/data-table"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/auth-context"
import toast from "react-hot-toast"

/**
 * Attendance Page Component
 * Displays employee attendance records in a table format
 * Fetches real employee data from the API
 */
export default function Attendance() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (user) {
      fetchEmployees()
    }
  }, [user])

  const fetchEmployees = async () => {
    try {
      const companyId = user?.role === "Admin" ? user.loginId : user?.companyId || ""
      const response = await fetch(`/api/employees?companyId=${companyId}`)
      const data = await response.json()
      
      if (data.success) {
        setEmployees(data.employees)
      } else {
        toast.error("Failed to load employees")
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
      toast.error("Error loading attendance data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </LayoutWrapper>
    )
  }

  // Table column headers
  const headers = ["ID", "Name", "Department", "Position", "Status", "Check-In", "Check-Out"]
  
  /**
   * Map employee records to table rows
   * Shows current attendance status for each employee
   */
  const rows = employees.map((emp) => [
    emp.id,
    <div key={emp.id} className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
        style={{ backgroundColor: emp.avatarColor || "#8B5CF6" }}
      >
        {emp.avatar}
      </div>
      <span className="font-medium">{emp.name}</span>
    </div>,
    emp.department,
    emp.position,
    <span
      key={emp.id}
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        emp.status === "present" 
          ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
          : "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
      }`}
    >
      {emp.status === "present" ? "Present" : "Absent"}
    </span>,
    emp.checkInTime || "-",
    emp.checkOutTime || "-",
  ])

  return (
    <LayoutWrapper>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
            <p className="text-muted-foreground">Track employee attendance in real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Employees</p>
            <p className="text-3xl font-bold text-foreground">{employees.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">Present Today</p>
            <p className="text-3xl font-bold text-green-600">
              {employees.filter(emp => emp.status === "present").length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-1">Absent Today</p>
            <p className="text-3xl font-bold text-red-600">
              {employees.filter(emp => emp.status !== "present").length}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Attendance Records</h2>
          <DataTable headers={headers} rows={rows} />
        </div>
      </motion.div>
    </LayoutWrapper>
  )
}
