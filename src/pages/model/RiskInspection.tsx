import { useState } from 'react'
import {
  Search,
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  RefreshCw,
  FileText,
  Building2,
  Calendar,
  Timer,
} from 'lucide-react'

interface InspectionTask {
  id: number
  name: string
  modelName: string
  orgs: string[]
  type: 'manual' | 'scheduled'
  schedule: string
  status: 'pending' | 'running' | 'completed' | 'paused' | 'error'
  progress: number
  lastRun: string
  nextRun: string
  resultSummary: string
  riskCount: number
}

const TASKS: InspectionTask[] = [
  {
    id: 1,
    name: '月度围标串标巡检',
    modelName: '围标串标检测模型',
    orgs: ['集团总部', '能源事业部', '化工事业部'],
    type: 'scheduled',
    schedule: '每月1日 00:00',
    status: 'completed',
    progress: 100,
    lastRun: '2025-07-01 01:23:45',
    nextRun: '2025-08-01 00:00:00',
    resultSummary: '扫描项目1,247个，发现高风险线索3条，中风险线索12条',
    riskCount: 15,
  },
  {
    id: 2,
    name: '关联交易季度排查',
    modelName: '关联交易识别流程',
    orgs: ['集团总部', '所有下属企业'],
    type: 'scheduled',
    schedule: '每季首月5日 02:00',
    status: 'running',
    progress: 65,
    lastRun: '2025-07-05 02:00:10',
    nextRun: '2025-10-05 02:00:00',
    resultSummary: '正在扫描第二季度交易数据，已处理交易记录38万条',
    riskCount: 0,
  },
  {
    id: 3,
    name: '供应商资质年度复审',
    modelName: '供应商准入审批流程',
    orgs: ['采购中心', '各事业部采购部'],
    type: 'scheduled',
    schedule: '每年6月1日 08:00',
    status: 'completed',
    progress: 100,
    lastRun: '2025-06-01 09:45:20',
    nextRun: '2026-06-01 08:00:00',
    resultSummary: '复审供应商1,832家，高风险供应商23家，中风险供应商87家',
    riskCount: 110,
  },
  {
    id: 4,
    name: '资金异常流向实时监控',
    modelName: '资金异常流向检测流程',
    orgs: ['集团财务部', '资金管理中心'],
    type: 'manual',
    schedule: '按需执行',
    status: 'running',
    progress: 42,
    lastRun: '2025-07-23 10:00:00',
    nextRun: '--',
    resultSummary: '实时监控中，已分析当日交易流水12.6万笔',
    riskCount: 0,
  },
  {
    id: 5,
    name: '应招未招专项检查',
    modelName: '应招未招检测模型',
    orgs: ['集团总部', '工程建设部'],
    type: 'manual',
    schedule: '2025-07-20 14:00',
    status: 'pending',
    progress: 0,
    lastRun: '2025-06-15 16:30:00',
    nextRun: '2025-07-20 14:00:00',
    resultSummary: '等待执行，预计扫描采购项目约3,500个',
    riskCount: 0,
  },
  {
    id: 6,
    name: '经商办企全员排查',
    modelName: '在职员工经商办企检测',
    orgs: ['人力资源部', '所有下属企业'],
    type: 'scheduled',
    schedule: '每季度末月30日 03:00',
    status: 'completed',
    progress: 100,
    lastRun: '2025-06-30 05:12:33',
    nextRun: '2025-09-30 03:00:00',
    resultSummary: '排查员工18,246人，发现未经申报经商办企员工34人',
    riskCount: 34,
  },
  {
    id: 7,
    name: '违规分包突击巡检',
    modelName: '违规分包检测流程',
    orgs: ['工程建设部', '项目管理中心'],
    type: 'manual',
    schedule: '2025-07-22 09:00',
    status: 'error',
    progress: 78,
    lastRun: '2025-07-22 09:15:22',
    nextRun: '--',
    resultSummary: '执行过程中数据源连接异常，已完成部分扫描',
    riskCount: 8,
  },
  {
    id: 8,
    name: '专家库回避检查',
    modelName: '专家回避检测流程',
    orgs: ['招标管理办公室', '纪检监察部'],
    type: 'scheduled',
    schedule: '每月15日 02:00',
    status: 'completed',
    progress: 100,
    lastRun: '2025-07-15 03:08:45',
    nextRun: '2025-08-15 02:00:00',
    resultSummary: '检查评标项目286个，发现专家回避异常5起',
    riskCount: 5,
  },
]

const STATUS_TABS = [
  { key: 'all', label: '全部', count: TASKS.length },
  { key: 'pending', label: '待执行', count: TASKS.filter((t) => t.status === 'pending').length },
  { key: 'running', label: '执行中', count: TASKS.filter((t) => t.status === 'running').length },
  { key: 'completed', label: '已完成', count: TASKS.filter((t) => t.status === 'completed').length },
  { key: 'paused', label: '已暂停', count: TASKS.filter((t) => t.status === 'paused').length },
  { key: 'error', label: '异常', count: TASKS.filter((t) => t.status === 'error').length },
]

const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: typeof Play }> = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: Clock },
  running: { bg: 'bg-blue-50', text: 'text-blue-600', icon: RefreshCw },
  completed: { bg: 'bg-green-50', text: 'text-green-600', icon: CheckCircle2 },
  paused: { bg: 'bg-gray-100', text: 'text-gray-500', icon: PauseCircle },
  error: { bg: 'bg-red-50', text: 'text-red-600', icon: AlertCircle },
}

export function RiskInspection() {
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = TASKS.filter((t) => {
    const matchTab = activeTab === 'all' || t.status === activeTab
    const matchSearch = !search || t.name.includes(search) || t.modelName.includes(search) || t.orgs.some((o) => o.includes(search))
    return matchTab && matchSearch
  })

  const stats = [
    { label: '巡检任务总数', value: TASKS.length, color: '#38BDF8', icon: FileText },
    { label: '已完成', value: TASKS.filter((t) => t.status === 'completed').length, color: '#2DD4BF', icon: CheckCircle2 },
    { label: '执行中', value: TASKS.filter((t) => t.status === 'running').length, color: '#38BDF8', icon: RefreshCw },
    { label: '异常', value: TASKS.filter((t) => t.status === 'error').length, color: '#EF4444', icon: AlertCircle },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-page-title text-[#0B1D4A]">风险巡检</h1>
        <p className="mt-1 text-sm text-[#8BA4C7]">
          自动执行监管模型巡检任务，实时监控风险态势
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-lg bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8BA4C7]">{stat.label}</span>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: stat.color + '18' }}
                >
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-data-large text-[#0F2245]">{stat.value}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-1 rounded-lg bg-[#F8FAFD] p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#38BDF8] text-white shadow-sm'
                  : 'text-[#8BA4C7] hover:text-[#0F2245]'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] ${activeTab === tab.key ? 'text-white/80' : 'text-[#8BA4C7]'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8BA4C7]" />
          <input
            type="text"
            placeholder="搜索任务名称或模型..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-60 rounded-md border border-[#D8E2F0] bg-white py-2 pl-9 pr-3 text-sm text-[#0F2245] placeholder:text-[#8BA4C7] focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
          />
        </div>
      </div>

      {/* Task Cards */}
      <div className="space-y-3">
        {filtered.map((task) => {
          const statusCfg = STATUS_CONFIG[task.status]
          const StatusIcon = statusCfg.icon
          return (
            <div
              key={task.id}
              className="rounded-lg bg-white p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-[#0F2245] text-sm">{task.name}</h3>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusCfg.bg} ${statusCfg.text}`}>
                      <StatusIcon size={11} />
                      {
                        task.status === 'pending' ? '待执行' :
                        task.status === 'running' ? '执行中' :
                        task.status === 'completed' ? '已完成' :
                        task.status === 'paused' ? '已暂停' : '异常'
                      }
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#8BA4C7]">
                    <span className="flex items-center gap-1">
                      <Play size={12} />
                      {task.modelName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 size={12} />
                      {task.orgs.join('、')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {task.type === 'scheduled' ? '定时' : '手动'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {task.schedule}
                    </span>
                  </div>
                </div>
                {task.status === 'running' && (
                  <button className="flex items-center gap-1 rounded-lg border border-[#D8E2F0] bg-white px-3 py-1.5 text-xs font-medium text-[#0F2245] hover:bg-[#EDF2F9] transition-colors">
                    <PauseCircle size={13} />
                    暂停
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-[#EDF2F9] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      task.status === 'error' ? 'bg-[#EF4444]' :
                      task.status === 'running' ? 'bg-[#38BDF8]' :
                      task.status === 'completed' ? 'bg-[#2DD4BF]' :
                      'bg-[#D8E2F0]'
                    }`}
                    style={{ width: task.progress + '%' }}
                  />
                </div>
                <span className="text-xs text-[#8BA4C7] font-medium w-8 text-right">{task.progress}%</span>
              </div>

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between border-t border-[#F0F2F5] pt-3">
                <div className="flex items-center gap-4 text-xs text-[#8BA4C7]">
                  <span className="flex items-center gap-1">
                    <Timer size={12} />
                    上次: {task.lastRun}
                  </span>
                  {task.nextRun !== '--' && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      下次: {task.nextRun}
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#8BA4C7] max-w-[400px] truncate">{task.resultSummary}</span>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[#8BA4C7]">
            <Search size={48} className="text-[#D8E2F0]" />
            <p className="mt-4 text-sm">未找到匹配的巡检任务</p>
          </div>
        )}
      </div>
    </div>
  )
}
