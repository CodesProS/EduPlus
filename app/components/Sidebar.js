'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Eye, ClipboardList,
  StickyNote, Target, Users, Settings, LogOut
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/staff', label: 'Staff', icon: Users },
  { href: '/observations', label: 'Observations', icon: Eye },
  { href: '/reviews', label: 'Performance Reviews', icon: ClipboardList },
  { href: '/notes', label: 'Notes', icon: StickyNote },
  { href: '/goals', label: 'Goal Tracking', icon: Target },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-slate-800 text-white flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-6 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-slate-800 font-bold text-sm">E</span>
          </div>
          <span className="text-white font-bold text-lg">EduPulse</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active ? 'bg-white text-slate-800' : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
        >
          <Settings size={18} />
          Settings
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )
}