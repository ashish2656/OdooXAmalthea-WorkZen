"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { DataTable } from "@/components/data-table"
import { attendanceRecords } from "@/lib/mock-data"
import { motion } from "framer-motion"
import { useState } from "react"

export default function Attendance() {
  const [records, setRecords] = useState(attendanceRecords)
  const [markingAttendance, setMarkingAttendance] = useState(false)

  const headers = ["Name", "Date", "Status", "Check-In", "Check-Out"]
  const rows = records.map((record) => [
    record.employeeName,
    record.date,
    <span
      key={record.id}
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        record.status === "Present" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      }`}
    >
      {record.status}
    </span>,
    record.checkIn || "-",
    record.checkOut || "-",
  ])

  const handleMarkAttendance = () => {
    setMarkingAttendance(!markingAttendance)
  }

  return (
    <LayoutWrapper>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
            <p className="text-muted-foreground">Track employee attendance</p>
          </div>
          <button
            onClick={handleMarkAttendance}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {markingAttendance ? "Done" : "Mark Attendance"}
          </button>
        </div>

        {markingAttendance && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <p className="text-blue-700">Attendance marked for today.</p>
          </motion.div>
        )}

        <DataTable headers={headers} rows={rows} />
      </motion.div>
    </LayoutWrapper>
  )
}
