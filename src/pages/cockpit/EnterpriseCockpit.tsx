import { Building2, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

export function EnterpriseCockpit() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-page-title text-[#0B1D4A]">企业视图 · 驾驶舱</h1>
        <select className="rounded-md border border-[#D8E2F0] bg-white px-3 py-1.5 text-sm text-[#0F2245]">
          <option>全部企业</option>
          <option>中化农业</option>
          <option>中化化肥</option>
          <option>中化国际</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: '监察总数', value: 845, icon: TrendingUp, color: '#38BDF8' },
          { label: '问题总数', value: 42, icon: AlertTriangle, color: '#EF4444' },
          { label: '整改中', value: 18, icon: Building2, color: '#F59E0B' },
          { label: '已整改', value: 24, icon: CheckCircle, color: '#2DD4BF' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8BA4C7]">{s.label}</span>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div className="mt-2">
              <span className="text-data-large text-[#0F2245]">{s.value.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-white p-6 shadow-card">
        <h3 className="font-semibold text-[#0F2245] mb-4">企业问题列表</h3>
        <p className="text-sm text-[#8BA4C7]">企业维度的问题详情列表（待完善）</p>
      </div>
    </div>
  )
}
