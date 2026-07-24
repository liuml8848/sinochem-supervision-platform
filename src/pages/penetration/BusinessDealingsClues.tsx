import { useState } from 'react'
import {
  Search, X, FileText, Calendar, Building2, Shield, ExternalLink, Filter, Users, DollarSign
} from 'lucide-react'
import { StatusBadge, RiskLevelTag } from '@/components/StatusBadge'

interface ClueRow {
  id: number
  companyA: string
  companyB: string
  relationType: string
  transactionAmount: string
  transactionCount: number
  period: string
  riskLevel: 'high' | 'medium' | 'low'
  status: 'pending' | 'processing' | 'completed'
  detectTime: string
  dept: string
  detail: string
}

const CLUES: ClueRow[] = [
  { id: 1, companyA: '中化能源科技有限公司', companyB: '上海瑞鑫商贸有限公司', relationType: '关联交易未披露', transactionAmount: '¥3,560.00万', transactionCount: 47, period: '2025年上半年', riskLevel: 'high', status: 'pending', detectTime: '2025-07-20 14:32', dept: '审计部', detail: '中化能源科技与上海瑞鑫商贸存在大量关联交易，累计金额3,560万元，未在财务报告中披露关联关系。经查，上海瑞鑫商贸实际控制人为中化能源科技某高管亲属。' },
  { id: 2, companyA: '中化国际物流有限公司', companyB: '天津海润物流有限公司', relationType: '利益输送嫌疑', transactionAmount: '¥2,180.00万', transactionCount: 23, period: '2025年Q2', riskLevel: 'high', status: 'processing', detectTime: '2025-07-19 09:15', dept: '审计部', detail: '中化国际物流与天津海润物流在无竞争性比价的情况下签订多份物流合同，合同单价高于市场价约30%，涉及金额2,180万元。' },
  { id: 3, companyA: '中化化肥股份有限公司', companyB: '山东农资供销有限公司', relationType: '异常资金往来', transactionAmount: '¥1,560.00万', transactionCount: 12, period: '2025年6月', riskLevel: 'medium', status: 'pending', detectTime: '2025-07-18 16:48', dept: '财务部', detail: '中化化肥与山东农资供销存在异常资金往来，资金以"预付款"名义转出后短期内回流，且未对应实际货物交付。' },
  { id: 4, companyA: '中化蓝天集团有限公司', companyB: '杭州云创科技有限公司', relationType: '违规外包', transactionAmount: '¥890.00万', transactionCount: 8, period: '2025年上半年', riskLevel: 'medium', status: 'processing', detectTime: '2025-07-17 11:20', dept: '数字化部', detail: '中化蓝天将IT系统运维项目违规外包给杭州云创科技，未经招标程序，且杭州云创科技与中化蓝天某高管存在间接关联。' },
  { id: 5, companyA: '中化塑料有限公司', companyB: '北京恒达咨询有限公司', relationType: '咨询费异常', transactionAmount: '¥560.00万', transactionCount: 5, period: '2025年Q1', riskLevel: 'low', status: 'completed', detectTime: '2025-07-16 08:05', dept: '审计部', detail: '中化塑料向北京恒达咨询支付高额咨询费，经核实为正常的战略咨询服务，已补充完善合同与交付物。' },
  { id: 6, companyA: '中化环境控股有限公司', companyB: '深圳前海富盈投资', relationType: '关联方资金拆借', transactionAmount: '¥4,200.00万', transactionCount: 3, period: '2025年Q2', riskLevel: 'medium', status: 'pending', detectTime: '2025-07-15 15:40', dept: '财务部', detail: '中化环境向深圳前海富盈投资拆出资金4,200万元，利率明显低于同期银行贷款利率，且未签订正式拆借协议。' },
  { id: 7, companyA: '中化商务有限公司', companyB: '成都锦程广告传媒有限公司', relationType: '供应商利益输送', transactionAmount: '¥720.00万', transactionCount: 15, period: '2025年上半年', riskLevel: 'high', status: 'pending', detectTime: '2025-07-14 10:22', dept: '审计部', detail: '中化商务将广告业务集中委托给成都锦程广告传媒，该公司由中化商务市场部某负责人亲属注册成立，存在明显的利益输送。' },
  { id: 8, companyA: '中化信息技术有限公司', companyB: '浪潮软件集团有限公司', relationType: '正常业务往来', transactionAmount: '¥1,560.00万', transactionCount: 6, period: '2025年上半年', riskLevel: 'low', status: 'completed', detectTime: '2025-07-13 17:55', dept: '采购部', detail: '中化信息与浪潮软件的采购业务经过公开招标程序，价格公允，经审核无违规问题，归档备查。' },
]

const STATS = [
  { label: '线索总数', value: 67, color: '#38BDF8' },
  { label: '高风险', value: 9, color: '#EF4444' },
  { label: '中风险', value: 20, color: '#F59E0B' },
  { label: '低风险', value: 38, color: '#2DD4BF' },
]

const RISK_DIST = [
  { label: '关联交易未披露', high: 3, medium: 5, low: 8, total: 16 },
  { label: '利益输送嫌疑', high: 2, medium: 4, low: 7, total: 13 },
  { label: '违规外包', high: 1, medium: 3, low: 6, total: 10 },
  { label: '资金拆借异常', high: 2, medium: 4, low: 8, total: 14 },
  { label: '咨询费/服务费异常', high: 1, medium: 4, low: 9, total: 14 },
]

const DEPTS = ['全部部门', '审计部', '财务部', '数字化部', '采购部']

export function BusinessDealingsClues() {
  const [levelFilter, setLevelFilter] = useState('全部')
  const [statusFilter, setStatusFilter] = useState('全部')
  const [deptFilter, setDeptFilter] = useState('全部部门')
  const [search, setSearch] = useState('')
  const [selectedClue, setSelectedClue] = useState<ClueRow | null>(null)

  const filtered = CLUES.filter((c) => {
    const matchLevel = levelFilter === '全部' || c.riskLevel === levelFilter
    const matchStatus = statusFilter === '全部' || c.status === statusFilter
    const matchDept = deptFilter === '全部部门' || c.dept === deptFilter
    const matchSearch = !search || c.companyA.includes(search) || c.companyB.includes(search) || c.relationType.includes(search)
    return matchLevel && matchStatus && matchDept && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-page-title text-[#0B1D4A]">违规业务往来领域风险线索</h1>
        <p className="mt-1 text-sm text-[#8BA4C7]">
          监控企业与外部单位之间的异常业务往来，识别利益输送、关联交易等违规行为
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
            <input type="text" placeholder="搜索企业名称..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-52 rounded-md border border-[#D8E2F0] bg-white py-1.5 pl-9 pr-3 text-xs text-[#0F2245] placeholder:text-[#8BA4C7] focus:border-[#38BDF8] focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-lg bg-white shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D8E2F0] bg-[#F8FAFD]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8BA4C7]">本单位</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8BA4C7]">外部企业</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8BA4C7]">关系类型</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[#8BA4C7]">涉及金额</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8BA4C7]">交易笔数</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8BA4C7]">所属期间</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8BA4C7]">风险等级</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8BA4C7]">状态</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8BA4C7]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2F5]">
              {filtered.map((clue) => (
                <tr key={clue.id} className="group hover:bg-[#EDF2F9] transition-colors cursor-pointer" onClick={() => setSelectedClue(clue)}>
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{clue.companyA}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{clue.companyB}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{clue.relationType}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245] text-right font-number">{clue.transactionAmount}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245] text-center font-number">{clue.transactionCount}</td>
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
                <h3 className="text-sm font-semibold text-[#0F2245] mb-3">{selectedClue.companyA} ↔ {selectedClue.companyB}</h3>
                <div className="flex items-center gap-2">
                  <RiskLevelTag level={selectedClue.riskLevel} size="md" />
                  <StatusBadge level={selectedClue.status === 'pending' ? 'yellow' : selectedClue.status === 'processing' ? 'blue' : 'green'} label={selectedClue.status === 'pending' ? '待处理' : selectedClue.status === 'processing' ? '处理中' : '已完成'} size="md" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><Building2 size={13} />本单位</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.companyA}</div>
                </div>
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><Users size={13} />外部企业</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.companyB}</div>
                </div>
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><FileText size={13} />关系类型</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.relationType}</div>
                </div>
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><DollarSign size={13} />涉及金额</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.transactionAmount}</div>
                </div>
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><Calendar size={13} />发现时间</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.detectTime}</div>
                </div>
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><Shield size={13} />责任部门</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.dept}</div>
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
