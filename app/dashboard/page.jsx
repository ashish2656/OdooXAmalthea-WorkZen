"use client"

import { Users, Clock, Banknote } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { ChartContainer } from "@/components/chart-container"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { summaryStats, analyticsData } from "@/lib/mock-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { motion } from "framer-motion"

export default function Dashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  return (
    <LayoutWrapper>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to WorkZen HRMS</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Users} label="Total Employees" value={summaryStats.totalEmployees} color="primary" />
          <StatCard icon={Clock} label="Attendance %" value={`${summaryStats.attendancePercentage}%`} color="success" />
          <StatCard icon={Clock} label="Pending Leaves" value={summaryStats.pendingLeaves} color="warning" />
          <StatCard
            icon={Banknote}
            label="Payroll Processed"
            value={`${summaryStats.payrollProcessed}%`}
            color="danger"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer title="Attendance Trends">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                <Legend />
                <Line type="monotone" dataKey="attendance" stroke="var(--primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title="Leave & Payroll Summary">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                <Legend />
                <Bar dataKey="leaves" fill="var(--accent)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="payroll" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </motion.div>
    </LayoutWrapper>
  )
}
