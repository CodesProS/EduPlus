'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { Users, Eye, ClipboardList, Target, Sparkles } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const COLORS = ['#1e293b', '#f59e0b']

function buildBarData(observations, reviews) {
  const obsCounts = Array(12).fill(0)
  const revCounts = Array(12).fill(0)

  observations.forEach(o => {
    const d = new Date(o.date || o.created_at)
    if (!isNaN(d)) obsCounts[d.getMonth()]++
  })

  reviews.forEach(r => {
    const d = new Date(r.created_at)
    if (!isNaN(d)) revCounts[d.getMonth()]++
  })

  return MONTHS.map((month, i) => ({
    month,
    observations: obsCounts[i],
    reviews: revCounts[i],
  }))
}

export default function Dashboard() {
  const [counts, setCounts] = useState({ staff: 0, observations: 0, reviews: 0, goals: 0 })
  const [loading, setLoading] = useState(true)
  const [recentReviews, setRecentReviews] = useState([])
  const [allReviews, setAllReviews] = useState([])
  const [allGoals, setAllGoals] = useState([])
  const [barData, setBarData] = useState(MONTHS.map(month => ({ month, observations: 0, reviews: 0 })))
  const [pieStats, setPieStats] = useState({ staffPct: 0, goalsPct: 0 })
  const [insights, setInsights] = useState([])
  const [insightsLoading, setInsightsLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/staff').then(r => r.json()),
      fetch('/api/observations').then(r => r.json()),
      fetch('/api/reviews').then(r => r.json()),
      fetch('/api/goals').then(r => r.json()),
    ]).then(([staff, observations, reviews, goals]) => {
      const safeObs = Array.isArray(observations) ? observations : []
      const safeReviews = Array.isArray(reviews) ? reviews : []
      const safeGoals = Array.isArray(goals) ? goals : []

      setCounts({
        staff: Array.isArray(staff) ? staff.length : 0,
        observations: safeObs.length,
        reviews: safeReviews.filter(r => r.status === 'Completed').length,
        goals: safeGoals.filter(g => g.status === 'On Track').length,
      })
      setRecentReviews(safeReviews.slice(0, 5))
      setAllReviews(safeReviews)
      setAllGoals(safeGoals)
      setLoading(false)
      setBarData(buildBarData(safeObs, safeReviews))

      // Pie chart: real percentages
      const staffCount = Array.isArray(staff) ? staff.length : 0
      const reviewedStaff = new Set(safeReviews.filter(r => r.status === 'Completed').map(r => r.teacher)).size
      const staffPct = staffCount > 0 ? Math.round((reviewedStaff / staffCount) * 100) : 0
      const goalsPct = safeGoals.length > 0
        ? Math.round((safeGoals.filter(g => g.status === 'On Track' || g.status === 'Completed').length / safeGoals.length) * 100)
        : 0
      setPieStats({ staffPct, goalsPct })
    })
  }, [])

  async function generateInsights() {
    setInsightsLoading(true)
    setInsights([])
    const avgScore = allReviews.length > 0
      ? Math.round(allReviews.reduce((sum, r) => sum + (r.overall || 0), 0) / allReviews.length)
      : 0
    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffCount: counts.staff,
          observationsCount: counts.observations,
          reviewsCount: counts.reviews,
          goalsCount: allGoals.length,
          onTrack: allGoals.filter(g => g.status === 'On Track').length,
          atRisk: allGoals.filter(g => g.status === 'At Risk').length,
          completed: allGoals.filter(g => g.status === 'Completed').length,
          avgScore,
          recentReviews,
        }),
      })
      const data = await res.json()
      setInsights(data.insights || [])
    } catch {
      setInsights(['Failed to generate insights. Please check your GROQ_API_KEY.'])
    }
    setInsightsLoading(false)
  }

  const stats = [
    { label: 'Staff Members', value: counts.staff, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Observations', value: counts.observations, icon: Eye, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Reviews Done', value: counts.reviews, icon: ClipboardList, color: 'bg-green-100 text-green-600' },
    { label: 'Active Goals', value: counts.goals, icon: Target, color: 'bg-purple-100 text-purple-600' },
  ]

  const hasData = barData.some(d => d.observations > 0 || d.reviews > 0)

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" />

      <div className="p-8 space-y-6 bg-gray-100 flex-1">
        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={22} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                {loading
                  ? <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1" />
                  : <p className="text-2xl font-bold text-gray-800">{value}</p>
                }
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Bar Chart */}
          <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">
                Observations & Reviews{' '}
                <span className="text-xs text-gray-400 font-normal">by month</span>
              </h2>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-slate-700 inline-block" /> Observations</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" /> Reviews</span>
              </div>
            </div>
            {hasData ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="observations" fill="#1e293b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reviews" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
                No data yet — add observations and reviews to see activity here.
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
            <h2 className="font-semibold text-gray-800 mb-4 self-start">Review Completion</h2>
            <PieChart width={160} height={160}>
              {/* Outer ring — Staff reviewed */}
              <Pie data={[{ value: pieStats.staffPct }, { value: 100 - pieStats.staffPct }]} cx={75} cy={75} innerRadius={58} outerRadius={75} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
                <Cell fill="#1e293b" />
                <Cell fill="#e2e8f0" />
              </Pie>
              {/* Inner ring — Goals on track */}
              <Pie data={[{ value: pieStats.goalsPct }, { value: 100 - pieStats.goalsPct }]} cx={75} cy={75} innerRadius={38} outerRadius={55} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
                <Cell fill="#f59e0b" />
                <Cell fill="#e2e8f0" />
              </Pie>
            </PieChart>
            <div className="flex gap-6 mt-4 text-sm">
              <div className="text-center">
                <p className="font-bold text-gray-800">{pieStats.staffPct}%</p>
                <p className="text-gray-500 text-xs">Staff</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-yellow-500">{pieStats.goalsPct}%</p>
                <p className="text-gray-500 text-xs">Goals</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-500" />
              <h2 className="font-semibold text-gray-800">AI Analytics Insights</h2>
            </div>
            <button
              onClick={generateInsights}
              disabled={insightsLoading}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-slate-800 px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-60"
            >
              <Sparkles size={13} />
              {insightsLoading ? 'Analyzing...' : 'Generate Insights'}
            </button>
          </div>
          {insights.length > 0 ? (
            <div className="space-y-3">
              {insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">
              Click "Generate Insights" to get AI-powered analytics based on your school's live data.
            </p>
          )}
        </div>

        {/* Recent Reviews Table */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Recent Performance Reviews</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100">
                <th className="text-left py-2 font-medium">Name</th>
                <th className="text-left py-2 font-medium">Status</th>
                <th className="text-left py-2 font-medium">Department</th>
                <th className="text-left py-2 font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {recentReviews.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-semibold text-xs">
                      {r.teacher[0]}
                    </div>
                    {r.teacher}
                  </td>
                  <td className="py-3 text-gray-500">{r.dept}</td>
                  <td className="py-3 text-gray-500">{r.status}</td>
                  <td className="py-3 font-semibold text-slate-700">{r.overall}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
