"use client"

import { motion } from "framer-motion"

export function DataTable({ headers, rows }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="overflow-x-auto rounded-lg border border-border"
    >
      <table className="w-full">
        <thead className="bg-muted border-b border-border">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, idx) => (
            <motion.tr
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="hover:bg-muted transition-colors"
            >
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-6 py-4 text-sm text-foreground">
                  {cell}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}
