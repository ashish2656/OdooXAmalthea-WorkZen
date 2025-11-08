"use client"

import { LayoutWrapper } from "@/components/layout-wrapper"
import { ChartContainer } from "@/components/chart-container"
import { DataTable } from "@/components/data-table"
import { payrollData } from "@/lib/mock-data"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export default function Payroll() {
  const headers = ["Name", "Month", "Basic Pay", "Deductions", "PF", "Tax", "Net Salary"]
  const rows = payrollData.map((pay, index) => [
    pay.employeeName,
    pay.month,
    `₹${pay.basicPay.toLocaleString()}`,
    `₹${pay.deductions.toLocaleString()}`,
    `₹${pay.pf.toLocaleString()}`,
    `₹${pay.tax.toLocaleString()}`,
    <span key={`net-salary-${index}`} className="font-semibold text-primary">
      ₹{pay.netSalary.toLocaleString()}
    </span>,
  ])

  const breakdownData = [
    { name: "Basic Pay", value: 50000 },
    { name: "HRA", value: 10000 },
    { name: "DA", value: 5000 },
    { name: "Deductions", value: 8000 },
  ]

  const COLORS = ["#1E40AF", "#3B82F6", "#60A5FA", "#E2E8F0"]

  return (
    <LayoutWrapper>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payroll Management</h1>
          <p className="text-muted-foreground">View salary breakdown and payslips</p>
        </div>

        <ChartContainer title="Salary Breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={breakdownData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {breakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Monthly Payroll</h2>
          <DataTable headers={headers} rows={rows} />
        </div>
      </motion.div>
    </LayoutWrapper>
  )
}
