import { useState } from 'react'
import { Send, Cpu, Clock, Settings, Plus, ToggleLeft, ToggleRight, History } from 'lucide-react'

const STATS = [
  { label: '今日派单', value: 12, unit: '件', color: '#38BDF8', icon: Send },
  { label: '自动派单率', value: '78.5', unit: '%', color: '#2DD4BF', icon: Cpu },
  { label: '平均响应', value: '2.3', unit: 'h', color: '#8B5CF6', icon: Clock },
]

interface Rule {
  id: number
  name: string
  domain: string
  domainColor: string
  level: string
  levelColor: string
  strategy: '自动' | '手工'
  strategyColor: string
  defaultHandler: string
  enabled: boolean
}

const RULES: Rule[] = [
  { id: 1, name: '招标采购高风险自动派单', domain: '招标采购', domainColor: '#EF4444', level: '高风险', levelColor: '#EF4444', strategy: '自动', strategyColor: '#2DD4BF', defaultHandler: '张明华', enabled: true },
  { id: 2, name: '经商办企高风险派单', domain: '经商办企', domainColor: '#8B5CF6', level: '高风险', levelColor: '#EF4444', strategy: '自动', strategyColor: '#2DD4BF', defaultHandler: '李志强', enabled: true },
  { id: 3, name: '财务监督高风险派单', domain: '财务监督', domainColor: '#38BDF8', level: '高风险', levelColor: '#EF4444', strategy: '自动', strategyColor: '#2DD4BF', defaultHandler: '王雪梅', enabled: true },
  { id: 4, name: '中风险线索手动分派', domain: '全部领域', domainColor: '#8BA4C7', level: '中风险', levelColor: '#F59E0B', strategy: '手工', strategyColor: '#F59E0B', defaultHandler: '处置组长', enabled: true },
  { id: 5, name: '低风险线索归档处理', domain: '全部领域', domainColor: '#8BA4C7', level: '低风险', levelColor: '#2DD4BF', strategy: '自动', strategyColor: '#2DD4BF', defaultHandler: '系统归档', enabled: false },
]

interface HistoryItem {
  id: number
  code: string
  clue: string
  handler: string
  assignTime: string
  status: string
  statusColor: string
}

const HISTORY: HistoryItem[] = [
  { id: 1, code: 'PD-2026-0042', clue: '某化工项目三家投标人MAC地址相同', handler: '张明华', assignTime: '2026-07-24 09:15', status: '已签收', statusColor: '#2DD4BF' },
  { id: 2, code: 'PD-2026-0041', clue: '某子公司设备采购金额超过300万元未招标', handler: '李志强', assignTime: '2026-07-23 14:30', status: '处理中', statusColor: '#38BDF8' },
  { id: 3, code: 'PD-2026-0040', clue: '某区域负责人配偶名下公司业务往来异常', handler: '王雪梅', assignTime: '2026-07-23 10:00', status: '已签收', statusColor: '#2DD4BF' },
  { id: 4, code: 'PD-2026-0039', clue: '某贸易公司应收账款逾期超1年', handler: '刘思远', assignTime: '2026-07-22 16:45', status: '处理中', statusColor: '#38BDF8' },
  { id: 5, code: 'PD-2026-0038', clue: '某项目投标人中标率异常偏高', handler: '赵丽华', assignTime: '2026-07-22 11:20', status: '已完成', statusColor: '#8BA4C7' },
]

export function AutoAssign() {
  const [rules, setRules] = useState(RULES)
  const [activeTab, setActiveTab] = useState<'rules' | 'history'>('rules')

  const toggleRule = (id: number) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title text-[#0B1D4A]">智能派单</h1>
        <p className="mt-1 text-sm text-[#8BA4C7]">风险线索自动分配与派单规则管理</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-lg bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8BA4C7]">{stat.label}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: stat.color + '14', color: stat.color }}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-data-large text-[#0F2245]">{stat.value}</span>
                <span className="text-sm text-[#8BA4C7]">{stat.unit}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-[#F8FAFD] p-1 w-fit">
        <button
          onClick={() => setActiveTab('rules')}
          className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'rules' ? 'bg-white text-[#0B1D4A] shadow-sm' : 'text-[#8BA4C7] hover:text-[#0F2245]'
          }`}
        >
          <Settings size={16} />
          派单规则
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'history' ? 'bg-white text-[#0B1D4A] shadow-sm' : 'text-[#8BA4C7] hover:text-[#0F2245]'
          }`}
        >
          <History size={16} />
          派单记录
        </button>
      </div>

      {/* Rules Table */}
      {activeTab === 'rules' && (
        <div className="overflow-hidden rounded-lg bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-[#D8E2F0] px-5 py-4">
            <h3 className="text-sm font-semibold text-[#0F2245]">派单规则列表</h3>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-[#0B1D4A] px-3.5 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
              <Plus size={14} />
              新增规则
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#D8E2F0] bg-[#F8FAFD]">
                  <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">规则名称</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">适用领域</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">风险级别</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">分配策略</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">默认处理人</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">状态</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id} className="border-b border-[#D8E2F0]/50 last:border-b-0 hover:bg-[#F8FAFD] transition-colors">
                    <td className="px-5 py-3.5 text-sm text-[#0F2245] font-medium">{rule.name}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{ backgroundColor: rule.domainColor + '10', color: rule.domainColor }}
                      >
                        {rule.domain}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-block rounded px-2 py-0.5 text-xs font-semibold"
                        style={{ backgroundColor: rule.levelColor + '14', color: rule.levelColor }}
                      >
                        {rule.level}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ backgroundColor: rule.strategyColor + '12', color: rule.strategyColor }}
                      >
                        {rule.strategy}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[#8BA4C7]">{rule.defaultHandler}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleRule(rule.id)}
                        className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
                          rule.enabled ? 'text-green-600' : 'text-[#8BA4C7]'
                        }`}
                      >
                        {rule.enabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        {rule.enabled ? '已启用' : '已停用'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="text-xs font-medium text-[#38BDF8] hover:text-[#0B1D4A] transition-colors">编辑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* History Table */}
      {activeTab === 'history' && (
        <div className="overflow-hidden rounded-lg bg-white shadow-card">
          <div className="border-b border-[#D8E2F0] px-5 py-4">
            <h3 className="text-sm font-semibold text-[#0F2245]">派单历史记录</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#D8E2F0] bg-[#F8FAFD]">
                  <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">派单编号</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">线索</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">处理人</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">派单时间</th>
                  <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">状态</th>
                </tr>
              </thead>
              <tbody>
                {HISTORY.map((item) => (
                  <tr key={item.id} className="border-b border-[#D8E2F0]/50 last:border-b-0 hover:bg-[#F8FAFD] transition-colors">
                    <td className="px-5 py-3.5 text-sm font-mono text-[#0F2245]">{item.code}</td>
                    <td className="px-5 py-3.5 text-sm text-[#0F2245] max-w-[240px] truncate" title={item.clue}>{item.clue}</td>
                    <td className="px-5 py-3.5 text-sm text-[#8BA4C7]">{item.handler}</td>
                    <td className="px-5 py-3.5 text-sm text-[#8BA4C7]">{item.assignTime}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ backgroundColor: item.statusColor + '12', color: item.statusColor }}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-[#D8E2F0] px-5 py-3">
            <span className="text-xs text-[#8BA4C7]">显示 5 条最近记录</span>
            <button className="text-xs font-medium text-[#38BDF8] hover:text-[#0B1D4A] transition-colors">查看全部</button>
          </div>
        </div>
      )}
    </div>
  )
}
