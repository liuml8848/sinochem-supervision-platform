import { useState } from 'react'
import { Search, X, ChevronDown, TrendingUp, TrendingDown, Minus, BarChart3, User, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/StatusBadge'

interface PersonScoreRow {
  rank: number
  name: string
  department: string
  position: string
  redCards: number
  orangeCards: number
  yellowCards: number
  totalScore: number
  riskLevel: 'high' | 'medium' | 'low'
}

interface ScoreBreakdown {
  category: string
  score: number
  maxScore: number
  status: 'normal' | 'warning' | 'critical'
  details: { item: string; score: number; reason: string }[]
}

const MOCK_PEOPLE: PersonScoreRow[] = [
  { rank: 1, name: '张伟', department: '化工事业部采购部', position: '采购经理', redCards: 4, orangeCards: 6, yellowCards: 8, totalScore: 35.2, riskLevel: 'high' },
  { rank: 2, name: '李强', department: '能源事业部工程部', position: '项目经理', redCards: 3, orangeCards: 5, yellowCards: 7, totalScore: 42.8, riskLevel: 'high' },
  { rank: 3, name: '王芳', department: '农业事业部市场部', position: '市场总监', redCards: 2, orangeCards: 7, yellowCards: 9, totalScore: 48.3, riskLevel: 'high' },
  { rank: 4, name: '刘洋', department: '化工事业部项目部', position: '项目主管', redCards: 1, orangeCards: 4, yellowCards: 10, totalScore: 55.6, riskLevel: 'medium' },
  { rank: 5, name: '陈静', department: '物流事业部运营部', position: '运营总监', redCards: 0, orangeCards: 3, yellowCards: 8, totalScore: 62.4, riskLevel: 'medium' },
  { rank: 6, name: '赵明', department: '能源事业部财务部', position: '财务主管', redCards: 0, orangeCards: 2, yellowCards: 6, totalScore: 70.1, riskLevel: 'medium' },
  { rank: 7, name: '孙丽', department: '数字科技部研发中心', position: '技术总监', redCards: 0, orangeCards: 1, yellowCards: 5, totalScore: 78.9, riskLevel: 'medium' },
  { rank: 8, name: '周杰', department: '健康事业部行政部', position: '行政经理', redCards: 0, orangeCards: 0, yellowCards: 4, totalScore: 85.3, riskLevel: 'low' },
  { rank: 9, name: '吴婷', department: '化工事业部法务部', position: '法务主管', redCards: 0, orangeCards: 0, yellowCards: 2, totalScore: 90.7, riskLevel: 'low' },
  { rank: 10, name: '郑鑫', department: '农业事业部技术部', position: '技术专家', redCards: 0, orangeCards: 0, yellowCards: 1, totalScore: 95.2, riskLevel: 'low' },
]

const MOCK_BREAKDOWN: ScoreBreakdown[] = [
  {
    category: '招标采购指标',
    score: 60,
    maxScore: 100,
    status: 'warning',
    details: [
      { item: '关联关系排查', score: 12, reason: '与2家供应商存在间接关联关系未主动申报' },
      { item: '投标合规性', score: 15, reason: '参与某招标项目中存在文件递交时间异常' },
      { item: '采购审批流程', score: 18, reason: '存在3次采购审批绕过规定流程' },
      { item: '供应商管理', score: 15, reason: '未按规定完成供应商履约评价' },
    ],
  },
  {
    category: '经商办企指标',
    score: 40,
    maxScore: 100,
    status: 'critical',
    details: [
      { item: '注册关联企业', score: 10, reason: '名下注册1家与业务相关的咨询公司' },
      { item: '参股投资', score: 10, reason: '持有2家供应商企业股份' },
      { item: '任职关联企业', score: 20, reason: '亲属在供应商企业担任高管' },
    ],
  },
  {
    category: '财务指标',
    score: 75,
    maxScore: 100,
    status: 'normal',
    details: [
      { item: '个人异常消费', score: 20, reason: '差旅费用报销中有3笔异常记录' },
      { item: '收入申报合规', score: 30, reason: '年度个人收入申报完整' },
      { item: '利益冲突申报', score: 25, reason: '存在1项未主动申报的利益关系' },
    ],
  },
]

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

function DetailPanel({ person, onClose }: { person: PersonScoreRow | null; onClose: () => void }) {
  if (!person) return null

  return (
    <div className="rounded-lg bg-white shadow-card">
      {/* Detail Header */}
      <div className="flex items-center justify-between border-b border-[#EDF2F9] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EDF2F9]">
            <User size={20} className="text-[#8BA4C7]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#0F2245]">{person.name} - 计分明细</h3>
            <p className="text-xs text-[#8BA4C7]">{person.department} | {person.position}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn(
            'text-lg font-bold font-number',
            getScoreColor(person.totalScore)
          )}>
            {person.totalScore}
          </span>
          <button onClick={onClose} className="rounded-md p-1 text-[#8BA4C7] hover:bg-[#EDF2F9] transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Breakdown by Category */}
      <div className="space-y-4 p-6">
        {MOCK_BREAKDOWN.map((cat) => {
          const catPct = (cat.score / cat.maxScore) * 100
          const catColor = cat.status === 'critical' ? '#EF4444' : cat.status === 'warning' ? '#F59E0B' : '#2DD4BF'
          return (
            <div key={cat.category} className="rounded-lg border border-[#EDF2F9] p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-[#0F2245]">{cat.category}</h4>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 rounded-full bg-[#EDF2F9] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${catPct}%`, backgroundColor: catColor }}
                    />
                  </div>
                  <span className={cn('text-xs font-medium font-number', getScoreColor(cat.score))}>
                    {cat.score}/{cat.maxScore}
                  </span>
                </div>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#EDF2F9]">
                    <th className="py-2 text-left font-medium text-[#8BA4C7]">评分项</th>
                    <th className="py-2 text-center font-medium text-[#8BA4C7] w-16">得分</th>
                    <th className="py-2 text-left font-medium text-[#8BA4C7]">原因说明</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.details.map((d) => (
                    <tr key={d.item} className="border-b border-[#EDF2F9] last:border-b-0">
                      <td className="py-2.5 text-[#0F2245]">{d.item}</td>
                      <td className="py-2.5 text-center font-number text-[#0F2245]">{d.score}</td>
                      <td className="py-2.5 text-[#8BA4C7]">{d.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>

      {/* Overall Score Bar */}
      <div className="border-t border-[#EDF2F9] px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#0F2245]">综合评分</span>
          <div className="flex items-center gap-3">
            <div className="h-2 w-32 rounded-full bg-[#EDF2F9] overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${person.totalScore}%`, backgroundColor: person.totalScore >= 80 ? '#2DD4BF' : person.totalScore >= 60 ? '#F59E0B' : '#EF4444' }}
              />
            </div>
            <span className="text-sm font-bold font-number text-[#0F2245]">{person.totalScore}</span>
            <StatusBadge level={person.riskLevel} label={person.riskLevel === 'high' ? '高风险' : person.riskLevel === 'medium' ? '中风险' : '低风险'} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function PersonScorecard() {
  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('全部')
  const [selectedPerson, setSelectedPerson] = useState<PersonScoreRow | null>(null)

  const departments = ['全部', '化工事业部采购部', '化工事业部项目部', '化工事业部法务部', '能源事业部工程部', '能源事业部财务部', '农业事业部市场部', '农业事业部技术部', '物流事业部运营部', '数字科技部研发中心', '健康事业部行政部']

  const filteredPeople = MOCK_PEOPLE.filter((p) => {
    const matchSearch = p.name.includes(search) || p.department.includes(search) || p.position.includes(search)
    const matchDept = departmentFilter === '全部' || p.department === departmentFilter
    return matchSearch && matchDept
  })

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-page-title text-[#0B1D4A]">人员计分卡</h1>
          <p className="mt-1 text-sm text-[#8BA4C7]">对关键岗位人员进行综合风险评分，点击可查看详细计分明细</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-lg bg-white p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8BA4C7]" />
            <input
              type="text"
              placeholder="搜索姓名、部门或职位..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-[#D8E2F0] bg-white pl-9 pr-3 text-sm text-[#0F2245] placeholder:text-[#8BA4C7] outline-none focus:border-[#38BDF8]"
            />
          </div>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8BA4C7]" />
            <input
              type="text"
              placeholder="部门"
              value={departmentFilter === '全部' ? '' : departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value || '全部')}
              className="h-9 w-44 rounded-lg border border-[#D8E2F0] bg-white pl-9 pr-3 text-sm text-[#0F2245] placeholder:text-[#8BA4C7] outline-none focus:border-[#38BDF8]"
            />
          </div>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8BA4C7]" />
            <input
              type="text"
              placeholder="日期范围"
              defaultValue="2026年1月 - 2026年6月"
              className="h-9 w-44 rounded-lg border border-[#D8E2F0] bg-white pl-9 pr-3 text-sm text-[#0F2245] placeholder:text-[#8BA4C7] outline-none focus:border-[#38BDF8]"
            />
          </div>
          <button className="h-9 rounded-lg bg-[#0B1D4A] px-4 text-sm font-medium text-white hover:bg-[#0B1D4A]/90 transition-colors">
            查询
          </button>
          <button className="h-9 rounded-lg border border-[#D8E2F0] bg-white px-4 text-sm text-[#0F2245] hover:bg-[#EDF2F9] transition-colors">
            重置
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8BA4C7]">计分人员总数</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: '#38BDF815' }}>
              <BarChart3 size={16} style={{ color: '#38BDF8' }} />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-data-large font-number text-[#0F2245]">245</span>
            <span className="text-sm text-[#8BA4C7]">人</span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <TrendIcon value={8} />
            <span className="text-xs text-red-500">较上月增加8人</span>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8BA4C7]">高风险</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: '#EF444415' }}>
              <span className="text-sm font-bold text-red-500">!</span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-data-large font-number text-[#0F2245]">18</span>
            <span className="text-sm text-[#8BA4C7]">人</span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <TrendIcon value={2} />
            <span className="text-xs text-red-500">较上月增加2人</span>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8BA4C7]">中风险</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: '#F59E0B15' }}>
              <span className="text-sm font-bold text-yellow-500">!</span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-data-large font-number text-[#0F2245]">52</span>
            <span className="text-sm text-[#8BA4C7]">人</span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <TrendIcon value={-3} />
            <span className="text-xs text-green-500">较上月减少3人</span>
          </div>
        </div>
      </div>

      {/* Table + Detail Panel */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Table */}
        <div className={cn('rounded-lg bg-white shadow-card', selectedPerson ? 'xl:col-span-2' : 'xl:col-span-3')}>
          <div className="flex items-center justify-between border-b border-[#EDF2F9] px-6 py-4">
            <h3 className="text-sm font-semibold text-[#0F2245]">人员评分排名</h3>
            <span className="text-xs text-[#8BA4C7]">共 {MOCK_PEOPLE.length} 人</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#EDF2F9]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#8BA4C7]">排名</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#8BA4C7]">姓名</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#8BA4C7]">部门</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#8BA4C7]">职位</th>
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
                {filteredPeople.map((p, idx) => (
                  <tr
                    key={p.name}
                    className={cn(
                      'border-b border-[#EDF2F9] text-sm transition-colors cursor-pointer',
                      idx === filteredPeople.length - 1 && 'border-b-0',
                      selectedPerson?.name === p.name ? 'bg-[#F0F7FF]' : 'hover:bg-[#F8FAFD]'
                    )}
                    onClick={() => setSelectedPerson(selectedPerson?.name === p.name ? null : p)}
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
                    <td className="px-4 py-3.5 text-[#8BA4C7]">{p.position}</td>
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

        {/* Detail Panel */}
        {selectedPerson && (
          <div className="xl:col-span-1">
            <DetailPanel person={selectedPerson} onClose={() => setSelectedPerson(null)} />
          </div>
        )}
      </div>
    </div>
  )
}
