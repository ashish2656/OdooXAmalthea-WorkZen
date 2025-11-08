"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { useAuth } from "@/app/context/auth-context"
import { motion } from "framer-motion"
import { useState } from "react"

export default function Profile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  return (
    <LayoutWrapper>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your profile information</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-8 max-w-2xl"
        >
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.role}</p>
            </div>
          </div>

          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-foreground font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-foreground font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="text-foreground font-medium">{user?.role}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border border-border text-foreground py-2 rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </LayoutWrapper>
  )
}
