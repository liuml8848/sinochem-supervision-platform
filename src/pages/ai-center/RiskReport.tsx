import { useState } from 'react'
import { FileText, Download, Eye, ChevronDown, Calendar, Building2, Layers, Loader2, CheckCircle, AlertCircle, Clock, RefreshCw, Plus, FileBarChart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/StatusBadge'

interface ReportHistoryItem {
  id: string
  name: string
  type: 'comprehensive' | 'special'
  generatedAt: Date
  status: 'completed' | 'generating' | 'failed'
  scope: string
}

const DEPARTMENTS = [
  '化工事业部', '能源事业部', '农业事业部', '物流事业部',
  '数字科技部', '健康事业部', '财务部', '人力资源部',
]

const REPORT_TEMPLATES = [
  { id: 't1', name: '综合风险报告模板（标准版）' },
  { id: 't2', name: '月度风险简报模板' },
  { id: 't3', name: '专项风险分析报告模板' },
  { id: 't4', name: '年度风险综述模板' },
]

const MOCK_HISTORY: ReportHistoryItem[] = [
  { id: 'r1', name: '2026年第二季度综合风险报告', type: 'comprehensive', generatedAt: new Date('2026-07-01 09:30'), status: 'completed', scope: '全集团' },
  { id: 'r2', name: '化工事业部招标采购专项报告', type: 'special', generatedAt: new Date('2026-06-25 14:20'), status: 'completed', scope: '化工事业部' },
  { id: 'r3', name: '2026年6月月度风险简报', type: 'comprehensive', generatedAt: new Date('2026-06-30 11:00'), status: 'completed', scope: '全集团' },
  { id: 'r4', name: '供应商廉洁风险评估专项报告', type: 'special', generatedAt: new Date('2026-06-20 16:45'), status: 'completed', scope: '全集团' },
  { id: 'r5', name: '能源事业部项目异常预警专项报告', type: 'special', generatedAt: new Date('2026-06-15 10:10'), status: 'failed', scope: '能源事业部' },
]

const REPORT_STRUCTURE = [
  { section: '一、报告概述', subs: ['报告目的与范围', '数据来源说明', '报告周期'] },
  { section: '二、总体风险概况', subs: ['综合风险评分', '风险等级分布', '同比/环比变化趋势'] },
  { section: '三、分部门风险分析', subs: ['各部门风险评分排名', '重点风险领域识别', '风险变化趋势对比'] },
  { section: '四、重点项目/人员风险', subs: ['高风险项目清单', '高风险人员清单', '预警事项明细'] },
  { section: '五、风险趋势预测', subs: ['基于历史数据的趋势分析', '高风险领域预警', '建议管控措施'] },
  { section: '六、总结与建议', subs: ['主要发现', '整改建议', '后续跟踪计划'] },
]

export function RiskReport() {
  const [reportTitle, setReportTitle] = useState('')
  const [selectedDepts, setSelectedDepts] = useState<string[]>([])
  const [dateRange, setDateRange] = useState({ start: '2026-01-01', end: '2026-06-30' })
  const [reportType, setReportType] = useState<'comprehensive' | 'special'>('comprehensive')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showDeptDropdown, setShowDeptDropdown] = useState(false)
  const [generateProgress, setGenerateProgress] = useState(0)
  const [reportHistory, setReportHistory] = useState<ReportHistoryItem[]>(MOCK_HISTORY)

  const toggleDepartment = (dept: string) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    )
  }

  const selectAllDepts = () => {
    setSelectedDepts(DEPARTMENTS.length === selectedDepts.length ? [] : [...DEPARTMENTS])
  }

  const canGenerate = reportTitle.trim() && selectedDepts.length > 0

  const handleGenerate = () => {
    if (!canGenerate || isGenerating) return
    setIsGenerating(true)
    setGenerateProgress(0)

    const interval = setInterval(() => {
      setGenerateProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 400)

    setTimeout(() => {
      clearInterval(interval)
      setGenerateProgress(100)
      setIsGenerating(false)

      const newReport: ReportHistoryItem = {
        id: `r-${Date.now()}`,
        name: reportTitle.trim(),
        type: reportType,
        generatedAt: new Date(),
        status: 'completed',
        scope: selectedDepts.length === DEPARTMENTS.length ? '全集团' : selectedDepts.join('、'),
      }
      setReportHistory((prev) => [newReport, ...prev])
      setReportTitle('')
      setSelectedDepts([])
      setShowPreview(false)
    }, 4000)
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-page-title text-[#0B1D4A]">智能风险报告</h1>
          <p className="mt-1 text-sm text-[#8BA4C7]">基于多维度数据自动生成风险分析报告</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left: Report Generation Form */}
        <div className="space-y-6 xl:col-span-2">
          {/* Form Card */}
          <div className="rounded-lg bg-white shadow-card">
            <div className="border-b border-[#EDF2F9] px-6 py-4">
              <div className="flex items-center gap-2">
                <FileBarChart size={16} className="text-[#8BA4C7]" />
                <h3 className="text-sm font-semibold text-[#0F2245]">生成新报告</h3>
              </div>
            </div>
            <div className="space-y-5 p-6">
              {/* Report Title */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#0F2245]">报告名称</label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="请输入报告名称，例如：2026年第三季度综合风险报告"
                  className="h-10 w-full rounded-lg border border-[#D8E2F0] bg-white px-3 text-sm text-[#0F2245] placeholder:text-[#8BA4C7] outline-none focus:border-[#38BDF8]"
                />
              </div>

              {/* Scope - Department MultiSelect */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#0F2245]">报告范围（部门）</label>
                <div className="relative">
                  <button
                    onClick={() => setShowDeptDropdown(!showDeptDropdown)}
                    className="flex h-10 w-full items-center justify-between rounded-lg border border-[#D8E2F0] bg-white px-3 text-sm text-[#0F2245] outline-none focus:border-[#38BDF8]"
                  >
                    <span className={selectedDepts.length === 0 ? 'text-[#8BA4C7]' : ''}>
                      {selectedDepts.length === 0
                        ? '请选择部门（可多选）'
                        : selectedDepts.length === DEPARTMENTS.length
                          ? '全集团'
                          : `已选择 ${selectedDepts.length} 个部门`}
                    </span>
                    <ChevronDown size={14} className="text-[#8BA4C7]" />
                  </button>
                  {showDeptDropdown && (
                    <div className="absolute top-full left-0 z-10 mt-1 w-full rounded-lg border border-[#D8E2F0] bg-white shadow-lg">
                      <div className="border-b border-[#EDF2F9] px-3 py-2">
                        <button
                          onClick={selectAllDepts}
                          className="text-xs font-medium text-[#38BDF8] hover:text-[#0B1D4A] transition-colors"
                        >
                          {DEPARTMENTS.length === selectedDepts.length ? '取消全选' : '全选'}
                        </button>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {DEPARTMENTS.map((dept) => (
                          <label
                            key={dept}
                            className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-[#F8FAFD] transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedDepts.includes(dept)}
                              onChange={() => toggleDepartment(dept)}
                              className="h-3.5 w-3.5 rounded border-[#D8E2F0] text-[#0B1D4A] focus:ring-[#38BDF8]"
                            />
                            <span className="text-xs text-[#0F2245]">{dept}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {selectedDepts.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedDepts.map((dept) => (
                      <span
                        key={dept}
                        className="inline-flex items-center gap-1 rounded-full bg-[#EDF2F9] px-2 py-0.5 text-[10px] text-[#0F2245]"
                      >
                        {dept}
                        <button onClick={() => toggleDepartment(dept)} className="text-[#8BA4C7] hover:text-red-500">
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#0F2245]">起始日期</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8BA4C7]" />
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                      className="h-10 w-full rounded-lg border border-[#D8E2F0] bg-white pl-9 pr-3 text-sm text-[#0F2245] outline-none focus:border-[#38BDF8]"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[#0F2245]">截止日期</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8BA4C7]" />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                      className="h-10 w-full rounded-lg border border-[#D8E2F0] bg-white pl-9 pr-3 text-sm text-[#0F2245] outline-none focus:border-[#38BDF8]"
                    />
                  </div>
                </div>
              </div>

              {/* Report Type */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#0F2245]">报告类型</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setReportType('comprehensive')}
                    className={cn(
                      'flex-1 rounded-lg border px-4 py-2.5 text-sm transition-colors',
                      reportType === 'comprehensive'
                        ? 'border-[#0B1D4A] bg-[#0B1D4A] text-white'
                        : 'border-[#D8E2F0] bg-white text-[#0F2245] hover:bg-[#EDF2F9]'
                    )}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Layers size={16} />
                      <span>综合报告</span>
                    </div>
                    <p className="mt-0.5 text-[10px] opacity-70">覆盖所有风险维度的全面分析</p>
                  </button>
                  <button
                    onClick={() => setReportType('special')}
                    className={cn(
                      'flex-1 rounded-lg border px-4 py-2.5 text-sm transition-colors',
                      reportType === 'special'
                        ? 'border-[#0B1D4A] bg-[#0B1D4A] text-white'
                        : 'border-[#D8E2F0] bg-white text-[#0F2245] hover:bg-[#EDF2F9]'
                    )}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FileText size={16} />
                      <span>专项报告</span>
                    </div>
                    <p className="mt-0.5 text-[10px] opacity-70">聚焦特定领域或问题的深度分析</p>
                  </button>
                </div>
              </div>

              {/* Template Selection */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#0F2245]">模板选择</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[#D8E2F0] bg-white px-3 text-sm text-[#0F2245] outline-none focus:border-[#38BDF8]"
                >
                  <option value="">请选择报告模板（可选）</option>
                  {REPORT_TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate || isGenerating}
                  className={cn(
                    'flex h-10 items-center gap-2 rounded-lg px-6 text-sm font-medium text-white transition-colors',
                    canGenerate && !isGenerating
                      ? 'bg-[#0B1D4A] hover:bg-[#0B1D4A]/90'
                      : 'bg-[#8BA4C7] cursor-not-allowed'
                  )}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      生成中... {Math.round(generateProgress)}%
                    </>
                  ) : (
                    <>
                      <RefreshCw size={16} />
                      生成报告
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex h-10 items-center gap-2 rounded-lg border border-[#D8E2F0] bg-white px-4 text-sm text-[#0F2245] hover:bg-[#EDF2F9] transition-colors"
                >
                  <Eye size={16} />
                  {showPreview ? '隐藏预览' : '预览结构'}
                </button>
              </div>

              {/* Generating Progress Bar */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-[#EDF2F9] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#38BDF8] transition-all duration-300"
                      style={{ width: `${Math.min(generateProgress, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#8BA4C7]">
                    <span>正在分析多维度数据并生成报告内容...</span>
                    <span className="font-number">{Math.round(generateProgress)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Area */}
          {showPreview && !isGenerating && (
            <div className="rounded-lg bg-white shadow-card">
              <div className="border-b border-[#EDF2F9] px-6 py-4">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-[#8BA4C7]" />
                  <h3 className="text-sm font-semibold text-[#0F2245]">报告结构预览</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4 rounded-lg border border-[#EDF2F9] bg-[#F8FAFD] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={14} className="text-[#0B1D4A]" />
                    <span className="text-sm font-medium text-[#0F2245]">
                      {reportTitle || '新报告标题'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-[#8BA4C7]">
                    <span>类型：{reportType === 'comprehensive' ? '综合报告' : '专项报告'}</span>
                    <span>范围：{selectedDepts.length === DEPARTMENTS.length ? '全集团' : selectedDepts.length > 0 ? `${selectedDepts.length}个部门` : '未指定'}</span>
                    <span>周期：{dateRange.start} ~ {dateRange.end}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {REPORT_STRUCTURE.map((section) => (
                    <div key={section.section} className="rounded-lg border border-[#EDF2F9] p-3">
                      <p className="text-xs font-medium text-[#0F2245]">{section.section}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {section.subs.map((sub) => (
                          <span
                            key={sub}
                            className="rounded-md bg-[#EDF2F9] px-2 py-0.5 text-[10px] text-[#8BA4C7]"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Report History */}
        <div className="space-y-4 xl:col-span-1">
          <div className="rounded-lg bg-white shadow-card">
            <div className="border-b border-[#EDF2F9] px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#8BA4C7]" />
                  <h3 className="text-xs font-semibold text-[#0F2245]">报告历史</h3>
                </div>
                <span className="text-[10px] text-[#8BA4C7]">{reportHistory.length} 份</span>
              </div>
            </div>
            <div className="divide-y divide-[#EDF2F9]">
              {reportHistory.map((report) => (
                <div key={report.id} className="px-5 py-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[#0F2245] truncate">{report.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <StatusBadge
                          level={report.type === 'comprehensive' ? 'blue' : 'orange'}
                          label={report.type === 'comprehensive' ? '综合' : '专项'}
                          size="sm"
                        />
                        <span className="text-[10px] text-[#8BA4C7]">{report.scope}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        <Calendar size={10} className="text-[#8BA4C7]" />
                        <span className="text-[10px] text-[#8BA4C7]">
                          {report.generatedAt.toLocaleDateString('zh-CN')} {report.generatedAt.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {report.status === 'completed' && (
                        <div className="flex items-center gap-1">
                          <CheckCircle size={12} className="text-green-500" />
                        </div>
                      )}
                      {report.status === 'generating' && (
                        <Loader2 size={12} className="animate-spin text-yellow-500" />
                      )}
                      {report.status === 'failed' && (
                        <AlertCircle size={12} className="text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {report.status === 'completed' && (
                      <>
                        <button className="flex items-center gap-1 rounded-md border border-[#D8E2F0] px-2 py-1 text-[10px] text-[#0F2245] hover:bg-[#EDF2F9] transition-colors">
                          <Eye size={10} />
                          查看
                        </button>
                        <button className="flex items-center gap-1 rounded-md border border-[#D8E2F0] px-2 py-1 text-[10px] text-[#0F2245] hover:bg-[#EDF2F9] transition-colors">
                          <Download size={10} />
                          下载
                        </button>
                      </>
                    )}
                    {report.status === 'failed' && (
                      <button className="flex items-center gap-1 rounded-md border border-[#D8E2F0] px-2 py-1 text-[10px] text-red-500 hover:bg-red-50 transition-colors">
                        <RefreshCw size={10} />
                        重新生成
                      </button>
                    )}
                    {report.status === 'generating' && (
                      <span className="text-[10px] text-yellow-500">生成中...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {reportHistory.length > 5 && (
              <div className="border-t border-[#EDF2F9] px-5 py-2.5">
                <button className="text-[10px] text-[#8BA4C7] hover:text-[#0F2245] transition-colors">
                  查看全部报告
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="rounded-lg bg-white p-4 shadow-card">
            <h3 className="mb-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">报告统计</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8BA4C7]">本月生成</span>
                <span className="text-xs font-medium text-[#0F2245]">3 份</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8BA4C7]">综合报告</span>
                <span className="text-xs font-medium text-[#0F2245]">{reportHistory.filter((r) => r.type === 'comprehensive' && r.status === 'completed').length} 份</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8BA4C7]">专项报告</span>
                <span className="text-xs font-medium text-[#0F2245]">{reportHistory.filter((r) => r.type === 'special' && r.status === 'completed').length} 份</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8BA4C7]">生成成功率</span>
                <span className="text-xs font-medium text-green-500">96.7%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
