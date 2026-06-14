'use client'

import { Search, Bell } from 'lucide-react'

export default function Header({ title }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-72">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search for staff, reviews, documents..."
            className="bg-transparent text-sm text-gray-600 outline-none w-full placeholder-gray-400"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            4
          </span>
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          A
        </div>
      </div>
    </header>
  )
}
