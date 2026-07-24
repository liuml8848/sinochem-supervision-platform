import { TrendingUp, AlertTriangle, CheckCircle, FolderOpen } from 'lucide-react'

export function GroupCockpit() {
  const stats = [
    { label: '监察总数', value: 2847, trend: '+12.3%', icon: TrendingUp, color: '#38BDF8' },
    { label: '问题总数', value: 156, trend: '-5.2%', icon: AlertTriangle, color: '#EF4444' },
    { label: '问题项目', value: 45, trend: '+8.7%', icon: FolderOpen, color: '#F59E0B' },
    { label: '正常项目', value: 72, trend: '+15%', icon: CheckCircle, color: '#2DD4BF' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-page-title text-[#0B1D4A]">集团视图 · 驾驶舱</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8BA4C7]">{s.label}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: s.color + '15' }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-data-large text-[#0F2245]">{s.value.toLocaleString()}</span>
              <span className={`text-xs font-medium ${s.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{s.trend}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-card">
          <h3 className="font-semibold text-[#0F2245] mb-4">月度监察趋势</h3>
          <div className="flex items-end gap-2 h-48">
            {['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'].map((m, i) => {
              const h = 30 + Math.sin(i * 0.5) * 20 + Math.random() * 40
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-t-sm bg-[#38BDF8]" style={{ height: h, opacity: 0.3 + i * 0.05 }} />
                  <span className="text-[10px] text-[#8BA4C7]">{m}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-card">
          <h3 className="font-semibold text-[#0F2245] mb-4">各部门问题分布</h3>
          <div className="space-y-3">
            {[
              { name: '农业事业部', count: 28, risk: '6.7%' },
              { name: '化工事业部', count: 35, risk: '8.2%' },
              { name: '能源事业部', count: 22, risk: '5.1%' },
              { name: '地产事业部', count: 18, risk: '4.3%' },
              { name: '金融事业部', count: 15, risk: '3.8%' },
            ].map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <span className="w-20 text-xs text-[#8BA4C7] truncate">{d.name}</span>
                <div className="flex-1 h-5 bg-[#F8FAFD] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#38BDF8]" style={{ width: `${(d.count / 40) * 100}%` }} />
                </div>
                <span className="text-xs font-medium text-[#0F2245] w-8 text-right">{d.count}</span>
                <span className="text-xs text-red-500 w-10 text-right">{d.risk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
