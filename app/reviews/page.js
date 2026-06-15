'use client'

import { useState } from 'react'
import Header from '../components/Header'
import { Plus, X, ChevronRight } from 'lucide-react'

const initialReviews = [
  { id: 1, teacher: 'Sarah Johnson', dept: 'Mathematics', period: 'Spring 2026', status: 'Completed', overall: 94, teaching: 96, communication: 92, professionalism: 94, comments: 'Exceptional performance across all areas. A model teacher.' },
  { id: 2, teacher: 'Mark Davis', dept: 'Science', period: 'Spring 2026', status: 'Completed', overall: 88, teaching: 90, communication: 85, professionalism: 89, comments: 'Strong content knowledge, continues to improve engagement strategies.' },
  { id: 3, teacher: 'Lisa Chen', dept: 'English', period: 'Spring 2026', status: 'In Progress', overall: 91, teaching: 93, communication: 90, professionalism: 90, comments: 'Review in progress.' },
  { id: 4, teacher: 'James Wilson', dept: 'History', period: 'Spring 2026', status: 'Pending', overall: 76, teaching: 74, communication: 78, professionalism: 76, comments: 'Needs support with classroom management strategies.' },
  { id: 5, teacher: 'Amy Torres', dept: 'Art', period: 'Spring 2026', status: 'Completed', overall: 85, teaching: 87, communication: 83, professionalism: 85, comments: 'Creative and passionate educator, great student relationships.' },
]

const statusColors = {
  'Completed': 'bg-green-100 text-green-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  'Pending': 'bg-gray-100 text-gray-500',
}

function ScoreBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span className="font-medium text-gray-700">{value}%</span>
      </div>
      <div className="bg-gray-100 rounded-full h-2">
        <div className="bg-slate-800 h-2 rounded-full" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(initialReviews)
  const [selected, setSelected] = useState(reviews[0])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    teacher: '', dept: '', period: 'Spring 2026', teaching: '', communication: '', professionalism: '', comments: ''
  })

  function handleSubmit(e) {
    e.preventDefault()
    const overall = Math.round((+form.teaching + +form.communication + +form.professionalism) / 3)
    const newReview = { ...form, id: reviews.length + 1, status: 'Completed', overall }
    setReviews([newReview, ...reviews])
    setSelected(newReview)
    setShowForm(false)
    setForm({ teacher: '', dept: '', period: 'Spring 2026', teaching: '', communication: '', professionalism: '', comments: '' })
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Performance Reviews" />

      <div className="flex flex-1 gap-4 p-8 bg-gray-100">
        {/* Left: Reviews List */}
        <div className="w-80 bg-white rounded-2xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Reviews</h2>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-700"
            >
              <Plus size={13} /> New
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {reviews.map(r => (
              <div
                key={r.id}
                onClick={() => setSelected(r)}
                className={`px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors ${selected?.id === r.id ? 'bg-slate-800' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${selected?.id === r.id ? 'text-white' : 'text-gray-800'}`}>{r.teacher}</p>
                  <ChevronRight size={14} className={selected?.id === r.id ? 'text-slate-300' : 'text-gray-300'} />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-xs ${selected?.id === r.id ? 'text-slate-300' : 'text-gray-400'}`}>{r.dept}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selected?.id === r.id ? 'bg-white/20 text-white' : statusColors[r.status]}`}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Review Detail */}
        {selected && (
          <div className="flex-1 space-y-4">
            {/* Header Card */}
            <div className="bg-slate-800 rounded-2xl p-6 text-white flex items-center gap-6">
              <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-slate-800 font-bold text-xl">
                {selected.teacher[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold">{selected.teacher}</h2>
                <p className="text-slate-300 text-sm">{selected.dept} · {selected.period}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-4xl font-bold">{selected.overall}%</p>
                <p className="text-slate-300 text-xs mt-1">Overall Score</p>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Score Breakdown</h3>
              <div className="space-y-4">
                <ScoreBar label="Teaching Quality" value={selected.teaching} />
                <ScoreBar label="Communication" value={selected.communication} />
                <ScoreBar label="Professionalism" value={selected.professionalism} />
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">Comments</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{selected.comments}</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 text-lg">New Performance Review</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Teacher Name</label>
                  <input required value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })}
                    placeholder="e.g. Sarah Johnson"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Department</label>
                  <input required value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}
                    placeholder="e.g. Mathematics"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Teaching (%)</label>
                  <input required type="number" min="0" max="100" value={form.teaching} onChange={e => setForm({ ...form, teaching: e.target.value })}
                    placeholder="0-100"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Communication (%)</label>
                  <input required type="number" min="0" max="100" value={form.communication} onChange={e => setForm({ ...form, communication: e.target.value })}
                    placeholder="0-100"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Professionalism (%)</label>
                  <input required type="number" min="0" max="100" value={form.professionalism} onChange={e => setForm({ ...form, professionalism: e.target.value })}
                    placeholder="0-100"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400" />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Comments</label>
                <textarea required value={form.comments} onChange={e => setForm({ ...form, comments: e.target.value })}
                  placeholder="Review comments..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400 resize-none" />
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700">Save Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
