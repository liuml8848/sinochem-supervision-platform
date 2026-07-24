import { useState } from 'react'
import { Search, ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/StatusBadge'

interface ProjectScoreRow {
  rank: number
  name: string
  department: string
  redCards: number
  orangeCards: number
  yellowCards: number
  totalScore: number
  riskLevel: 'high' | 'medium' | 'low'
}

const MOCK_PROJECTS: ProjectScoreRow[] = [
  { rank: 1, name: '山东临沂化工产业园智能化改造项目', department: '化工事业部', redCards: 3, orangeCards: 5, yellowCards: 8, totalScore: 38.5, riskLevel: 'high' },
  { rank: 2, name: '新疆准东煤炭清洁利用示范基地', department: '能源事业部', redCards: 2, orangeCards: 4, yellowCards: 7, totalScore: 45.2, riskLevel: 'high' },
  { rank: 3, name: '长三角数字供应链综合服务平台', department: '农业事业部', redCards: 1, orangeCards: 6, yellowCards: 9, totalScore: 52.8, riskLevel: 'high' },
  { rank: 4, name: '海南洋浦港区一体化仓储物流项目', department: '物流事业部', redCards: 0, orangeCards: 5, yellowCards: 10, totalScore: 58.3, riskLevel: 'medium' },
  { rank: 5, name: '福建古雷石化基地公用工程配套项目', department: '化工事业部', redCards: 0, orangeCards: 3, yellowCards: 8, totalScore: 63.7, riskLevel: 'medium' },
  { rank: 6, name: '京津冀氢能产业链示范工程项目', department: '能源事业部', redCards: 0, orangeCards: 2, yellowCards: 6, totalScore: 71.4, riskLevel: 'medium' },
  { rank: 7, name: '粤港澳大湾区智慧农业示范基地', department: '农业事业部', redCards: 0, orangeCards: 1, yellowCards: 5, totalScore: 76.9, riskLevel: 'medium' },
  { rank: 8, name: '西部陆海新通道多式联运枢纽', department: '物流事业部', redCards: 0, orangeCards: 0, yellowCards: 4, totalScore: 82.5, riskLevel: 'low' },
  { rank: 9, name: '苏州工业园区绿色低碳数据中心', department: '数字科技部', redCards: 0, orangeCards: 0, yellowCards: 2, totalScore: 88.1, riskLevel: 'low' },
  { rank: 10, name: '上海张江生物医药创新研发中心', department: '健康事业部', redCards: 0, orangeCards: 0, yellowCards: 1, totalScore: 93.6, riskLevel: 'low' },
]

function ScoreGauge({ score, maxScore = 100 }: { score: number; maxScore?: number }) {
  const percentage = (score / maxScore) * 100
  const circumference = 2 * Math.PI * 72
  const offset = circumference - (percentage / 100) * circumference

  const getGaugeColor = (value: number) => {
    if (value >= 80) return '#2DD4BF'
    if (value >= 60) return '#F59E0B'
    return '#EF4444'
  }

  const color = getGaugeColor(score)

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r="72" fill="none" stroke="#EDF2F9" strokeWidth="12" />
        <circle
          cx="90" cy="90" r="72"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 90 90)"
          className="transition-all duration-700"
        />
        <text x="90" y="78" textAnchor="middle" className="text-sm" fill="#8BA4C7">综合风险评分</text>
        <text x="90" y="118" textAnchor="middle" fontSize="40" fontWeight="700" fill="#0F2245" fontFamily="monospace">
          {score}
        </text>
        <text x="90" y="136" textAnchor="middle" fontSize="14" fill="#8BA4C7">/ {maxScore}</text>
      </svg>
    </div>
  )
}

function TrendIcon({ value }: { value: number }) {
  if (value > 0) return <TrendingUp size={14} className="text-red-500" />
  if (value < 0) return <TrendingDown size={14} className="text-green-500" />
  return <Minus size={14} className="text-[#8BA4C7]" />
}

function getScoreColor(score: number): string {
  if (score < 40) return 'text-red-500'
  if (score < 60) return 'text-[#F97316]'
  if (score < 80) return 'text-[#F59E0B]'
  return 'text-[#2DD4BF]'
}

function getScoreBg(score: number): string {
  if (score < 40) return 'bg-red-50'
  if (score < 60) return 'bg-orange-50'
  if (score < 80) return 'bg-yellow-50'
  return 'bg-green-50'
}

export function ProjectScorecard() {
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('全部')

  const departments = ['全部', '化工事业部', '能源事业部', '农业事业部', '物流事业部', '数字科技部', '健康事业部']
  const filteredProjects = MOCK_PROJECTS.filter((p) => {
    const matchSearch = p.name.includes(search) || p.department.includes(search)
    const matchDept = departmentFilter === '全部' || p.department === departmentFilter
    return matchSearch && matchDept
  })

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-page-title text-[#0B1D4A]">项目计分卡</h1>
          <p className="mt-1 text-sm text-[#8BA4C7]">基于多维度指标对在建项目进行综合风险评分与排名</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8BA4C7]" />
            <input
              type="text"
              placeholder="搜索项目名称..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-56 rounded-lg border border-[#D8E2F0] bg-white pl-9 pr-3 text-sm text-[#0F2245] placeholder:text-[#8BA4C7] outline-none focus:border-[#38BDF8]"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="h-9 rounded-lg border border-[#D8E2F0] bg-white px-3 text-sm text-[#0F2245] outline-none focus:border-[#38BDF8]"
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d === '全部' ? '全部部门' : d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overall Gauge + Stat Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Gauge */}
        <div className="rounded-lg bg-white p-5 shadow-card">
          <ScoreGauge score={72} />
        </div>

        {/* Stat Cards */}
        <div className="rounded-lg bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8BA4C7]">红色预警项目</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: '#EF444415' }}>
              <span className="text-sm font-bold text-red-500">!</span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-data-large font-number text-[#0F2245]">12</span>
            <span className="text-sm text-[#8BA4C7]">个</span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <TrendIcon value={2} />
            <span className="text-xs text-red-500">较上月增加2个</span>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8BA4C7]">橙色预警项目</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: '#F9731615' }}>
              <span className="text-sm font-bold text-orange-500">!</span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-data-large font-number text-[#0F2245]">28</span>
            <span className="text-sm text-[#8BA4C7]">个</span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <TrendIcon value={-3} />
            <span className="text-xs text-green-500">较上月减少3个</span>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8BA4C7]">黄色预警项目</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: '#F59E0B15' }}>
              <span className="text-sm font-bold text-yellow-500">!</span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-data-large font-number text-[#0F2245]">45</span>
            <span className="text-sm text-[#8BA4C7]">个</span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <TrendIcon value={5} />
            <span className="text-xs text-red-500">较上月增加5个</span>
          </div>
        </div>
      </div>

      {/* Score Table */}
      <div className="rounded-lg bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-[#EDF2F9] px-6 py-4">
          <h3 className="text-sm font-semibold text-[#0F2245]">项目评分排名</h3>
          <span className="text-xs text-[#8BA4C7]">共 {MOCK_PROJECTS.length} 个项目</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EDF2F9]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#8BA4C7]">排名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#8BA4C7]">项目名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#8BA4C7]">部门</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#8BA4C7]">
                  <span className="text-red-500">红牌数</span>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#8BA4C7]">
                  <span className="text-orange-500">橙牌数</span>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#8BA4C7]">
                  <span className="text-yellow-500">黄牌数</span>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#8BA4C7]">综合得分</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#8BA4C7]">风险等级</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p, idx) => (
                <tr
                  key={p.name}
                  className={cn(
                    'border-b border-[#EDF2F9] text-sm transition-colors hover:bg-[#F8FAFD]',
                    idx === filteredProjects.length - 1 && 'border-b-0'
                  )}
                >
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                      p.rank <= 3 ? 'bg-red-50 text-red-500' : 'bg-[#EDF2F9] text-[#8BA4C7]'
                    )}>
                      {p.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-[#0F2245]">{p.name}</td>
                  <td className="px-4 py-3.5 text-[#8BA4C7]">{p.department}</td>
                  <td className="px-4 py-3.5 text-center font-number text-red-500">{p.redCards}</td>
                  <td className="px-4 py-3.5 text-center font-number text-orange-500">{p.orangeCards}</td>
                  <td className="px-4 py-3.5 text-center font-number text-yellow-500">{p.yellowCards}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={cn(
                      'inline-block rounded-md px-2.5 py-0.5 font-number font-bold',
                      getScoreBg(p.totalScore),
                      getScoreColor(p.totalScore)
                    )}>
                      {p.totalScore}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <StatusBadge level={p.riskLevel} label={p.riskLevel === 'high' ? '高风险' : p.riskLevel === 'medium' ? '中风险' : '低风险'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
