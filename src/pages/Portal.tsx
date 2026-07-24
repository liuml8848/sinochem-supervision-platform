import { LayoutDashboard } from 'lucide-react'

export default function PortalPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#4A6FA5] text-white">
          <LayoutDashboard size={24} />
        </div>
        <div>
          <h1 className="text-page-title text-[#0B1D4A]">中国中化纪检监察大数据监督平台</h1>
          <p className="text-sm text-[#8BA4C7]">5个监控维度 · 3个监督领域 · 24个监管模型 · 4个功能模块</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: '监控维度', value: '5', sub: '个', color: '#38BDF8' },
          { label: '监督领域', value: '3', sub: '个', color: '#2DD4BF' },
          { label: '监管模型', value: '24', sub: '个', color: '#8B5CF6' },
          { label: '供应商', value: '156', sub: '家', color: '#F59E0B' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8BA4C7]">{stat.label}</span>
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: stat.color }} />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-data-large text-[#0F2245]">{stat.value}</span>
              <span className="text-sm text-[#8BA4C7]">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[
          { title: '驾驶舱', desc: '集团视图与企业视图的数据驾驶舱，实时监控全局风险态势', icon: '📊', color: 'border-t-[#38BDF8]' },
          { title: '风险监督', desc: '涵盖招标采购、经商办企、财务三大领域的风险监督分析', icon: '🔍', color: 'border-t-[#EF4444]' },
          { title: '监管模型', desc: '模型广场、模型编排、风险巡检，智能化监管模型管理', icon: '🧩', color: 'border-t-[#8B5CF6]' },
          { title: '风险处置', desc: '处置工作台、风险线索、智能派单、整改任务全流程管理', icon: '⚡', color: 'border-t-[#F59E0B]' },
          { title: 'AI中心', desc: '政策知识问答、智能分析问数、智能风险报告，AI赋能纪检监察', icon: '🤖', color: 'border-t-[#2DD4BF]' },
        ].map((card) => (
          <div key={card.title} className={`rounded-lg bg-white p-5 shadow-card border-t-2 ${card.color}`}>
            <div className="text-2xl mb-2">{card.icon}</div>
            <h3 className="font-semibold text-[#0F2245] mb-1">{card.title}</h3>
            <p className="text-xs text-[#8BA4C7] leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
