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
 * POST - Change password
 */
export async function POST(request) {
  try {
    ensureDataFile()
    
    const body = await request.json()
    const { loginId, oldPassword, newPassword } = body
    
    const fileData = fs.readFileSync(DATA_FILE, "utf8")
    const data = JSON.parse(fileData)
    
    // Find user
    const userIndex = data.users.findIndex((u) => u.loginId === loginId)
    
    if (userIndex === -1) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }
    
    // Verify old password
    if (data.users[userIndex].password !== oldPassword) {
      return NextResponse.json({ success: false, message: "Old password is incorrect" }, { status: 400 })
    }
    
    // Update password
    data.users[userIndex].password = newPassword
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
    
    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
