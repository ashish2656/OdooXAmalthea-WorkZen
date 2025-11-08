"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/auth-context"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Search, Plane, Clock, LogIn, LogOut as LogOutIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast, { Toaster } from "react-hot-toast"

export default function Dashboard() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [currentTime, setCurrentTime] = useState("")
  const [loading, setLoading] = useState(true)

  // ✅ Fetch employees only after user loads
  useEffect(() => {
    if (user?.loginId) {
      fetchEmployees()
    }
  }, [user])

  // Re-fetch employees when attendance is updated elsewhere (navbar / attendance page)
  useEffect(() => {
    const handler = (e) => {
      console.log("attendanceUpdated event received", e.detail)
      fetchEmployees()
    }

    window.addEventListener("attendanceUpdated", handler)
    return () => window.removeEventListener("attendanceUpdated", handler)
  }, [user])
  // ✅ Update time every second for accuracy
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/employees?companyId=${user?.loginId || ""}`)
      
      // Check if response is OK
      if (!response.ok) {
        console.error("API response not OK:", response.status, response.statusText)
        setEmployees([])
        setLoading(false)
        return
      }
      
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON:", contentType)
        setEmployees([])
        setLoading(false)
        return
      }
      
      const data = await response.json()
      console.log("Fetched employees:", data)
      
      if (data.success && Array.isArray(data.employees)) {
        setEmployees(data.employees)
        console.log("Set employees:", data.employees.length, "employees")
      } else {
        console.warn("Invalid employee data format:", data)
        setEmployees([])
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async (employeeId) => {
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "check-in",
          id: employeeId,
          checkInTime: currentTime,
        }),
      })
      const data = await response.json()
      if (data.success) {
        toast.success("Checked in successfully!", {
          duration: 3000,
          position: "top-center",
          icon: "✅",
        })
        fetchEmployees()
      } else {
        toast.error("Failed to check in")
      }
    } catch (error) {
      console.error("Error checking in:", error)
      toast.error("Error checking in")
    }
  }

  const handleCheckOut = async (employeeId) => {
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "check-out",
          id: employeeId,
          checkOutTime: currentTime,
        }),
      })
      const data = await response.json()
      if (data.success) {
        toast.success("Checked out successfully!", {
          duration: 3000,
          position: "top-center",
          icon: "✅",
        })
        fetchEmployees()
      } else {
        toast.error("Failed to check out")
      }
    } catch (error) {
      console.error("Error checking out:", error)
      toast.error("Error checking out")
    }
  }

  const filteredEmployees = employees.filter((emp) =>
    emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.position?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusIndicator = (status) => {
    switch (status) {
      case "present":
        return <div className="w-3 h-3 rounded-full bg-green-500" title="Present in office" />
      case "on-leave":
        return <Plane className="w-3 h-3 text-orange-500" title="On leave" />
      case "absent":
        return <div className="w-3 h-3 rounded-full bg-yellow-500" title="Absent" />
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400" />
    }
  }

  return (
    <LayoutWrapper>
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground">Manage and view employee information</p>
        </div>

        {/* Search bar */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Note:</strong> Employees can mark their attendance using the Check In/Check Out system.{" "}
          Current time: <strong>{currentTime}</strong>
        </p>
      </div>

      {/* Loading spinner */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading employees...</p>
        </div>
      ) : (
        // Employee grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <motion.div
              key={employee._id || employee.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="relative bg-card border border-border rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedEmployee(employee)}
            >
              <div className="absolute top-4 right-4">
                {getStatusIndicator(employee.status)}
              </div>

              <div className="flex flex-col items-center space-y-3">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: employee.avatarColor || "#4F46E5" }}
                >
                  {employee.avatar || employee.name?.[0]?.toUpperCase() || "?"}
                </div>

                <div className="text-center">
                  <h3 className="font-semibold text-lg text-foreground">{employee.name}</h3>
                  <p className="text-sm text-muted-foreground">{employee.position}</p>
                  <p className="text-xs text-muted-foreground">{employee.department}</p>
                </div>
              </div>

              {employee.status === "present" && (
                <div className="mt-4 text-center text-xs text-muted-foreground">
                  {employee.checkInTime && <p>In: {employee.checkInTime}</p>}
                  {employee.checkOutTime && <p>Out: {employee.checkOutTime}</p>}
                </div>
              )}

              {employee.status === "on-leave" && (
                <div className="mt-4 text-center">
                  <span className="inline-block px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded">
                    {employee.leaveReason || "On Leave"}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal for selected employee */}
      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedEmployee(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                    style={{ backgroundColor: selectedEmployee.avatarColor || "#4F46E5" }}
                  >
                    {selectedEmployee.avatar || selectedEmployee.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{selectedEmployee.name}</h2>
                    <p className="text-muted-foreground">{selectedEmployee.position}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-muted-foreground hover:text-foreground text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                    <p className="text-foreground">{selectedEmployee._id || selectedEmployee.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Department</label>
                    <p className="text-foreground">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground">{selectedEmployee.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-foreground">{selectedEmployee.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <p className="text-foreground capitalize">
                      {selectedEmployee.status ? selectedEmployee.status.replace("-", " ") : "Unknown"}
                    </p>
                  </div>
                  {selectedEmployee.checkInTime && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Check In Time</label>
                      <p className="text-foreground">{selectedEmployee.checkInTime}</p>
                    </div>
                  )}
                  {selectedEmployee.checkOutTime && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Check Out Time</label>
                      <p className="text-foreground">{selectedEmployee.checkOutTime}</p>
                    </div>
                  )}
                </div>

                {/* Admin Actions */}
                {user?.role === "Admin" && (
                  <div className="flex gap-4 pt-4 border-t border-border">
                    {selectedEmployee.status !== "present" || !selectedEmployee.checkInTime ? (
                      <button
                        onClick={() => {
                          handleCheckIn(selectedEmployee._id || selectedEmployee.id)
                          setSelectedEmployee(null)
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Check In
                      </button>
                    ) : !selectedEmployee.checkOutTime ? (
                      <button
                        onClick={() => {
                          handleCheckOut(selectedEmployee._id || selectedEmployee.id)
                          setSelectedEmployee(null)
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Check Out
                      </button>
                    ) : (
                      <div className="flex-1 text-center py-2 text-muted-foreground">
                        Already checked out today
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Check-In/Out Panel (Bottom Right) */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 bg-card border-2 border-border rounded-lg shadow-2xl p-4 z-40 min-w-[280px]"
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Quick Attendance</h3>
          </div>
          
          <div className="text-sm text-muted-foreground mb-3">
            Current time: <strong>{currentTime}</strong>
          </div>

          {/* Find current user's employee record */}
          {(() => {
            const currentEmployee = employees.find((emp) => emp.id === user.loginId)
            const isCheckedIn = currentEmployee?.checkInTime && !currentEmployee?.checkOutTime
            const isCheckedOut = currentEmployee?.checkOutTime

            return (
              <div className="space-y-2">
                {!isCheckedIn && !isCheckedOut && (
                  <button
                    onClick={() => handleCheckIn(user.loginId)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Check In
                  </button>
                )}

                {isCheckedIn && (
                  <>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="font-medium">Checked In</span>
                      </div>
                      <p className="text-green-600 dark:text-green-400 mt-1">
                        Since: {currentEmployee?.checkInTime}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCheckOut(user.loginId)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOutIcon className="w-4 h-4" />
                      Check Out
                    </button>
                  </>
                )}

                {isCheckedOut && (
                  <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm text-center">
                    <p className="text-muted-foreground">
                      ✅ Checked out for today
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Out: {currentEmployee?.checkOutTime}
                    </p>
                  </div>
                )}
              </div>
            )
          })()}
        </motion.div>
      )}

      {/* Toast Container */}
      <Toaster />
      </div>
    </LayoutWrapper>
  )
}