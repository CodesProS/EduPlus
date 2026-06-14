'use client'

import Header from '../components/Header'
import { Users, Eye, ClipboardList, Target } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

const stats = [
  { label: 'Staff Members', value: '124', icon: Users, color: 'bg-blue-100 text-blue-600' },
  { label: 'Observations', value: '348', icon: Eye, color: 'bg-yellow-100 text-yellow-600' },
  { label: 'Reviews Done', value: '89', icon: ClipboardList, color: 'bg-green-100 text-green-600' },
  { label: 'Active Goals', value: '210', icon: Target, color: 'bg-purple-100 text-purple-600' },
]

const barData = [
  { month: 'Jan', observations: 30, reviews: 12 },
  { month: 'Feb', observations: 45, reviews: 18 },
  { month: 'Mar', observations: 28, reviews: 10 },
  { month: 'Apr', observations: 60, reviews: 25 },
  { month: 'May', observations: 40, reviews: 20 },
  { month: 'Jun', observations: 75, reviews: 30 },
  { month: 'Jul', observations: 55, reviews: 22 },
  { month: 'Aug', observations: 80, reviews: 35 },
  { month: 'Sep', observations: 65, reviews: 28 },
  { month: 'Oct', observations: 50, reviews: 20 },
  { month: 'Nov', observations: 70, reviews: 32 },
  { month: 'Dec', observations: 90, reviews: 40 },
]

const pieData = [
  { name: 'Completed', value: 84 },
  { name: 'Pending', value: 16 },
]

const recentReviews = [
  { name: 'Sarah Johnson', id: 'T-1042', dept: 'Mathematics', score: '94%' },
  { name: 'Mark Davis', id: 'T-2381', dept: 'Science', score: '88%' },
  { name: 'Lisa Chen', id: 'T-0957', dept: 'English', score: '91%' },
  { name: 'James Wilson', id: 'T-3214', dept: 'History', score: '76%' },
  { name: 'Amy Torres', id: 'T-1876', dept: 'Art', score: '85%' },
]

const COLORS = ['#1e293b', '#f59e0b']

export default function Dashboard() {
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
                <p className="text-2xl font-bold text-gray-800">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Bar Chart */}
          <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Observations & Reviews</h2>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-slate-700 inline-block" /> Observations</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" /> Reviews</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="observations" fill="#1e293b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reviews" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center">
            <h2 className="font-semibold text-gray-800 mb-4 self-start">Review Completion</h2>
            <PieChart width={160} height={160}>
              <Pie data={pieData} cx={75} cy={75} innerRadius={50} outerRadius={75} dataKey="value" startAngle={90} endAngle={-270}>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
            <div className="flex gap-6 mt-4 text-sm">
              <div className="text-center">
                <p className="font-bold text-gray-800">84%</p>
                <p className="text-gray-500 text-xs">Staff</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-yellow-500">91%</p>
                <p className="text-gray-500 text-xs">Goals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reviews Table */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Recent Performance Reviews</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100">
                <th className="text-left py-2 font-medium">Name</th>
                <th className="text-left py-2 font-medium">Staff ID</th>
                <th className="text-left py-2 font-medium">Department</th>
                <th className="text-left py-2 font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {recentReviews.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-semibold text-xs">
                      {r.name[0]}
                    </div>
                    {r.name}
                  </td>
                  <td className="py-3 text-gray-500">{r.id}</td>
                  <td className="py-3 text-gray-500">{r.dept}</td>
                  <td className="py-3 font-semibold text-red-500">{r.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
