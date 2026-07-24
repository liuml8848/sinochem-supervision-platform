import { useState } from 'react'
import { Search, TrendingUp, BarChart3, PieChart, Clock, ChevronRight, Sparkles, AlertTriangle, Building2, FileText, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatCard } from '@/components/StatCard'
import { ChartCard } from '@/components/ChartCard'
import { StatusBadge } from '@/components/StatusBadge'

interface AnalysisResult {
  type: 'chart' | 'table'
  title: string
  data: Record<string, string | number>[]
  labels?: string[]
  values?: number[]
}

interface QueryHistoryItem {
  id: string
  query: string
  timestamp: Date
  type: 'natural' | 'prebuilt'
}

const ANALYSIS_CARDS = [
  {
    id: 'a1',
    title: '本月招标采购风险趋势',
    description: '分析本月各风险等级项目数量变化趋势',
    icon: TrendingUp,
    color: '#38BDF8',
  },
  {
    id: 'a2',
    title: '各部门问题分布',
    description: '按部门维度统计各类问题数量及占比',
    icon: PieChart,
    color: '#2DD4BF',
  },
  {
    id: 'a3',
    title: '高风险供应商排名',
    description: '按风险指数对供应商进行排序分析',
    icon: AlertTriangle,
    color: '#EF4444',
  },
  {
    id: 'a4',
    title: '违规类型统计',
    description: '按违规类型分类统计案件数量',
    icon: BarChart3,
    color: '#F59E0B',
  },
  {
    id: 'a5',
    title: '项目异常预警分布',
    description: '各事业部项目异常预警数量分布',
    icon: Building2,
    color: '#8BA4C7',
  },
  {
    id: 'a6',
    title: '关键岗位风险排名',
    description: '高风险岗位人员综合评分排名',
    icon: FileText,
    color: '#F97316',
  },
]

const MOCK_QUERY_HISTORY: QueryHistoryItem[] = [
  { id: 'h1', query: '本月招标采购风险趋势', timestamp: new Date('2026-07-23 14:32'), type: 'prebuilt' },
  { id: 'h2', query: '化工事业部本月风险项目数量', timestamp: new Date('2026-07-23 11:15'), type: 'natural' },
  { id: 'h3', query: '各部门问题分布', timestamp: new Date('2026-07-22 16:48'), type: 'prebuilt' },
  { id: 'h4', query: '最近30天违规类型统计', timestamp: new Date('2026-07-22 09:05'), type: 'natural' },
  { id: 'h5', query: '高风险供应商排名', timestamp: new Date('2026-07-21 15:30'), type: 'prebuilt' },
]

const MOCK_BAR_DATA = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
  datasets: [
    { label: '高风险', values: [5, 7, 4, 8, 6, 9, 7], color: '#EF4444' },
    { label: '中风险', values: [12, 15, 10, 18, 14, 20, 16], color: '#F59E0B' },
    { label: '低风险', values: [25, 22, 28, 20, 24, 18, 22], color: '#2DD4BF' },
  ],
}

const MOCK_DEPT_DATA = [
  { department: '化工事业部', 高风险: 8, 中风险: 15, 低风险: 28 },
  { department: '能源事业部', 高风险: 5, 中风险: 12, 低风险: 20 },
  { department: '农业事业部', 高风险: 3, 中风险: 10, 低风险: 18 },
  { department: '物流事业部', 高风险: 2, 中风险: 8, 低风险: 15 },
  { department: '数字科技部', 高风险: 1, 中风险: 4, 低风险: 10 },
  { department: '健康事业部', 高风险: 1, 中风险: 3, 低风险: 8 },
]

export function SmartAnalysis() {
  const [query, setQuery] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeResult, setActiveResult] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>(MOCK_QUERY_HISTORY)

  const handleAnalyze = (input?: string) => {
    const searchText = (input || query).trim()
    if (!searchText || isAnalyzing) return

    setIsAnalyzing(true)
    setShowResult(true)

    // Add to history
    const newItem: QueryHistoryItem = {
      id: `h-${Date.now()}`,
      query: searchText,
      timestamp: new Date(),
      type: 'natural',
    }
    setQueryHistory((prev) => [newItem, ...prev])

    setTimeout(() => {
      setIsAnalyzing(false)
      setActiveResult('a1')
    }, 2000)
  }

  const handlePrebuiltClick = (id: string, title: string) => {
    setIsAnalyzing(true)
    setShowResult(true)
    setActiveResult(id)

    const newItem: QueryHistoryItem = {
      id: `h-${Date.now()}`,
      query: title,
      timestamp: new Date(),
      type: 'prebuilt',
    }
    setQueryHistory((prev) => [newItem, ...prev])

    setTimeout(() => {
      setIsAnalyzing(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-page-title text-[#0B1D4A]">智能分析问数</h1>
          <p className="mt-1 text-sm text-[#8BA4C7]">通过自然语言或预置模板进行数据分析与查询</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Query Input */}
          <div className="rounded-lg bg-white p-5 shadow-card">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8BA4C7]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAnalyze()
                }}
                placeholder="输入您想查询的问题，例如：化工事业部本月风险项目数量"
                className="h-12 w-full rounded-lg border border-[#D8E2F0] bg-[#F8FAFD] pl-11 pr-28 text-sm text-[#0F2245] placeholder:text-[#8BA4C7] outline-none focus:border-[#38BDF8] focus:bg-white"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={() => handleAnalyze()}
                  disabled={!query.trim() || isAnalyzing}
                  className={cn(
                    'flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium text-white transition-colors',
                    query.trim() && !isAnalyzing ? 'bg-[#0B1D4A] hover:bg-[#0B1D4A]/90' : 'bg-[#8BA4C7] cursor-not-allowed'
                  )}
                >
                  <Sparkles size={14} />
                  问数
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] text-[#8BA4C7]">示例：</span>
              <button
                onClick={() => setQuery('化工事业部本月风险项目数量')}
                className="rounded-full bg-[#EDF2F9] px-2 py-0.5 text-[10px] text-[#8BA4C7] hover:text-[#0F2245] transition-colors"
              >
                化工事业部本月风险项目数量
              </button>
              <button
                onClick={() => setQuery('最近30天违规类型统计')}
                className="rounded-full bg-[#EDF2F9] px-2 py-0.5 text-[10px] text-[#8BA4C7] hover:text-[#0F2245] transition-colors"
              >
                最近30天违规类型统计
              </button>
            </div>
          </div>

          {/* Pre-built Analysis Cards */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#0F2245]">快速分析</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {ANALYSIS_CARDS.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handlePrebuiltClick(card.id, card.title)}
                  disabled={isAnalyzing}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border border-[#EDF2F9] bg-white p-4 text-left shadow-card transition-all hover:shadow-card-hover',
                    activeResult === card.id && showResult && 'border-[#38BDF8]'
                  )}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: card.color + '15' }}
                  >
                    <card.icon size={16} style={{ color: card.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0F2245]">{card.title}</p>
                    <p className="mt-0.5 text-xs text-[#8BA4C7]">{card.description}</p>
                  </div>
                  <ChevronRight size={14} className="mt-2 shrink-0 text-[#D8E2F0]" />
                </button>
              ))}
            </div>
          </div>

          {/* Results Area */}
          {showResult && (
            <div className="space-y-6">
              {/* Loading State */}
              {isAnalyzing && (
                <div className="flex items-center justify-center rounded-lg bg-white p-10 shadow-card">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Bot size={24} className="text-[#38BDF8]" />
                      <Sparkles size={18} className="text-[#F59E0B]" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#38BDF8]" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#38BDF8]" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#38BDF8]" style={{ animationDelay: '300ms' }} />
                    </div>
                    <p className="text-sm text-[#8BA4C7]">正在分析数据...</p>
                  </div>
                </div>
              )}

              {/* Analysis Result - Chart + Table */}
              {!isAnalyzing && (
                <>
                  <ChartCard
                    title="本月招标采购风险趋势"
                    subtitle="2026年1月 - 7月各风险等级项目数量变化"
                    height={280}
                  >
                    <div className="flex h-full flex-col">
                      {/* Legend */}
                      <div className="flex items-center gap-4 mb-3">
                        {MOCK_BAR_DATA.datasets.map((d) => (
                          <div key={d.label} className="flex items-center gap-1.5">
                            <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                            <span className="text-[10px] text-[#8BA4C7]">{d.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Bar Chart */}
                      <div className="flex-1 flex items-end gap-2 relative">
                        {/* Y-axis labels */}
                        <div className="flex flex-col justify-between h-full pr-2 text-[10px] text-[#8BA4C7]">
                          <span>30</span>
                          <span>20</span>
                          <span>10</span>
                          <span>0</span>
                        </div>

                        <div className="flex-1 flex items-end gap-2 h-full">
                          {MOCK_BAR_DATA.labels.map((label, idx) => {
                            const maxVal = 30
                            return (
                              <div key={label} className="flex-1 flex flex-col items-center justify-end h-full gap-0.5">
                                <div className="w-full flex items-end gap-0.5 justify-center">
                                  {MOCK_BAR_DATA.datasets.map((ds) => {
                                    const h = (ds.values[idx] / maxVal) * 100
                                    return (
                                      <div
                                        key={ds.label}
                                        className="w-2.5 rounded-t-sm transition-all"
                                        style={{
                                          height: `${Math.max(h, 2)}%`,
                                          backgroundColor: ds.color,
                                          opacity: 0.85,
                                        }}
                                      />
                                    )
                                  })}
                                </div>
                                <span className="text-[9px] text-[#8BA4C7] mt-1">{label}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </ChartCard>

                  {/* Data Table */}
                  <div className="rounded-lg bg-white shadow-card">
                    <div className="flex items-center justify-between border-b border-[#EDF2F9] px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-[#8BA4C7]" />
                        <h3 className="text-sm font-semibold text-[#0F2245]">各部门风险分布数据</h3>
                      </div>
                      <button className="rounded-md border border-[#D8E2F0] bg-white px-3 py-1.5 text-xs text-[#0F2245] hover:bg-[#EDF2F9] transition-colors">
                        导出数据
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#EDF2F9]">
                            <th className="px-4 py-3 text-left text-xs font-medium text-[#8BA4C7]">部门</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[#8BA4C7]">
                              <span className="text-red-500">高风险</span>
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[#8BA4C7]">
                              <span className="text-yellow-500">中风险</span>
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[#8BA4C7]">
                              <span className="text-green-500">低风险</span>
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[#8BA4C7]">合计</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[#8BA4C7]">风险率</th>
                          </tr>
                        </thead>
                        <tbody>
                          {MOCK_DEPT_DATA.map((d, idx) => {
                            const total = d.高风险 + d.中风险 + d.低风险
                            const riskRate = ((d.高风险 + d.中风险) / total * 100).toFixed(1)
                            return (
                              <tr
                                key={d.department}
                                className={cn(
                                  'border-b border-[#EDF2F9] text-sm transition-colors hover:bg-[#F8FAFD]',
                                  idx === MOCK_DEPT_DATA.length - 1 && 'border-b-0'
                                )}
                              >
                                <td className="px-4 py-3.5 font-medium text-[#0F2245]">{d.department}</td>
                                <td className="px-4 py-3.5 text-center font-number text-red-500">{d.高风险}</td>
                                <td className="px-4 py-3.5 text-center font-number text-yellow-500">{d.中风险}</td>
                                <td className="px-4 py-3.5 text-center font-number text-green-500">{d.低风险}</td>
                                <td className="px-4 py-3.5 text-center font-number text-[#0F2245]">{total}</td>
                                <td className="px-4 py-3.5 text-center">
                                  <span className={cn(
                                    'inline-block rounded-md px-2 py-0.5 text-xs font-medium',
                                    parseFloat(riskRate) > 40 ? 'bg-red-50 text-red-500' :
                                    parseFloat(riskRate) > 25 ? 'bg-yellow-50 text-yellow-500' :
                                    'bg-green-50 text-green-500'
                                  )}>
                                    {riskRate}%
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Query History */}
        <div className="hidden w-64 shrink-0 lg:block">
          <div className="rounded-lg bg-white shadow-card">
            <div className="border-b border-[#EDF2F9] px-4 py-3.5">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[#8BA4C7]" />
                <h3 className="text-xs font-semibold text-[#0F2245]">查询历史</h3>
              </div>
            </div>
            <div className="divide-y divide-[#EDF2F9]">
              {queryHistory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePrebuiltClick(item.id, item.query)}
                  className="w-full px-4 py-2.5 text-left hover:bg-[#F8FAFD] transition-colors"
                >
                  <div className="flex items-start gap-2">
                    {item.type === 'prebuilt' ? (
                      <BarChart3 size={12} className="mt-0.5 shrink-0 text-[#38BDF8]" />
                    ) : (
                      <Bot size={12} className="mt-0.5 shrink-0 text-[#2DD4BF]" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-[#0F2245]">{item.query}</p>
                      <p className="mt-0.5 text-[10px] text-[#8BA4C7]">
                        {item.timestamp.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}{' '}
                        {item.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {queryHistory.length > 0 && (
              <div className="border-t border-[#EDF2F9] px-4 py-2.5">
                <button className="text-[10px] text-[#8BA4C7] hover:text-[#0F2245] transition-colors">
                  查看全部历史
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
