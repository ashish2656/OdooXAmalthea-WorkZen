"use client"

import { createContext, useContext, useState } from "react"

const SidebarContext = createContext()

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(true)

  const toggle = () => setIsOpen(!isOpen)

  return <SidebarContext.Provider value={{ isOpen, toggle }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  return useContext(SidebarContext)
}
