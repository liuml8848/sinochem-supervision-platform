import { AlertCircle, Clock, CheckCircle2, AlertTriangle, User, Calendar, ArrowUpRight } from 'lucide-react'

const STATS = [
  { label: '待处理', value: 23, color: '#F59E0B', icon: Clock },
  { label: '处理中', value: 45, color: '#38BDF8', icon: AlertCircle },
  { label: '已完成', value: 156, color: '#2DD4BF', icon: CheckCircle2 },
  { label: '逾期', value: 8, color: '#EF4444', icon: AlertTriangle },
]

interface Task {
  id: number
  title: string
  domain: string
  domainColor: string
  level: string
  levelColor: string
  deadline: string
  handler: string
  priority: string
  priorityColor: string
}

const PENDING_TASKS: Task[] = [
  { id: 1, title: '某化工子公司招标项目中投标人IP地址一致异常', domain: '招标采购', domainColor: '#EF4444', level: '高风险', levelColor: '#EF4444', deadline: '2026-07-28', handler: '张明华', priority: '紧急', priorityColor: '#EF4444' },
  { id: 2, title: '某贸易公司客户与在职员工直系亲属关联嫌疑', domain: '经商办企', domainColor: '#8B5CF6', level: '高风险', levelColor: '#EF4444', deadline: '2026-07-26', handler: '李志强', priority: '紧急', priorityColor: '#EF4444' },
  { id: 3, title: '某下属企业大额资金转出未按审批流程执行', domain: '财务监督', domainColor: '#38BDF8', level: '中风险', levelColor: '#F59E0B', deadline: '2026-07-30', handler: '王雪梅', priority: '普通', priorityColor: '#8BA4C7' },
  { id: 4, title: '某采购项目评标得分异常集中需复核', domain: '招标采购', domainColor: '#EF4444', level: '中风险', levelColor: '#F59E0B', deadline: '2026-07-25', handler: '陈晓东', priority: '普通', priorityColor: '#8BA4C7' },
]

const IN_PROGRESS_TASKS: Task[] = [
  { id: 5, title: '某子公司年度钢材采购价格偏离市场均价20%', domain: '招标采购', domainColor: '#EF4444', level: '高风险', levelColor: '#EF4444', deadline: '2026-07-31', handler: '刘思远', priority: '紧急', priorityColor: '#EF4444' },
  { id: 6, title: '某新能源企业应收账款账龄超365天仍未回款', domain: '财务监督', domainColor: '#38BDF8', level: '中风险', levelColor: '#F59E0B', deadline: '2026-08-05', handler: '赵丽华', priority: '普通', priorityColor: '#8BA4C7' },
  { id: 7, title: '某基建项目中标人与招标代理存在历史关联关系', domain: '招标采购', domainColor: '#EF4444', level: '低风险', levelColor: '#2DD4BF', deadline: '2026-08-10', handler: '周志国', priority: '一般', priorityColor: '#8BA4C7' },
]

const COMPLETED_TASKS: Task[] = [
  { id: 8, title: '某企业职工持股外部公司未如实申报已整改', domain: '经商办企', domainColor: '#8B5CF6', level: '中风险', levelColor: '#F59E0B', deadline: '2026-07-15', handler: '吴海燕', priority: '普通', priorityColor: '#8BA4C7' },
  { id: 9, title: '某项目违规拆借资金已归还并完善内控制度', domain: '财务监督', domainColor: '#38BDF8', level: '高风险', levelColor: '#EF4444', deadline: '2026-07-12', handler: '郑晓峰', priority: '紧急', priorityColor: '#EF4444' },
  { id: 10, title: '某子公司应招未招项目已补办招标手续', domain: '招标采购', domainColor: '#EF4444', level: '低风险', levelColor: '#2DD4BF', deadline: '2026-07-10', handler: '孙丽娜', priority: '一般', priorityColor: '#8BA4C7' },
]

type ColumnKey = 'pending' | 'inProgress' | 'completed'

const COLUMNS: { key: ColumnKey; title: string; tasks: Task[]; color: string }[] = [
  { key: 'pending', title: '待处置', tasks: PENDING_TASKS, color: '#F59E0B' },
  { key: 'inProgress', title: '处置中', tasks: IN_PROGRESS_TASKS, color: '#38BDF8' },
  { key: 'completed', title: '已完成', tasks: COMPLETED_TASKS, color: '#2DD4BF' },
]

function TaskCard({ task }: { task: Task }) {
  return (
    <div className="rounded-lg border border-[#D8E2F0] bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-[#8BA4C7]/30">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-[#0F2245] leading-snug flex-1">{task.title}</h4>
        <span
          className="shrink-0 rounded px-1.5 py-0.5 text-xs font-medium"
          style={{ backgroundColor: task.levelColor + '14', color: task.levelColor }}
        >
          {task.level}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ backgroundColor: task.domainColor + '10', color: task.domainColor }}
        >
          {task.domain}
        </span>
        <span
          className="rounded px-1.5 py-0.5 text-xs"
          style={{ backgroundColor: task.priorityColor + '12', color: task.priorityColor }}
        >
          {task.priority}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-[#8BA4C7]">
        <span className="flex items-center gap-1">
          <User size={12} />
          {task.handler}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {task.deadline}
        </span>
      </div>
    </div>
  )
}

export function DisposalWorkbench() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title text-[#0B1D4A]">处置工作台</h1>
        <p className="mt-1 text-sm text-[#8BA4C7]">全流程风险处置任务管理与跟踪</p>
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
                <span className="text-sm text-[#8BA4C7]">件</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {COLUMNS.map((col) => (
          <div key={col.key} className="rounded-lg border border-[#D8E2F0] bg-[#F8FAFD] p-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: col.color }} />
              <h3 className="text-sm font-semibold text-[#0F2245]">{col.title}</h3>
              <span
                className="ml-auto rounded-full px-2 py-0.5 text-xs font-medium"
                style={{ backgroundColor: col.color + '14', color: col.color }}
              >
                {col.tasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {col.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
            {col.tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-[#8BA4C7]">
                <CheckCircle2 size={32} className="mb-2 text-[#D8E2F0]" />
                <p className="text-xs">暂无任务</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg bg-white p-5 shadow-card">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold text-[#0F2245]">快捷操作</h3>
          {[
            { label: '批量派单', color: '#38BDF8' },
            { label: '催办提醒', color: '#F59E0B' },
            { label: '导出报表', color: '#2DD4BF' },
          ].map((action) => (
            <button
              key={action.label}
              className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: action.color }}
            >
              {action.label}
              <ArrowUpRight size={14} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
