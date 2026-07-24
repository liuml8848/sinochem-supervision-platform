import { useState } from 'react'
import {
  Activity,
  FileWarning,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Eye,
  ChevronRight,
} from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { RiskLevelTag, StatusBadge } from '@/components/StatusBadge'

interface ModelCard {
  id: string
  name: string
  description: string
  icon: any
  color: string
  alertCount: number
  accuracy: string
  lastRun: string
  status: 'running' | 'idle' | 'error'
}

const modelCards: ModelCard[] = [
  {
    id: 'M001',
    name: '供应商资质过期检测模型',
    description: '自动检测供应商营业执照、生产许可证、安全许可证等资质文件的有效期，提前预警即将过期的资质证书',
    icon: FileWarning,
    color: '#F59E0B',
    alertCount: 18,
    accuracy: '96.8%',
    lastRun: '2026-07-24 03:00',
    status: 'running',
  },
  {
    id: 'M002',
    name: '供应商履约能力不足检测模型',
    description: '基于供应商历史交付数据、财务报表、产能信息等综合分析，评估供应商持续履约能力',
    icon: ShieldAlert,
    color: '#EF4444',
    alertCount: 12,
    accuracy: '93.5%',
    lastRun: '2026-07-24 02:00',
    status: 'idle',
  },
  {
    id: 'M003',
    name: '供应商画像评分模型',
    description: '综合供应商工商信息、经营状况、交易记录、风险事件等多维度数据，生成供应商信用评分和风险画像',
    icon: TrendingUp,
    color: '#38BDF8',
    alertCount: 7,
    accuracy: '91.2%',
    lastRun: '2026-07-23 22:00',
    status: 'idle',
  },
]

interface AlertRecord {
  id: string
  supplier: string
  model: string
  level: 'red' | 'orange' | 'yellow'
  time: string
  status: 'pending' | 'processing' | 'completed'
  summary: string
}

const alertData: AlertRecord[] = [
  { id: 'AL202607001', supplier: '中化蓝天集团有限公司', model: '资质过期检测', level: 'orange', time: '2026-07-24 08:30', status: 'pending', summary: '安全生产许可证将于30天后到期' },
  { id: 'AL202607002', supplier: '江苏中化化工装备有限公司', model: '履约能力不足检测', level: 'red', time: '2026-07-24 06:15', status: 'processing', summary: '连续3个月交付延迟率超15%' },
  { id: 'AL202607003', supplier: '上海中化国际物流有限公司', model: '画像评分', level: 'yellow', time: '2026-07-23 14:20', status: 'pending', summary: '企业信用评分下降12分（当前78分）' },
  { id: 'AL202607004', supplier: '中化石油销售有限公司', model: '资质过期检测', level: 'orange', time: '2026-07-23 11:00', status: 'completed', summary: '危险化学品经营许可证即将到期' },
  { id: 'AL202607005', supplier: '深圳中化信息技术有限公司', model: '履约能力不足检测', level: 'red', time: '2026-07-22 09:45', status: 'processing', summary: '项目交付验收不合格率超20%' },
  { id: 'AL202607006', supplier: '北京中化工程科技有限公司', model: '画像评分', level: 'yellow', time: '2026-07-22 08:30', status: 'pending', summary: '涉及诉讼案件增加（当前3起）' },
  { id: 'AL202607007', supplier: '江苏中化化工装备有限公司', model: '资质过期检测', level: 'orange', time: '2026-07-21 16:00', status: 'pending', summary: '特种设备制造许可证将在45天后到期' },
  { id: 'AL202607008', supplier: '广州中化贸易有限公司', model: '履约能力不足检测', level: 'red', time: '2026-07-21 10:20', status: 'completed', summary: '资产负债率超过行业警戒线（78.5%）' },
]

const scoreHistory = [
  { month: '1月', score: 72, trend: 'up' },
  { month: '2月', score: 68, trend: 'down' },
  { month: '3月', score: 65, trend: 'down' },
  { month: '4月', score: 70, trend: 'up' },
  { month: '5月', score: 74, trend: 'up' },
  { month: '6月', score: 71, trend: 'down' },
  { month: '7月', score: 63, trend: 'down' },
]

const statusConfig = {
  pending: { level: 'yellow' as const, label: '待处理' },
  processing: { level: 'blue' as const, label: '处理中' },
  completed: { level: 'green' as const, label: '已完成' },
}

export function MonitoringModel() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [filterLevel, setFilterLevel] = useState<string>('all')

  const filteredAlerts = alertData.filter((a) => {
    const matchModel = selectedModel ? a.model.includes(selectedModel) : true
    const matchLevel = filterLevel === 'all' ? true : a.level === filterLevel
    return matchModel && matchLevel
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="供应商模型监测"
        description="供应商风险模型运行状态与预警监控"
      />

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {modelCards.map((model) => {
          const Icon = model.icon
          const isSelected = selectedModel === model.id
          return (
            <div
              key={model.id}
              onClick={() => setSelectedModel(isSelected ? null : model.id)}
              className={`
                cursor-pointer rounded-lg bg-white p-5 shadow-card transition-all hover:shadow-card-hover
                ${isSelected ? 'ring-2 ring-[#38BDF8]' : ''}
              `}
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: model.color + '15' }}
                >
                  <Icon size={20} style={{ color: model.color }} />
                </div>
                <StatusBadge
                  level={model.status === 'running' ? 'green' : model.status === 'error' ? 'red' : 'gray'}
                  label={model.status === 'running' ? '运行中' : model.status === 'error' ? '异常' : '待机'}
                />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-[#0F2245]">{model.name}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#8BA4C7] line-clamp-2">
                {model.description}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#D8E2F0] pt-3 text-center text-xs">
                <div>
                  <p className="font-number text-base font-bold text-[#EF4444]">{model.alertCount}</p>
                  <p className="text-[#8BA4C7]">预警数</p>
                </div>
                <div>
                  <p className="font-number text-base font-bold text-[#2DD4BF]">{model.accuracy}</p>
                  <p className="text-[#8BA4C7]">准确率</p>
                </div>
                <div>
                  <p className="font-number text-xs text-[#0F2245]">{model.lastRun}</p>
                  <p className="text-[#8BA4C7]">最后运行</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Alert List Table */}
        <div className="rounded-lg bg-white p-5 shadow-card lg:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#0F2245]">预警记录</h3>
              <p className="mt-0.5 text-xs text-[#8BA4C7]">
                共 {filteredAlerts.length} 条预警记录
                {selectedModel && '（已筛选模型）'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {['all', 'red', 'orange', 'yellow'].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterLevel(level)}
                  className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                    filterLevel === level
                      ? 'bg-[#0B1D4A] text-white'
                      : 'bg-[#EDF2F9] text-[#8BA4C7] hover:bg-[#D8E2F0]'
                  }`}
                >
                  {level === 'all' ? '全部' : level === 'red' ? '红色' : level === 'orange' ? '橙色' : '黄色'}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#D8E2F0]">
                  <th className="pb-2 pr-3 font-medium text-[#8BA4C7]">预警编号</th>
                  <th className="pb-2 pr-3 font-medium text-[#8BA4C7]">供应商</th>
                  <th className="pb-2 pr-3 font-medium text-[#8BA4C7]">触发模型</th>
                  <th className="pb-2 pr-3 font-medium text-[#8BA4C7]">预警级别</th>
                  <th className="pb-2 pr-3 font-medium text-[#8BA4C7]">触发时间</th>
                  <th className="pb-2 font-medium text-[#8BA4C7]">状态</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.map((alert) => (
                  <tr
                    key={alert.id}
                    className="border-b border-[#D8E2F0] transition-colors hover:bg-[#EDF2F9]/50"
                  >
                    <td className="py-2.5 pr-3 font-number text-[#0F2245]">{alert.id}</td>
                    <td className="py-2.5 pr-3 text-[#0F2245]">{alert.supplier}</td>
                    <td className="py-2.5 pr-3 text-[#8BA4C7]">{alert.model}</td>
                    <td className="py-2.5 pr-3">
                      <RiskLevelTag level={alert.level === 'red' ? 'red' : alert.level === 'orange' ? 'orange' : 'yellow'} />
                    </td>
                    <td className="py-2.5 pr-3 text-[#8BA4C7]">{alert.time}</td>
                    <td className="py-2.5">
                      <StatusBadge
                        level={statusConfig[alert.status].level}
                        label={statusConfig[alert.status].label}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAlerts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Activity size={32} className="text-[#D8E2F0]" />
              <p className="mt-2 text-xs text-[#8BA4C7]">暂无匹配的预警记录</p>
            </div>
          )}
        </div>

        {/* Risk Score Trend */}
        <div className="rounded-lg bg-white p-5 shadow-card lg:col-span-3">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-[#0F2245]">综合风险评分趋势</h3>
            <p className="mt-0.5 text-xs text-[#8BA4C7]">近7月供应商整体风险评分变化</p>
          </div>

          {/* SVG Line Chart */}
          <svg viewBox="0 0 300 160" className="w-full" style={{ height: 180 }}>
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((v) => {
              const y = 140 - (v / 100) * 120
              return (
                <g key={v}>
                  <line x1="20" y1={y} x2="280" y2={y} stroke="#EDF2F9" strokeWidth="1" />
                  <text x="15" y={y + 3} textAnchor="end" fontSize="8" fill="#8BA4C7">
                    {v}
                  </text>
                </g>
              )
            })}

            {/* Y-axis label */}
            <text x="8" y="75" textAnchor="middle" fontSize="8" fill="#8BA4C7" transform="rotate(-90,8,75)">
              风险评分
            </text>

            {/* Area fill */}
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path
              d={`M ${scoreHistory.map((d, i) => {
                const x = 30 + i * (250 / (scoreHistory.length - 1))
                const y = 140 - (d.score / 100) * 120
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
              }).join(' ')} L ${30 + (scoreHistory.length - 1) * (250 / (scoreHistory.length - 1))} 140 L 30 140 Z`}
              fill="url(#scoreGradient)"
            />

            {/* Line */}
            <path
              d={scoreHistory.map((d, i) => {
                const x = 30 + i * (250 / (scoreHistory.length - 1))
                const y = 140 - (d.score / 100) * 120
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
              }).join(' ')}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {scoreHistory.map((d, i) => {
              const x = 30 + i * (250 / (scoreHistory.length - 1))
              const y = 140 - (d.score / 100) * 120
              return (
                <g key={d.month}>
                  <circle cx={x} cy={y} r="3.5" fill="#38BDF8" stroke="white" strokeWidth="1.5" />
                  <text x={x} y={y - 10} textAnchor="middle" fontSize="9" fill="#0F2245" fontWeight="600">
                    {d.score}
                  </text>
                  <text x={x} y={150} textAnchor="middle" fontSize="8" fill="#8BA4C7">
                    {d.month}
                  </text>
                  {/* Trend arrow */}
                  {d.trend === 'down' && (
                    <text x={x + 10} y={y - 10} fontSize="8" fill="#EF4444">↓</text>
                  )}
                  {d.trend === 'up' && (
                    <text x={x + 10} y={y - 10} fontSize="8" fill="#2DD4BF">↑</text>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Summary Stats */}
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#D8E2F0] pt-4 text-center text-xs">
            <div>
              <p className="text-[#8BA4C7]">最高评分</p>
              <p className="mt-1 font-number text-lg font-bold text-[#2DD4BF]">74</p>
            </div>
            <div>
              <p className="text-[#8BA4C7]">最低评分</p>
              <p className="mt-1 font-number text-lg font-bold text-[#EF4444]">63</p>
            </div>
            <div>
              <p className="text-[#8BA4C7]">平均评分</p>
              <p className="mt-1 font-number text-lg font-bold text-[#F59E0B]">69</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
