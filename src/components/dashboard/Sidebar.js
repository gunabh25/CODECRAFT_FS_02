'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  BarChart3,
  FileText,
  Calendar,
  Bell,
  Shield
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    color: 'text-blue-500'
  },
  {
    name: 'Employees',
    href: '/dashboard/employees',
    icon: Users,
    color: 'text-green-500'
  },
  {
    name: 'Add Employee',
    href: '/dashboard/employees/add',
    icon: UserPlus,
    color: 'text-purple-500'
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart3,
    color: 'text-orange-500'
  },
  {
    name: 'Documents',
    href: '/dashboard/documents',
    icon: FileText,
    color: 'text-indigo-500'
  },
  {
    name: 'Calendar',
    href: '/dashboard/calendar',
    icon: Calendar,
    color: 'text-red-500'
  },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { logout, user } = useAuth()

  const sidebarVariants = {
    expanded: {
      width: 280,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    collapsed: {
      width: 80,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  }

  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: 0.1 }
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <motion.div
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      className="bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 flex flex-col relative"
    >
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-lg transition-all duration-200 z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </motion.button>

      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <motion.div
            className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Building2 className="w-8 h-8 text-white" />
          </motion.div>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="ml-3"
              >
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                  EMS
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Admin Panel
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"
                    layoutId="activeIndicator"
                  />
                )}
                
                <Icon className={`w-5 h-5 ${isActive ? item.color : ''} transition-colors`} />
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      variants={contentVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="ml-3 font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {isActive && (
                  <motion.div
                    className="absolute right-2 w-2 h-2 bg-blue-500 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-br from-green-500 to-teal-600 p-2 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="ml-3"
              >
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings and Logout */}
        <div className="space-y-1">
          <Link href="/dashboard/settings">
            <motion.div
              className="flex items-center px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Settings className="w-4 h-4" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    variants={contentVariants}
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    className="ml-3 text-sm"
                  >
                    Settings
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>

          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-4 h-4" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="ml-3 text-sm"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}