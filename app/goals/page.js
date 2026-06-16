'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { Plus, X, Target, Sparkles } from 'lucide-react'

const statusColors = {
  'On Track': 'bg-green-100 text-green-700',
  'At Risk': 'bg-red-100 text-red-700',
  'Completed': 'bg-blue-100 text-blue-700',
}

const progressColors = {
  'On Track': 'bg-green-500',
  'At Risk': 'bg-red-400',
  'Completed': 'bg-blue-500',
}

export default function GoalsPage() {
  const [goals, setGoals] = useState([])
  const [staff, setStaff] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ teacher: '', dept: '', goal: '', deadline: '', progress: '', status: 'On Track' })
  const [goalLoading, setGoalLoading] = useState(false)

  useEffect(() => {
    fetch('/api/goals')
      .then(res => res.json())
      .then(data => setGoals(Array.isArray(data) ? data : []))
    fetch('/api/staff')
      .then(res => res.json())
      .then(data => setStaff(Array.isArray(data) ? data : []))
  }, [])

  function handleTeacherChange(e) {
    const selected = staff.find(s => s.name === e.target.value)
    setForm({ ...form, teacher: e.target.value, dept: selected ? selected.dept : '', goal: '' })
  }

  async function suggestGoal() {
    if (!form.teacher) return
    setGoalLoading(true)
    try {
      const reviewsRes = await fetch('/api/reviews')
      const allReviews = await reviewsRes.json()
      const teacherReviews = Array.isArray(allReviews)
        ? allReviews.filter(r => r.teacher === form.teacher)
        : []
      const res = await fetch('/api/ai/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacher: form.teacher, dept: form.dept, reviews: teacherReviews }),
      })
      const data = await res.json()
      setForm(f => ({ ...f, goal: data.goal }))
    } catch {
      setForm(f => ({ ...f, goal: 'Failed to generate suggestion. Check your GROQ_API_KEY.' }))
    }
    setGoalLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, progress: +form.progress }),
    })
    const newGoal = await res.json()
    setGoals([newGoal, ...goals])
    setForm({ teacher: '', dept: '', goal: '', deadline: '', progress: '', status: 'On Track' })
    setShowForm(false)
  }

  async function updateProgress(id, value) {
    setGoals(goals.map(g => g.id === id ? { ...g, progress: +value } : g))
    await fetch('/api/goals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, progress: +value }),
    })
  }

  const completed = goals.filter(g => g.progress === 100 || g.status === 'Completed').length
  const atRisk = goals.filter(g => g.status === 'At Risk').length
  const onTrack = goals.filter(g => g.status === 'On Track').length

  return (
    <div className="flex flex-col h-full">
      <Header title="Goal Tracking" />

      <div className="p-8 bg-gray-100 flex-1">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Target size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">On Track</p>
              <p className="text-2xl font-bold text-gray-800">{onTrack}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Target size={18} className="text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">At Risk</p>
              <p className="text-2xl font-bold text-gray-800">{atRisk}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Target size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-800">{completed}</p>
            </div>
          </div>
        </div>

        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-500 text-sm">{goals.length} total goals</p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            <Plus size={16} />
            New Goal
          </button>
        </div>

        {/* Goals List */}
        <div className="space-y-3">
          {goals.map(g => (
            <div key={g.id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-800">{g.teacher}</p>
                  <p className="text-xs text-gray-400">{g.dept} · Due {g.deadline}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[g.status]}`}>{g.status}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{g.goal}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${progressColors[g.status]}`}
                    style={{ width: `${g.progress}%` }}
                  />
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={g.progress}
                  onChange={e => updateProgress(g.id, e.target.value)}
                  className="w-14 border border-gray-200 rounded-lg px-2 py-1 text-xs text-center outline-none focus:border-slate-400"
                />
                <span className="text-xs text-gray-500">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 text-lg">New Goal</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Teacher</label>
                  <select required value={form.teacher} onChange={handleTeacherChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400">
                    <option value="">Select teacher</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Department</label>
                  <input readOnly value={form.dept} placeholder="Auto-filled"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-gray-500">Goal Description</label>
                  <button
                    type="button"
                    onClick={suggestGoal}
                    disabled={!form.teacher || goalLoading}
                    className="flex items-center gap-1 text-xs bg-yellow-400 hover:bg-yellow-300 text-slate-800 px-3 py-1 rounded-lg font-semibold transition-colors disabled:opacity-40"
                  >
                    <Sparkles size={11} />
                    {goalLoading ? 'Suggesting...' : 'AI Suggest'}
                  </button>
                </div>
                <textarea required value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })}
                  placeholder={form.teacher ? 'Describe the goal or click AI Suggest...' : 'Select a teacher first, then use AI Suggest'}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400 resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Deadline</label>
                  <input required type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Progress (%)</label>
                  <input required type="number" min="0" max="100" value={form.progress} onChange={e => setForm({ ...form, progress: e.target.value })}
                    placeholder="0-100"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400">
                    <option>On Track</option>
                    <option>At Risk</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700">Save Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
