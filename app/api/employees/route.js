import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "users.json")

function ensureDataFile() {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [], employees: [] }, null, 2))
  }
}

/**
 * GET - Retrieve all employees or a specific employee
 */
export async function GET(request) {
  try {
    ensureDataFile()
    
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("id")
    const companyId = searchParams.get("companyId")
    
    const fileData = fs.readFileSync(DATA_FILE, "utf8")
    const data = JSON.parse(fileData)
    
    if (!data.employees) {
      data.employees = []
    }
    
    // Get specific employee
    if (employeeId) {
      const employee = data.employees.find((e) => e.id === employeeId)
      if (employee) {
        return NextResponse.json({ success: true, employee })
      } else {
        return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 })
      }
    }
    
    // Get employees by company
    let employees = data.employees
    if (companyId) {
      employees = employees.filter((e) => e.companyId === companyId)
    }
    
    return NextResponse.json({ success: true, employees })
  } catch (error) {
    console.error("Error reading employees:", error)
    return NextResponse.json({ success: false, message: "Failed to read employees" }, { status: 500 })
  }
}

/**
 * POST - Create a new employee or update attendance (check-in/check-out)
 */
export async function POST(request) {
  try {
    ensureDataFile()
    
    const body = await request.json()
    const { action, ...employeeData } = body
    
    const fileData = fs.readFileSync(DATA_FILE, "utf8")
    const data = JSON.parse(fileData)
    
    if (!data.employees) {
      data.employees = []
    }
    
    if (action === "check-in") {
      const employee = data.employees.find((e) => e.id === employeeData.id)
      if (employee) {
        employee.checkInTime = employeeData.checkInTime
        employee.status = "present"
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
        return NextResponse.json({ success: true, message: "Checked in successfully", employee })
      }
      return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 })
    }
    
    if (action === "check-out") {
      const employee = data.employees.find((e) => e.id === employeeData.id)
      if (employee) {
        employee.checkOutTime = employeeData.checkOutTime
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
        return NextResponse.json({ success: true, message: "Checked out successfully", employee })
      }
      return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 })
    }
    
    // Create new employee
    const existingEmployee = data.employees.find((e) => e.email === employeeData.email)
    if (existingEmployee) {
      return NextResponse.json(
        { success: false, message: "Employee already exists" },
        { status: 400 }
      )
    }
    
    // Check if user already exists in users array
    const existingUser = data.users.find((u) => u.email === employeeData.email)
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      )
    }
    
    // Add employee to employees array
    const { password, ...employeeWithoutPassword } = employeeData
    data.employees.push(employeeWithoutPassword)
    
    // Add login credentials to users array
    if (password) {
      data.users.push({
        loginId: employeeData.id,
        companyName: null,
        name: employeeData.name,
        email: employeeData.email,
        phone: employeeData.phone,
        password: password,
        logo: null,
        role: employeeData.role,
        avatar: employeeData.avatar,
        createdAt: employeeData.createdAt,
      })
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    
    return NextResponse.json({
      success: true,
      message: "Employee created successfully",
      employee: employeeWithoutPassword,
    })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

/**
 * PUT - Update employee information
 */
export async function PUT(request) {
  try {
    ensureDataFile()
    
    const body = await request.json()
    const { id, ...updates } = body
    
    const fileData = fs.readFileSync(DATA_FILE, "utf8")
    const data = JSON.parse(fileData)
    
    if (!data.employees) {
      data.employees = []
    }
    
    if (!data.users) {
      data.users = []
    }
    
    const employeeIndex = data.employees.findIndex((e) => e.id === id)
    
    if (employeeIndex === -1) {
      return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 })
    }
    
    // Update employee data
    data.employees[employeeIndex] = { ...data.employees[employeeIndex], ...updates }
    
    // Update corresponding user data if email, name, phone, or role changed
    const userIndex = data.users.findIndex((u) => u.loginId === id)
    if (userIndex !== -1) {
      if (updates.name) data.users[userIndex].name = updates.name
      if (updates.email) data.users[userIndex].email = updates.email
      if (updates.phone) data.users[userIndex].phone = updates.phone
      if (updates.role) data.users[userIndex].role = updates.role
      if (updates.avatar) data.users[userIndex].avatar = updates.avatar
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    
    return NextResponse.json({
      success: true,
      message: "Employee updated successfully",
      employee: data.employees[employeeIndex],
    })
  } catch (error) {
    console.error("Error updating employee:", error)
    return NextResponse.json({ success: false, message: "Failed to update employee" }, { status: 500 })
  }
}

/**
 * DELETE - Delete an employee
 */
export async function DELETE(request) {
  try {
    ensureDataFile()
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    
    if (!id) {
      return NextResponse.json({ success: false, message: "Employee ID is required" }, { status: 400 })
    }
    
    const fileData = fs.readFileSync(DATA_FILE, "utf8")
    const data = JSON.parse(fileData)
    
    if (!data.employees) {
      data.employees = []
    }
    
    if (!data.users) {
      data.users = []
    }
    
    const employeeIndex = data.employees.findIndex((e) => e.id === id)
    
    if (employeeIndex === -1) {
      return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 })
    }
    
    // Remove from employees array
    const deletedEmployee = data.employees.splice(employeeIndex, 1)[0]
    
    // Remove from users array
    const userIndex = data.users.findIndex((u) => u.loginId === id)
    if (userIndex !== -1) {
      data.users.splice(userIndex, 1)
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    
    return NextResponse.json({
      success: true,
      message: "Employee deleted successfully",
      employee: deletedEmployee,
    })
  } catch (error) {
    console.error("Error deleting employee:", error)
    return NextResponse.json({ success: false, message: "Failed to delete employee" }, { status: 500 })
  }
}
