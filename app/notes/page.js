'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { Plus, X, Trash2 } from 'lucide-react'

const colorOptions = [
  'bg-yellow-100 border-yellow-200',
  'bg-blue-100 border-blue-200',
  'bg-green-100 border-green-200',
  'bg-purple-100 border-purple-200',
  'bg-pink-100 border-pink-200',
]

export default function NotesPage() {
  const [notes, setNotes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedColor, setSelectedColor] = useState(colorOptions[0])
  const [form, setForm] = useState({ title: '', content: '' })

  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => setNotes(data))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: form.title, content: form.content, color: selectedColor }),
    })
    const newNote = await res.json()
    setNotes([newNote, ...notes])
    setForm({ title: '', content: '' })
    setSelectedColor(colorOptions[0])
    setShowForm(false)
  }

  async function deleteNote(id) {
    await fetch('/api/notes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setNotes(notes.filter(n => n.id !== id))
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Notes" />

      <div className="p-8 bg-gray-100 flex-1">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">{notes.length} notes</p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            <Plus size={16} />
            New Note
          </button>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-3 gap-4">
          {notes.map(note => (
            <div key={note.id} className={`${note.color} border rounded-2xl p-5 flex flex-col gap-3`}>
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-800 text-sm">{note.title}</h3>
                <button onClick={() => deleteNote(note.id)} className="text-gray-400 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed flex-1">{note.content}</p>
              <p className="text-xs text-gray-400">{note.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 text-lg">New Note</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-gray-400" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Note title"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Content</label>
                <textarea
                  required
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your note..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-2 block">Color</label>
                <div className="flex gap-2">
                  {colorOptions.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`w-7 h-7 rounded-full border-2 ${c.split(' ')[0]} ${selectedColor === c ? 'border-slate-800 scale-110' : 'border-transparent'} transition-all`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700">Save Note</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
