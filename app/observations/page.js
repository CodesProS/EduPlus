'use client'

import { useState } from 'react'
import Header from '../components/Header'
import { Plus, X, ChevronDown } from 'lucide-react'

const initialObservations = [
  { id: 1, teacher: 'Sarah Johnson', dept: 'Mathematics', date: '2026-06-10', type: 'Formal', rating: 'Excellent', notes: 'Outstanding lesson structure and student engagement.' },
  { id: 2, teacher: 'Mark Davis', dept: 'Science', date: '2026-06-08', type: 'Informal', rating: 'Good', notes: 'Good use of lab materials, pacing could improve.' },
  { id: 3, teacher: 'Lisa Chen', dept: 'English', date: '2026-06-06', type: 'Formal', rating: 'Excellent', notes: 'Creative writing activity was very well executed.' },
  { id: 4, teacher: 'James Wilson', dept: 'History', date: '2026-06-04', type: 'Walkthrough', rating: 'Needs Improvement', notes: 'Students off task frequently, classroom management needed.' },
  { id: 5, teacher: 'Amy Torres', dept: 'Art', date: '2026-06-02', type: 'Informal', rating: 'Good', notes: 'Strong project-based learning approach observed.' },
]

const ratingColors = {
  'Excellent': 'bg-green-100 text-green-700',
  'Good': 'bg-blue-100 text-blue-700',
  'Needs Improvement': 'bg-red-100 text-red-700',
}

const typeColors = {
  'Formal': 'bg-slate-100 text-slate-700',
  'Informal': 'bg-yellow-100 text-yellow-700',
  'Walkthrough': 'bg-purple-100 text-purple-700',
}

export default function ObservationsPage() {
  const [observations, setObservations] = useState(initialObservations)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    teacher: '', dept: '', date: '', type: 'Formal', rating: 'Good', notes: ''
  })

  function handleSubmit(e) {
    e.preventDefault()
    const newObs = { ...form, id: observations.length + 1 }
    setObservations([newObs, ...observations])
    setForm({ teacher: '', dept: '', date: '', type: 'Formal', rating: 'Good', notes: '' })
    setShowForm(false)
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Observations" />

      <div className="p-8 bg-gray-100 flex-1">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">{observations.length} total observations</p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            <Plus size={16} />
            New Observation
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800 text-lg">New Observation</h2>
                <button onClick={() => setShowForm(false)}>
                  <X size={20} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Teacher Name</label>
                    <input
                      required
                      value={form.teacher}
                      onChange={e => setForm({ ...form, teacher: e.target.value })}
                      placeholder="e.g. Sarah Johnson"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Department</label>
                    <input
                      required
                      value={form.dept}
                      onChange={e => setForm({ ...form, dept: e.target.value })}
                      placeholder="e.g. Mathematics"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Date</label>
                    <input
                      required
                      type="date"
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Type</label>
                    <select
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"
                    >
                      <option>Formal</option>
                      <option>Informal</option>
                      <option>Walkthrough</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Rating</label>
                    <select
                      value={form.rating}
                      onChange={e => setForm({ ...form, rating: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"
                    >
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Needs Improvement</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Notes</label>
                  <textarea
                    required
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    placeholder="Observation notes..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700">Save Observation</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Observations List */}
        <div className="space-y-3">
          {observations.map(obs => (
            <div key={obs.id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-semibold">
                    {obs.teacher[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{obs.teacher}</p>
                    <p className="text-xs text-gray-400">{obs.dept} · {obs.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[obs.type]}`}>{obs.type}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${ratingColors[obs.rating]}`}>{obs.rating}</span>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-500 leading-relaxed">{obs.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
