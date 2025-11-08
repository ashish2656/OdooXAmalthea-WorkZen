"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { ChartContainer } from "@/components/chart-container"
import { analyticsData } from "@/lib/mock-data"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function Reports() {
  return (
    <LayoutWrapper>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">View comprehensive HR analytics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer title="Monthly Attendance">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                <Legend />
                <Bar dataKey="attendance" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title="Leave Statistics">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                <Legend />
                <Line type="monotone" dataKey="leaves" stroke="var(--accent)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title="Payroll Distribution">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                <Legend />
                <Bar dataKey="payroll" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title="Compliance Overview">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                <Legend />
                <Line type="monotone" dataKey="attendance" stroke="var(--primary)" strokeWidth={2} />
                <Line type="monotone" dataKey="payroll" stroke="var(--accent)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </motion.div>
    </LayoutWrapper>
  )
}
