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

export async function POST(request) {
  try {
    ensureDataFile()
    const body = await request.json()
    const { action, userId, time, companyId } = body

    const fileData = fs.readFileSync(DATA_FILE, "utf8")
    const data = JSON.parse(fileData)
    if (!data.employees) data.employees = []

    // find employee by id or by matching loginId to employee.id
    const empIndex = data.employees.findIndex((e) => e.id === userId || e.id === (userId || ""))
    if (empIndex === -1) {
      return NextResponse.json({ success: false, message: "Employee not found" }, { status: 404 })
    }

    const employee = data.employees[empIndex]

    if (action === "check-in") {
      employee.checkInTime = time
      employee.checkOutTime = null
      employee.status = "present"
    } else if (action === "check-out") {
      employee.checkOutTime = time
      employee.status = "checked-out"
    } else {
      return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
    }

    data.employees[empIndex] = employee
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))

    return NextResponse.json({ success: true, employee })
  } catch (error) {
    console.error("Attendance API error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
