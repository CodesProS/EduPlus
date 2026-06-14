'use client'

import { useState } from 'react'
import Header from '../components/Header'
import { Search, Mail, Phone } from 'lucide-react'

const staff = [
  { id: 'T-1042', name: 'Sarah Johnson', dept: 'Mathematics', role: 'Senior Teacher', email: 'sarah.j@eduplus.com', phone: '+1 555-0101', status: 'Active', score: 94 },
  { id: 'T-2381', name: 'Mark Davis', dept: 'Science', role: 'Teacher', email: 'mark.d@eduplus.com', phone: '+1 555-0102', status: 'Active', score: 88 },
  { id: 'T-0957', name: 'Lisa Chen', dept: 'English', role: 'Senior Teacher', email: 'lisa.c@eduplus.com', phone: '+1 555-0103', status: 'Active', score: 91 },
  { id: 'T-3214', name: 'James Wilson', dept: 'History', role: 'Teacher', email: 'james.w@eduplus.com', phone: '+1 555-0104', status: 'On Leave', score: 76 },
  { id: 'T-1876', name: 'Amy Torres', dept: 'Art', role: 'Teacher', email: 'amy.t@eduplus.com', phone: '+1 555-0105', status: 'Active', score: 85 },
  { id: 'T-4421', name: 'Robert Kim', dept: 'PE', role: 'Teacher', email: 'robert.k@eduplus.com', phone: '+1 555-0106', status: 'Active', score: 82 },
  { id: 'T-5532', name: 'Emma Patel', dept: 'Music', role: 'Part-time', email: 'emma.p@eduplus.com', phone: '+1 555-0107', status: 'Active', score: 90 },
  { id: 'T-6643', name: 'David Brown', dept: 'Science', role: 'Teacher', email: 'david.b@eduplus.com', phone: '+1 555-0108', status: 'Inactive', score: 70 },
]

export default function StaffPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(staff[0])

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.dept.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      <Header title="Staff" />

      <div className="flex flex-1 gap-4 p-8 bg-gray-100">
        {/* Left: Staff List */}
        <div className="w-80 bg-white rounded-2xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-3">Staff Directory</h2>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <Search size={14} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search staff or department"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-sm outline-none w-full placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.map(s => (
              <div
                key={s.id}
                onClick={() => setSelected(s)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 transition-colors ${
                  selected?.id === s.id ? 'bg-slate-800 text-white' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 ${
                  selected?.id === s.id ? 'bg-white text-slate-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {s.name[0]}
                </div>
                <div>
                  <p className={`text-sm font-medium ${selected?.id === s.id ? 'text-white' : 'text-gray-800'}`}>{s.name}</p>
                  <p className={`text-xs ${selected?.id === s.id ? 'text-slate-300' : 'text-gray-400'}`}>{s.dept}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Staff Detail */}
        {selected && (
          <div className="flex-1 space-y-4">
            {/* Profile Card */}
            <div className="bg-slate-800 rounded-2xl p-6 text-white flex items-center gap-6">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-slate-800 font-bold text-2xl">
                {selected.name[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold">{selected.name}</h2>
                <p className="text-slate-300 text-sm">{selected.role} | Staff ID: {selected.id}</p>
              </div>
              <div className="ml-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selected.status === 'Active' ? 'bg-green-400 text-green-900' :
                  selected.status === 'On Leave' ? 'bg-yellow-400 text-yellow-900' :
                  'bg-red-400 text-red-900'
                }`}>
                  {selected.status}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Basic Details</h3>
              <div className="grid grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Department</p>
                  <p className="font-medium text-gray-800">{selected.dept}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Role</p>
                  <p className="font-medium text-gray-800">{selected.role}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Performance Score</p>
                  <p className="font-medium text-red-500">{selected.score}%</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  <p className="text-gray-800">{selected.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-gray-400" />
                  <p className="text-gray-800">{selected.phone}</p>
                </div>
              </div>
            </div>

            {/* Performance Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Performance Score</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-slate-800 h-3 rounded-full transition-all"
                    style={{ width: `${selected.score}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-800">{selected.score}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
