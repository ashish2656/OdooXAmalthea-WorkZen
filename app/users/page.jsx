"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/app/context/auth-context"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { DataTable } from "@/components/data-table"
import { motion } from "framer-motion"
import { Trash2, Edit2, UserPlus, X, Save, Mail, Phone, User, Briefcase, Building2, Shield, DollarSign, Eye, EyeOff, Search } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function Users() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    role: "Employee",
    salary: "",
    password: "",
  })
  
  const [formErrors, setFormErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showCustomRole, setShowCustomRole] = useState(false)
  const [customRole, setCustomRole] = useState("")

  useEffect(() => {
    // Only admins can access this page
    if (user && user.role !== "Admin") {
      toast.error("Access denied. Only admins can manage employees.")
      router.push("/dashboard")
      return
    }
    
    if (user) {
      fetchEmployees()
    }
  }, [user, router])

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`/api/employees?companyId=${user?.loginId || ""}`)
      const data = await response.json()
      if (data.success) {
        setEmployees(data.employees)
        setFilteredEmployees(data.employees)
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
      toast.error("Failed to load employees")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredEmployees(employees)
      return
    }
    
    const filtered = employees.filter((emp) => {
      const searchLower = query.toLowerCase()
      return (
        emp.name.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.department.toLowerCase().includes(searchLower) ||
        emp.position.toLowerCase().includes(searchLower) ||
        emp.id.toLowerCase().includes(searchLower)
      )
    })
    setFilteredEmployees(filtered)
  }

  const generateEmployeeId = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    return `EMP${timestamp}${random}`
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) errors.name = "Name is required"
    
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email format"
    
    if (!formData.phone.trim()) errors.phone = "Phone is required"
    else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) errors.phone = "Invalid phone number"
    
    if (!formData.department.trim()) errors.department = "Department is required"
    if (!formData.position.trim()) errors.position = "Position is required"
    
    // Validate custom role if selected
    if (showCustomRole && !customRole.trim()) {
      errors.role = "Custom role name is required"
    }
    
    // Password is only required when creating a new employee
    if (!editingEmployee) {
      if (!formData.password) errors.password = "Password is required"
      else if (formData.password.length < 8) errors.password = "Password must be at least 8 characters"
      else if (!/(?=.*[a-z])/.test(formData.password)) errors.password = "Must contain lowercase letter"
      else if (!/(?=.*[A-Z])/.test(formData.password)) errors.password = "Must contain uppercase letter"
      else if (!/(?=.*\d)/.test(formData.password)) errors.password = "Must contain a number"
    }
    
    if (formData.salary && isNaN(formData.salary)) errors.salary = "Salary must be a number"
    
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormErrors({})
    
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      if (editingEmployee) {
        // Update existing employee
        const finalRole = showCustomRole && customRole.trim() ? customRole.trim() : formData.role
        const updateData = {
          id: editingEmployee.id,
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          department: formData.department.trim(),
          position: formData.position.trim(),
          role: finalRole,
          salary: formData.salary ? parseFloat(formData.salary) : null,
          avatar: formData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
        }
        
        const response = await fetch("/api/employees", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        })
        
        const data = await response.json()
        
        if (data.success) {
          toast.success("Employee updated successfully!", {
            duration: 3000,
            icon: "✅",
          })
          setShowForm(false)
          setEditingEmployee(null)
          setFormData({
            name: "",
            email: "",
            phone: "",
            department: "",
            position: "",
            role: "Employee",
            salary: "",
            password: "",
          })
          fetchEmployees()
        } else {
          toast.error(data.message || "Failed to update employee")
        }
      } else {
        // Create new employee
        const finalRole = showCustomRole && customRole.trim() ? customRole.trim() : formData.role
        const employeeData = {
          id: generateEmployeeId(),
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          department: formData.department.trim(),
          position: formData.position.trim(),
          role: finalRole,
          salary: formData.salary ? parseFloat(formData.salary) : null,
          password: formData.password,
          status: "absent",
          avatar: formData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
          avatarColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
          checkInTime: null,
          checkOutTime: null,
          companyId: user.loginId,
          createdAt: new Date().toISOString(),
        }
        
        const response = await fetch("/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeeData),
        })
        
        const data = await response.json()
        
        if (data.success) {
          toast.success("Employee created successfully!", {
            duration: 3000,
            icon: "✅",
          })
          setShowForm(false)
          setFormData({
            name: "",
            email: "",
            phone: "",
            department: "",
            position: "",
            role: "Employee",
            salary: "",
            password: "",
          })
          fetchEmployees()
        } else {
          toast.error(data.message || "Failed to create employee")
        }
      }
    } catch (error) {
      console.error("Error saving employee:", error)
      toast.error("Error saving employee")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    
    // Check if the role is a custom role (not in predefined list)
    const predefinedRoles = ["Employee", "Manager", "HR Officer", "Payroll Officer"]
    const isCustomRole = !predefinedRoles.includes(employee.role)
    
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      role: isCustomRole ? "Custom" : employee.role,
      salary: employee.salary?.toString() || "",
      password: "",
    })
    
    if (isCustomRole) {
      setShowCustomRole(true)
      setCustomRole(employee.role)
    } else {
      setShowCustomRole(false)
      setCustomRole("")
    }
    
    setShowForm(true)
  }

  const handleDelete = async (employee) => {
    if (!confirm(`Are you sure you want to delete ${employee.name}? This action cannot be undone.`)) {
      return
    }
    
    try {
      const response = await fetch(`/api/employees?id=${employee.id}`, {
        method: "DELETE",
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success("Employee deleted successfully!", {
          duration: 3000,
          icon: "🗑️",
        })
        fetchEmployees()
      } else {
        toast.error(data.message || "Failed to delete employee")
      }
    } catch (error) {
      console.error("Error deleting employee:", error)
      toast.error("Error deleting employee")
    }
  }

  const handleCancelEdit = () => {
    setShowForm(false)
    setEditingEmployee(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      role: "Employee",
      salary: "",
      password: "",
    })
    setFormErrors({})
    setShowCustomRole(false)
    setCustomRole("")
  }

  // Debug logging
  console.log("Users Page - Auth State:", { user, authLoading, loading, role: user?.role })

  // Show loading spinner while checking auth or loading employees
  if (authLoading || loading) {
    return (
      <LayoutWrapper>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </LayoutWrapper>
    )
  }

  // If user is not logged in or not admin, don't render (useEffect will redirect)
  if (!user || user.role !== "Admin") {
    console.log("Users Page - Access Denied:", { user: user?.name, role: user?.role })
    return null
  }
  
  console.log("Users Page - Rendering with user:", user.name, "Role:", user.role)

  const headers = ["ID", "Name", "Email", "Department", "Position", "Status", "Actions"]
  const rows = filteredEmployees.map((emp) => [
    emp.id,
    <div key={emp.id} className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
        style={{ backgroundColor: emp.avatarColor || "#8B5CF6" }}
      >
        {emp.avatar}
      </div>
      <span>{emp.name}</span>
    </div>,
    emp.email,
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
      {emp.status}
    </span>,
    <div key={emp.id} className="flex gap-2">
      <button 
        onClick={() => handleEdit(emp)}
        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors text-blue-600 dark:text-blue-400"
        title="Edit employee"
      >
        <Edit2 size={16} />
      </button>
      <button 
        onClick={() => handleDelete(emp)}
        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors text-red-600 dark:text-red-400"
        title="Delete employee"
      >
        <Trash2 size={16} />
      </button>
    </div>,
  ])

  return (
    <LayoutWrapper>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Employee Management</h1>
            <p className="text-muted-foreground">Manage employees and their information</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search employees..."
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-64"
              />
            </div>
            {/* Add Employee Button */}
            <button
              onClick={() => {
                if (showForm) {
                  handleCancelEdit()
                } else {
                  setShowForm(true)
                }
              }}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              {showForm ? <X size={18} /> : <UserPlus size={18} />}
              {showForm ? "Close" : "Add Employee"}
            </button>
          </div>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6 space-y-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-foreground">
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </h3>
              <p className="text-sm text-muted-foreground">All fields marked with * are required</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <User size={16} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.name ? "border-red-500" : "border-border"
                    }`}
                    placeholder="Enter full name"
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Mail size={16} />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.email ? "border-red-500" : "border-border"
                    }`}
                    placeholder="employee@company.com"
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Phone size={16} />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.phone ? "border-red-500" : "border-border"
                    }`}
                    placeholder="+91 9876543210"
                  />
                  {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                </div>

                {/* Department */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Building2 size={16} />
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.department ? "border-red-500" : "border-border"
                    }`}
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Customer Support">Customer Support</option>
                  </select>
                  {formErrors.department && <p className="text-red-500 text-xs mt-1">{formErrors.department}</p>}
                </div>

                {/* Position */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Briefcase size={16} />
                    Position *
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => handleInputChange("position", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.position ? "border-red-500" : "border-border"
                    }`}
                    placeholder="e.g., Senior Developer"
                  />
                  {formErrors.position && <p className="text-red-500 text-xs mt-1">{formErrors.position}</p>}
                </div>

                {/* Role */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <Shield size={16} />
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => {
                      const selectedRole = e.target.value
                      handleInputChange("role", selectedRole)
                      if (selectedRole === "Custom") {
                        setShowCustomRole(true)
                      } else {
                        setShowCustomRole(false)
                        setCustomRole("")
                      }
                    }}
                    className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.role ? "border-red-500" : "border-border"
                    }`}
                  >
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                    <option value="HR Officer">HR Officer</option>
                    <option value="Payroll Officer">Payroll Officer</option>
                    <option value="Custom">+ Add Custom Role</option>
                  </select>
                  {formErrors.role && <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>}
                </div>

                {/* Custom Role Input - Shows when Custom is selected */}
                {showCustomRole && (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                      <Shield size={16} />
                      Custom Role Name *
                    </label>
                    <input
                      type="text"
                      value={customRole}
                      onChange={(e) => {
                        setCustomRole(e.target.value)
                        if (formErrors.role) {
                          setFormErrors(prev => ({ ...prev, role: "" }))
                        }
                      }}
                      className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                        formErrors.role ? "border-red-500" : "border-border"
                      }`}
                      placeholder="e.g., Team Lead, Supervisor, Consultant"
                    />
                    {formErrors.role && <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter a custom role name for this employee
                    </p>
                  </div>
                )}

                {/* Salary */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <DollarSign size={16} />
                    Salary (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => handleInputChange("salary", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                      formErrors.salary ? "border-red-500" : "border-border"
                    }`}
                    placeholder="50000"
                  />
                  {formErrors.salary && <p className="text-red-500 text-xs mt-1">{formErrors.salary}</p>}
                </div>

                {/* Password */}
                {!editingEmployee && (
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                      <Shield size={16} />
                      Initial Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                          formErrors.password ? "border-red-500" : "border-border"
                        }`}
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      Password must be at least 8 characters with uppercase, lowercase, and number
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 border border-border rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {editingEmployee ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      {editingEmployee ? "Update Employee" : "Create Employee"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredEmployees.length}</span> of{" "}
            <span className="font-semibold text-foreground">{employees.length}</span> employees
            {searchQuery && (
              <span className="ml-2">
                matching "<span className="font-semibold text-primary">{searchQuery}</span>"
              </span>
            )}
          </p>
        </div>

        <DataTable headers={headers} rows={rows} />
      </motion.div>
      <Toaster />
    </LayoutWrapper>
  )
}
