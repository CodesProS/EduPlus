export default function Header({ title }) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">Admin User</p>
          <p className="text-xs text-gray-400">Principal</p>
        </div>
        <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          AD
        </div>
      </div>
    </header>
  )
}
