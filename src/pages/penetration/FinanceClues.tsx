import { useState } from 'react'
import {
  Search, X, FileText, Calendar, Building2, Shield, ExternalLink, Filter, DollarSign, TrendingDown
} from 'lucide-react'
import { StatusBadge, RiskLevelTag } from '@/components/StatusBadge'

interface ClueRow {
  id: number
  companyName: string
  indicator: string
  anomalyDesc: string
  anomalyValue: string
  normalRange: string
  period: string
  riskLevel: 'high' | 'medium' | 'low'
  status: 'pending' | 'processing' | 'completed'
  detectTime: string
  dept: string
  detail: string
}

const CLUES: ClueRow[] = [
  { id: 1, companyName: '中化能源科技有限公司', indicator: '资产负债率', anomalyDesc: '资产负债率异常偏高', anomalyValue: '89.5%', normalRange: '50-70%', period: '2025年Q2', riskLevel: 'high', status: 'pending', detectTime: '2025-07-20 14:32', dept: '财务部', detail: '中化能源科技2025年Q2资产负债率达89.5%，远超行业平均水平65%，且较上季度上升12个百分点，存在过度负债风险。' },
  { id: 2, companyName: '中化国际物流有限公司', indicator: '对外担保余额', anomalyDesc: '违规对外担保', anomalyValue: '¥3.2亿', normalRange: '≤净资产50%', period: '2025年上半年', riskLevel: 'high', status: 'processing', detectTime: '2025-07-19 09:15', dept: '财务部', detail: '中化国际物流未经集团审批，为关联企业提供担保3.2亿元，超过净资产50%的限额，涉嫌违规对外担保。' },
  { id: 3, companyName: '中化化肥股份有限公司', indicator: '资金拆借', anomalyDesc: '与非金融机构异常拆借', anomalyValue: '¥1.8亿', normalRange: '无', period: '2025年6月', riskLevel: 'medium', status: 'pending', detectTime: '2025-07-18 16:48', dept: '财务部', detail: '中化化肥向非金融机构拆出资金1.8亿元，利率明显低于市场水平，且未签订正式借款合同。' },
  { id: 4, companyName: '中化蓝天集团有限公司', indicator: '应付账款周转天数', anomalyDesc: '账款拖欠严重', anomalyValue: '245天', normalRange: '60-120天', period: '2025年Q2', riskLevel: 'medium', status: 'processing', detectTime: '2025-07-17 11:20', dept: '采购部', detail: '中化蓝天应付账款周转天数达245天，远超行业平均水平，大量中小企业供应商账款被长期拖欠。' },
  { id: 5, companyName: '中化塑料有限公司', indicator: '资产权属', anomalyDesc: '部分固定资产权属不清', anomalyValue: '¥6,500万', normalRange: '无', period: '2025年上半年', riskLevel: 'low', status: 'completed', detectTime: '2025-07-16 08:05', dept: '资产管理部', detail: '中化塑料账面登记的6,500万固定资产无法提供产权证明，经核实为历史遗留问题，已启动补办程序。' },
  { id: 6, companyName: '中化环境控股有限公司', indicator: '大额资金流向', anomalyDesc: '异常大额转账至个人账户', anomalyValue: '¥2,800万', normalRange: '无', period: '2025年6月', riskLevel: 'medium', status: 'pending', detectTime: '2025-07-15 15:40', dept: '财务部', detail: '中化环境向多个个人账户转账共计2,800万元，备注为"技术服务费"，缺乏合同支撑，涉嫌资金异常流出。' },
  { id: 7, companyName: '中化商务有限公司', indicator: '营业收入', anomalyDesc: '营收大幅下滑无合理解释', anomalyValue: '同比-38%', normalRange: '±15%', period: '2025年上半年', riskLevel: 'high', status: 'pending', detectTime: '2025-07-14 10:22', dept: '经营管理部门', detail: '中化商务上半年营业收入同比下滑38%，但同期市场整体增长5%，且公司无法提供合理解释，存在业绩造假嫌疑。' },
  { id: 8, companyName: '中化信息技术有限公司', indicator: '研发费用加计扣除', anomalyDesc: '研发费用异常归集', anomalyValue: '¥1,200万', normalRange: '无', period: '2024年度', riskLevel: 'low', status: 'completed', detectTime: '2025-07-13 17:55', dept: '财务部', detail: '中化信息研发费用归集不准确，将部分非研发支出计入研发费用，经税务核查已调整并进行整改。' },
]

const STATS = [
  { label: '线索总数', value: 132, color: '#38BDF8' },
  { label: '高风险', value: 18, color: '#EF4444' },
  { label: '中风险', value: 41, color: '#F59E0B' },
  { label: '低风险', value: 73, color: '#2DD4BF' },
]

const RISK_DIST = [
  { label: '过度负债', high: 4, medium: 8, low: 12, total: 24 },
  { label: '违规担保', high: 3, medium: 7, low: 10, total: 20 },
  { label: '资金拆借异常', high: 3, medium: 9, low: 15, total: 27 },
  { label: '账款拖欠', high: 2, medium: 6, low: 14, total: 22 },
  { label: '资产权属不清', high: 2, medium: 5, low: 11, total: 18 },
  { label: '资金异常流向', high: 4, medium: 6, low: 11, total: 21 },
]

const DEPTS = ['全部部门', '财务部', '采购部', '资产管理部', '经营管理部门']

export function FinanceClues() {
  const [levelFilter, setLevelFilter] = useState('全部')
  const [statusFilter, setStatusFilter] = useState('全部')
  const [deptFilter, setDeptFilter] = useState('全部部门')
  const [search, setSearch] = useState('')
  const [selectedClue, setSelectedClue] = useState<ClueRow | null>(null)

  const filtered = CLUES.filter((c) => {
    const matchLevel = levelFilter === '全部' || c.riskLevel === levelFilter
    const matchStatus = statusFilter === '全部' || c.status === statusFilter
    const matchDept = deptFilter === '全部部门' || c.dept === deptFilter
    const matchSearch = !search || c.companyName.includes(search) || c.indicator.includes(search) || c.anomalyDesc.includes(search)
    return matchLevel && matchStatus && matchDept && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-page-title text-[#0B1D4A]">财务领域风险线索</h1>
        <p className="mt-1 text-sm text-[#8BA4C7]">
          监控企业财务健康状态，识别过度负债、违规担保、资金异常等风险
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-lg bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8BA4C7]">{s.label}</span>
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            </div>
            <div className="mt-2">
              <span className="text-data-large text-[#0F2245]">{s.value.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Distribution */}
      <div className="rounded-lg bg-white p-5 shadow-card">
        <h3 className="mb-4 text-sm font-semibold text-[#0F2245]">风险分布</h3>
        <div className="space-y-3">
          {RISK_DIST.map((item) => {
            const maxTotal = Math.max(...RISK_DIST.map((r) => r.total))
            const totalWidth = (item.total / maxTotal) * 100
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#0F2245] font-medium">{item.label}</span>
                  <span className="text-xs text-[#8BA4C7]">{item.total}条</span>
                </div>
                <div className="flex h-5 rounded-full overflow-hidden bg-[#EDF2F9]">
                  <div className="h-full bg-[#EF4444] transition-all" style={{ width: (item.high / item.total) * totalWidth + '%' }} title={`高风险 ${item.high}条`} />
                  <div className="h-full bg-[#F59E0B] transition-all" style={{ width: (item.medium / item.total) * totalWidth + '%' }} title={`中风险 ${item.medium}条`} />
                  <div className="h-full bg-[#2DD4BF] transition-all" style={{ width: (item.low / item.total) * totalWidth + '%' }} title={`低风险 ${item.low}条`} />
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-[#8BA4C7]">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#EF4444]" />高风险</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#F59E0B]" />中风险</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#2DD4BF]" />低风险</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-lg bg-white p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#8BA4C7]" />
            <span className="text-xs text-[#8BA4C7]">筛选:</span>
          </div>
          <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="rounded-md border border-[#D8E2F0] bg-white px-3 py-1.5 text-xs text-[#0F2245] focus:border-[#38BDF8] focus:outline-none">
            <option>全部</option>
            <option value="high">高风险</option>
            <option value="medium">中风险</option>
            <option value="low">低风险</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-md border border-[#D8E2F0] bg-white px-3 py-1.5 text-xs text-[#0F2245] focus:border-[#38BDF8] focus:outline-none">
            <option>全部</option>
            <option value="pending">待处理</option>
            <option value="processing">处理中</option>
            <option value="completed">已完成</option>
          </select>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="rounded-md border border-[#D8E2F0] bg-white px-3 py-1.5 text-xs text-[#0F2245] focus:border-[#38BDF8] focus:outline-none">
            {DEPTS.map((d) => (<option key={d}>{d}</option>))}
          </select>
          <div className="relative ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8BA4C7]" />
            <input type="text" placeholder="搜索企业名称或指标..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-52 rounded-md border border-[#D8E2F0] bg-white py-1.5 pl-9 pr-3 text-xs text-[#0F2245] placeholder:text-[#8BA4C7] focus:border-[#38BDF8] focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-lg bg-white shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D8E2F0] bg-[#F8FAFD]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8BA4C7]">企业名称</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8BA4C7]">财务指标</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8BA4C7]">异常描述</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[#8BA4C7]">异常值</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8BA4C7]">正常范围</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8BA4C7]">所属期间</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8BA4C7]">风险等级</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8BA4C7]">状态</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8BA4C7]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2F5]">
              {filtered.map((clue) => (
                <tr key={clue.id} className="group hover:bg-[#EDF2F9] transition-colors cursor-pointer" onClick={() => setSelectedClue(clue)}>
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{clue.companyName}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245] font-medium">{clue.indicator}</td>
                  <td className="px-4 py-3 text-sm text-[#8BA4C7] max-w-[160px] truncate">{clue.anomalyDesc}</td>
                  <td className="px-4 py-3 text-sm text-[#EF4444] text-right font-number font-medium">{clue.anomalyValue}</td>
                  <td className="px-4 py-3 text-sm text-[#8BA4C7] text-center">{clue.normalRange}</td>
                  <td className="px-4 py-3 text-sm text-[#8BA4C7] text-center">{clue.period}</td>
                  <td className="px-4 py-3 text-center"><RiskLevelTag level={clue.riskLevel} /></td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge level={clue.status === 'pending' ? 'yellow' : clue.status === 'processing' ? 'blue' : 'green'} label={clue.status === 'pending' ? '待处理' : clue.status === 'processing' ? '处理中' : '已完成'} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedClue(clue) }} className="text-[#38BDF8] hover:text-[#0EA5E9] transition-colors"><ExternalLink size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-[#8BA4C7]">
            <Search size={40} className="text-[#D8E2F0]" />
            <p className="mt-3 text-sm">未找到匹配的线索</p>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {selectedClue && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20" onClick={() => setSelectedClue(null)} />
          <div className="relative w-[480px] bg-white shadow-xl overflow-y-auto animate-in slide-in-from-right">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#D8E2F0] bg-white px-6 py-4">
              <h2 className="text-base font-semibold text-[#0F2245]">线索详情</h2>
              <button onClick={() => setSelectedClue(null)} className="text-[#8BA4C7] hover:text-[#0F2245] transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[#0F2245] mb-3">{selectedClue.companyName} - {selectedClue.indicator}</h3>
                <div className="flex items-center gap-2">
                  <RiskLevelTag level={selectedClue.riskLevel} size="md" />
                  <StatusBadge level={selectedClue.status === 'pending' ? 'yellow' : selectedClue.status === 'processing' ? 'blue' : 'green'} label={selectedClue.status === 'pending' ? '待处理' : selectedClue.status === 'processing' ? '处理中' : '已完成'} size="md" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><Building2 size={13} />企业名称</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.companyName}</div>
                </div>
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><TrendingDown size={13} />财务指标</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.indicator}</div>
                </div>
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><FileText size={13} />异常值</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.anomalyValue}</div>
                </div>
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><Calendar size={13} />发现时间</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.detectTime}</div>
                </div>
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><Shield size={13} />责任部门</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.dept}</div>
                </div>
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><DollarSign size={13} />所属期间</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.period}</div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#0F2245] mb-2">线索说明</h4>
                <p className="text-sm text-[#8BA4C7] leading-relaxed">{selectedClue.detail}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 rounded-lg bg-[#38BDF8] py-2 text-sm font-medium text-white hover:bg-[#0EA5E9] transition-colors">开始处理</button>
                <button className="flex-1 rounded-lg border border-[#D8E2F0] py-2 text-sm font-medium text-[#0F2245] hover:bg-[#EDF2F9] transition-colors">标记已读</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
