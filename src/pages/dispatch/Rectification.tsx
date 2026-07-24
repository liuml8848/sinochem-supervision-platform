import { useState } from 'react'
import { ClipboardList, AlertCircle, CheckCircle2, Clock, AlertTriangle, Eye, Calendar, Building, User } from 'lucide-react'

const STATS = [
  { label: '整改总数', value: 89, unit: '项', color: '#38BDF8', icon: ClipboardList },
  { label: '整改中', value: 34, unit: '项', color: '#F59E0B', icon: Clock },
  { label: '已整改', value: 48, unit: '项', color: '#2DD4BF', icon: CheckCircle2 },
  { label: '逾期', value: 7, unit: '项', color: '#EF4444', icon: AlertTriangle },
]

const TABS = [
  { key: 'all', label: '全部', count: 89 },
  { key: 'pending', label: '待整改', count: 12 },
  { key: 'inProgress', label: '整改中', count: 22 },
  { key: 'completed', label: '已整改', count: 48 },
  { key: 'overdue', label: '逾期', count: 7 },
] as const

type TabKey = (typeof TABS)[number]['key']

interface Task {
  id: number
  code: string
  description: string
  unit: string
  person: string
  deadline: string
  progress: number
  status: string
  statusColor: string
}

const TASKS: Task[] = [
  { id: 1, code: 'ZG-2026-0015', description: '关于某化工项目投标人MAC地址一致问题的整改要求', unit: '中化蓝天采购部', person: '陈建国', deadline: '2026-08-15', progress: 65, status: '整改中', statusColor: '#F59E0B' },
  { id: 2, code: 'ZG-2026-0014', description: '某子公司设备采购应招未招问题限期整改通知', unit: '中化塑料招标办', person: '林志明', deadline: '2026-08-10', progress: 35, status: '整改中', statusColor: '#F59E0B' },
  { id: 3, code: 'ZG-2026-0013', description: '区域负责人亲属经商办企利益冲突问题整改', unit: '中化作物保护', person: '马晓燕', deadline: '2026-07-30', progress: 0, status: '待整改', statusColor: '#8BA4C7' },
  { id: 4, code: 'ZG-2026-0012', description: '应收账款逾期问题整改方案制定与执行', unit: '财务部', person: '黄伟强', deadline: '2026-08-20', progress: 80, status: '整改中', statusColor: '#F59E0B' },
  { id: 5, code: 'ZG-2026-0011', description: '投标人中标率异常偏高问题核查与处理', unit: '中化国际采购部', person: '许文静', deadline: '2026-07-25', progress: 0, status: '待整改', statusColor: '#8BA4C7' },
  { id: 6, code: 'ZG-2026-0010', description: '某销售经理在外注册同类型公司利益输送问题整改', unit: '人力资源部', person: '何志刚', deadline: '2026-08-05', progress: 50, status: '整改中', statusColor: '#F59E0B' },
  { id: 7, code: 'ZG-2026-0009', description: '资产负债率超警戒线问题的整改措施落实', unit: '战略发展部', person: '曹丽娜', deadline: '2026-08-25', progress: 15, status: '整改中', statusColor: '#F59E0B' },
  { id: 8, code: 'ZG-2026-0008', description: '评标委员会成员关联问题的整改与制度完善', unit: '中化招标公司', person: '沈国平', deadline: '2026-07-28', progress: 100, status: '已整改', statusColor: '#2DD4BF' },
  { id: 9, code: 'ZG-2026-0007', description: '职工持股未如实申报问题已补报并整改到位', unit: '中化方兴', person: '钱晓峰', deadline: '2026-07-20', progress: 100, status: '已整改', statusColor: '#2DD4BF' },
  { id: 10, code: 'ZG-2026-0006', description: '违规拆借资金追回及内控制度整改落实情况', unit: '中化财务公司', person: '韩雪梅', deadline: '2026-07-22', progress: 100, status: '已整改', statusColor: '#2DD4BF' },
  { id: 11, code: 'ZG-2026-0005', description: '应招未招项目补办招标手续完成任务', unit: '中化工程管理部', person: '冯建国', deadline: '2026-07-15', progress: 100, status: '已整改', statusColor: '#2DD4BF' },
  { id: 12, code: 'ZG-2026-0004', description: '某项目投标价格偏离市场均价20%需说明并整改', unit: '采购管理中心', person: '蒋文华', deadline: '2026-08-01', progress: 100, status: '已整改', statusColor: '#2DD4BF' },
  { id: 13, code: 'ZG-2026-0003', description: '某企业疑似资质挂靠问题核查整改', unit: '供应商管理部', person: '姜海燕', deadline: '2026-08-18', progress: 0, status: '待整改', statusColor: '#8BA4C7' },
  { id: 14, code: 'ZG-2026-0002', description: '资金异常流向追踪与整改措施落实', unit: '中化审计部', person: '潘志强', deadline: '2026-07-22', progress: 100, status: '已整改', statusColor: '#2DD4BF' },
  { id: 15, code: 'ZG-2026-0001', description: '某基建项目招标程序违规问题全面整改', unit: '中化建设', person: '秦丽华', deadline: '2026-07-18', progress: 100, status: '已整改', statusColor: '#2DD4BF' },
]

export function Rectification() {
  const [activeTab, setActiveTab] = useState<TabKey>('all')

  const filtered = TASKS.filter((t) => {
    if (activeTab === 'all') return true
    if (activeTab === 'pending') return t.status === '待整改'
    if (activeTab === 'inProgress') return t.status === '整改中'
    if (activeTab === 'completed') return t.status === '已整改'
    if (activeTab === 'overdue') {
      const today = new Date('2026-07-24')
      const deadline = new Date(t.deadline)
      return deadline < today && t.status !== '已整改'
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title text-[#0B1D4A]">整改任务</h1>
        <p className="mt-1 text-sm text-[#8BA4C7]">风险线索整改任务跟踪与闭环管理</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Progress Tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-[#F8FAFD] p-1 w-fit">
        {TABS.map((tab) => {
          const isOverdue = tab.key === 'overdue'
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? isOverdue
                    ? 'bg-[#EF4444] text-white shadow-sm'
                    : 'bg-white text-[#0B1D4A] shadow-sm'
                  : 'text-[#8BA4C7] hover:text-[#0F2245]'
              }`}
            >
              {tab.key === 'overdue' && <AlertTriangle size={14} />}
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  isActive
                    ? isOverdue
                      ? 'bg-white/20 text-white'
                      : 'bg-[#EDF2F9] text-[#8BA4C7]'
                    : 'bg-[#EDF2F9] text-[#8BA4C7]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Task List */}
      <div className="overflow-hidden rounded-lg bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#D8E2F0] bg-[#F8FAFD]">
                <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">任务编号</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">问题描述</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">责任单位</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">责任人</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">截止日期</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">整改进度</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">状态</th>
                <th className="px-5 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => (
                <tr key={task.id} className="border-b border-[#D8E2F0]/50 last:border-b-0 hover:bg-[#F8FAFD] transition-colors">
                  <td className="px-5 py-4 text-sm font-mono text-[#0F2245]">{task.code}</td>
                  <td className="px-5 py-4 text-sm text-[#0F2245] max-w-[280px] truncate" title={task.description}>{task.description}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-[#8BA4C7]">
                      <Building size={14} className="shrink-0" />
                      {task.unit}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-[#8BA4C7]">
                      <User size={14} className="shrink-0" />
                      {task.person}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-[#8BA4C7]">
                      <Calendar size={14} className="shrink-0" />
                      {task.deadline}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5 min-w-[140px]">
                      <div className="h-2 flex-1 rounded-full bg-[#EDF2F9] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${task.progress}%`,
                            backgroundColor:
                              task.progress === 100
                                ? '#2DD4BF'
                                : task.progress > 0
                                ? '#38BDF8'
                                : '#D8E2F0',
                          }}
                        />
                      </div>
                      <span
                        className="text-xs font-medium shrink-0 min-w-[2.5rem] text-right"
                        style={{
                          color:
                            task.progress === 100
                              ? '#2DD4BF'
                              : task.progress > 0
                              ? '#38BDF8'
                              : '#8BA4C7',
                        }}
                      >
                        {task.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{ backgroundColor: task.statusColor + '12', color: task.statusColor }}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button className="inline-flex items-center gap-1 text-xs font-medium text-[#38BDF8] hover:text-[#0B1D4A] transition-colors">
                      <Eye size={14} />
                      详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[#8BA4C7]">
            <CheckCircle2 size={48} className="text-[#D8E2F0]" />
            <p className="mt-4 text-sm">暂无整改任务</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#D8E2F0] px-5 py-3">
          <span className="text-xs text-[#8BA4C7]">
            显示 {filtered.length} 条，共 {TASKS.length} 条
          </span>
          <div className="flex items-center gap-1">
            <button className="rounded-md border border-[#D8E2F0] px-3 py-1.5 text-xs text-[#8BA4C7] hover:bg-[#F8FAFD]">上一页</button>
            <button className="rounded-md bg-[#0B1D4A] px-3 py-1.5 text-xs text-white">1</button>
            <button className="rounded-md border border-[#D8E2F0] px-3 py-1.5 text-xs text-[#8BA4C7] hover:bg-[#F8FAFD]">2</button>
            <button className="rounded-md border border-[#D8E2F0] px-3 py-1.5 text-xs text-[#8BA4C7] hover:bg-[#F8FAFD]">3</button>
            <span className="px-1 text-xs text-[#8BA4C7]">...</span>
            <button className="rounded-md border border-[#D8E2F0] px-3 py-1.5 text-xs text-[#8BA4C7] hover:bg-[#F8FAFD]">下一页</button>
          </div>
        </div>
      </div>
    </div>
  )
}
