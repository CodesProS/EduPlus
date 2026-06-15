'use client'

import { useState } from 'react'
import Header from '../components/Header'

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@eduplus.com',
    school: 'Lincoln K-12 School',
    role: 'Principal',
    phone: '+1 555-0100',
  })

  const [notifications, setNotifications] = useState({
    emailReviews: true,
    emailObservations: false,
    emailGoals: true,
    weeklyReport: true,
  })

  const [saved, setSaved] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" />

      <div className="p-8 bg-gray-100 flex-1 space-y-4">
        {/* Profile Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Profile Settings</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
                <input
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">School Name</label>
                <input
                  value={profile.school}
                  onChange={e => setProfile({ ...profile, school: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Role</label>
                <select
                  value={profile.role}
                  onChange={e => setProfile({ ...profile, role: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"
                >
                  <option>Principal</option>
                  <option>Vice Principal</option>
                  <option>Department Head</option>
                  <option>Administrator</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Phone</label>
                <input
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                Save Changes
              </button>
              {saved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
            </div>
          </form>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            {[
              { key: 'emailReviews', label: 'Email me when a performance review is completed' },
              { key: 'emailObservations', label: 'Email me when a new observation is logged' },
              { key: 'emailGoals', label: 'Email me when a goal status changes' },
              { key: 'weeklyReport', label: 'Send me a weekly summary report' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <p className="text-sm text-gray-700">{label}</p>
                <button
                  onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${notifications[key] ? 'bg-slate-800' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications[key] ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
          <h2 className="font-semibold text-red-600 mb-4">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Reset all data</p>
              <p className="text-xs text-gray-400">This will clear all observations, reviews, notes and goals.</p>
            </div>
            <button className="px-4 py-2 border border-red-300 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
              Reset Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
