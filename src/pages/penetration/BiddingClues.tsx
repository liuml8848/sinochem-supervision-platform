import { useState } from 'react'
import {
  Search, AlertTriangle, ChevronDown, X, FileText, Calendar,
  Building2, User, Shield, ExternalLink, Filter
} from 'lucide-react'
import { StatusBadge, RiskLevelTag } from '@/components/StatusBadge'

interface ClueRow {
  id: number
  projectName: string
  biddingOrg: string
  bidder: string
  bidAmount: string
  riskLevel: 'high' | 'medium' | 'low'
  status: 'pending' | 'processing' | 'completed'
  detectTime: string
  dept: string
  detail: string
}

const CLUES: ClueRow[] = [
  { id: 1, projectName: '中化泉州石化EO/EG装置技术改造项目', biddingOrg: '泉州石化采购部', bidder: '中国寰球工程有限公司', bidAmount: '¥2,860.00万', riskLevel: 'high', status: 'pending', detectTime: '2025-07-20 14:32', dept: '工程建设部', detail: '该项目投标人之间存在IP地址一致、文件属性相同等围标特征，且中标价格明显高于市场均价15.3%。' },
  { id: 2, projectName: '中化国际物流园区仓储设施建设项目', biddingOrg: '中化国际物流', bidder: '中建三局集团有限公司', bidAmount: '¥4,520.00万', riskLevel: 'high', status: 'processing', detectTime: '2025-07-19 09:15', dept: '工程建设部', detail: '该项目未按《招标投标法》进行公开招标，直接委托特定供应商，涉嫌应招未招。' },
  { id: 3, projectName: '中化化肥生产基地智能化改造项目', biddingOrg: '中化化肥', bidder: '浙江中控技术股份有限公司', bidAmount: '¥1,280.00万', riskLevel: 'medium', status: 'pending', detectTime: '2025-07-18 16:48', dept: '数字化部', detail: '投标人资质文件存在疑点，近三年的类似项目业绩无法核实，可能存在资质挂靠。' },
  { id: 4, projectName: '中化能源科技研发中心装修工程', biddingOrg: '中化能源科技', bidder: '深圳市建筑装饰集团有限公司', bidAmount: '¥680.00万', riskLevel: 'medium', status: 'processing', detectTime: '2025-07-17 11:20', dept: '行政部', detail: '采购价格高于同期市场均价约22%，且供应商为近三月新注册企业。' },
  { id: 5, projectName: '中化蓝天氟化工原料采购项目', biddingOrg: '中化蓝天采购部', bidder: '浙江巨化股份有限公司', bidAmount: '¥3,150.00万', riskLevel: 'low', status: 'completed', detectTime: '2025-07-16 08:05', dept: '采购部', detail: '供应商与评标专家存在间接关联关系，经核实为正常商业合作，已归档。' },
  { id: 6, projectName: '中化塑料华北区域物流服务招标', biddingOrg: '中化塑料', bidder: '中外运物流有限公司', bidAmount: '¥920.00万', riskLevel: 'medium', status: 'pending', detectTime: '2025-07-15 15:40', dept: '物流管理部', detail: '招标文件存在明显的倾向性条款，指定特定品牌和技术参数，限制竞争。' },
  { id: 7, projectName: '中化环境污水处理设备集采项目', biddingOrg: '中化环境', bidder: '碧水源科技股份有限公司', bidAmount: '¥2,100.00万', riskLevel: 'high', status: 'pending', detectTime: '2025-07-14 10:22', dept: '采购部', detail: '投标保证金来自同一账户，三家投标人存在关联关系，高度疑似围标。' },
  { id: 8, projectName: '中化商务信息系统升级项目', biddingOrg: '中化信息技术部', bidder: '浪潮软件集团有限公司', bidAmount: '¥1,560.00万', riskLevel: 'low', status: 'completed', detectTime: '2025-07-13 17:55', dept: '数字化部', detail: '价格偏离度较低，经人工复核已排除风险，归档备查。' },
]

const STATS = [
  { label: '线索总数', value: 156, color: '#38BDF8' },
  { label: '高风险', value: 23, color: '#EF4444' },
  { label: '中风险', value: 45, color: '#F59E0B' },
  { label: '低风险', value: 88, color: '#2DD4BF' },
]

const RISK_DIST = [
  { label: '围标串标', high: 8, medium: 15, low: 22, total: 45 },
  { label: '应招未招', high: 6, medium: 12, low: 18, total: 36 },
  { label: '资质挂靠', high: 4, medium: 8, low: 20, total: 32 },
  { label: '价格异常', high: 3, medium: 7, low: 16, total: 26 },
  { label: '倾向性条款', high: 2, medium: 3, low: 12, total: 17 },
]

const DEPTS = ['全部部门', '工程建设部', '采购部', '数字化部', '行政部', '物流管理部']

export function BiddingClues() {
  const [levelFilter, setLevelFilter] = useState('全部')
  const [statusFilter, setStatusFilter] = useState('全部')
  const [deptFilter, setDeptFilter] = useState('全部部门')
  const [search, setSearch] = useState('')
  const [selectedClue, setSelectedClue] = useState<ClueRow | null>(null)

  const filtered = CLUES.filter((c) => {
    const matchLevel = levelFilter === '全部' || c.riskLevel === levelFilter
    const matchStatus = statusFilter === '全部' || c.status === statusFilter
    const matchDept = deptFilter === '全部部门' || c.dept === deptFilter
    const matchSearch = !search || c.projectName.includes(search) || c.bidder.includes(search) || c.biddingOrg.includes(search)
    return matchLevel && matchStatus && matchDept && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-page-title text-[#0B1D4A]">招标采购领域风险线索</h1>
        <p className="mt-1 text-sm text-[#8BA4C7]">
          全面监控招标采购过程中的围标串标、应招未招、资质挂靠等违规行为
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
                  <div
                    className="h-full bg-[#EF4444] transition-all"
                    style={{ width: (item.high / item.total) * totalWidth + '%' }}
                    title={`高风险 ${item.high}条`}
                  />
                  <div
                    className="h-full bg-[#F59E0B] transition-all"
                    style={{ width: (item.medium / item.total) * totalWidth + '%' }}
                    title={`中风险 ${item.medium}条`}
                  />
                  <div
                    className="h-full bg-[#2DD4BF] transition-all"
                    style={{ width: (item.low / item.total) * totalWidth + '%' }}
                    title={`低风险 ${item.low}条`}
                  />
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
            <Filter size= {14} className="text-[#8BA4C7]" />
            <span className="text-xs text-[#8BA4C7]">筛选:</span>
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="rounded-md border border-[#D8E2F0] bg-white px-3 py-1.5 text-xs text-[#0F2245] focus:border-[#38BDF8] focus:outline-none"
          >
            <option>全部</option>
            <option value="high">高风险</option>
            <option value="medium">中风险</option>
            <option value="low">低风险</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-[#D8E2F0] bg-white px-3 py-1.5 text-xs text-[#0F2245] focus:border-[#38BDF8] focus:outline-none"
          >
            <option>全部</option>
            <option value="pending">待处理</option>
            <option value="processing">处理中</option>
            <option value="completed">已完成</option>
          </select>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-md border border-[#D8E2F0] bg-white px-3 py-1.5 text-xs text-[#0F2245] focus:border-[#38BDF8] focus:outline-none"
          >
            {DEPTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <div className="relative ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8BA4C7]" />
            <input
              type="text"
              placeholder="搜索项目名称或供应商..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-52 rounded-md border border-[#D8E2F0] bg-white py-1.5 pl-9 pr-3 text-xs text-[#0F2245] placeholder:text-[#8BA4C7] focus:border-[#38BDF8] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-lg bg-white shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D8E2F0] bg-[#F8FAFD]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8BA4C7]">项目名称</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8BA4C7]">招标单位</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8BA4C7]">投标人/供应商</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[#8BA4C7]">涉及金额</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8BA4C7]">风险等级</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8BA4C7]">状态</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8BA4C7]">发现时间</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8BA4C7]">责任部门</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8BA4C7]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2F5]">
              {filtered.map((clue) => (
                <tr
                  key={clue.id}
                  className="group hover:bg-[#EDF2F9] transition-colors cursor-pointer"
                  onClick={() => setSelectedClue(clue)}
                >
                  <td className="px-4 py-3 text-sm text-[#0F2245] max-w-[220px] truncate">{clue.projectName}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{clue.biddingOrg}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{clue.bidder}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245] text-right font-number">{clue.bidAmount}</td>
                  <td className="px-4 py-3 text-center"><RiskLevelTag level={clue.riskLevel} /></td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge
                      level={clue.status === 'pending' ? 'yellow' : clue.status === 'processing' ? 'blue' : 'green'}
                      label={clue.status === 'pending' ? '待处理' : clue.status === 'processing' ? '处理中' : '已完成'}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-[#8BA4C7]">{clue.detectTime}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{clue.dept}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedClue(clue) }}
                      className="text-[#38BDF8] hover:text-[#0EA5E9] transition-colors"
                    >
                      <ExternalLink size={15} />
                    </button>
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
              <button onClick={() => setSelectedClue(null)} className="text-[#8BA4C7] hover:text-[#0F2245] transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[#0F2245] mb-3">{selectedClue.projectName}</h3>
                <div className="flex items-center gap-2">
                  <RiskLevelTag level={selectedClue.riskLevel} size="md" />
                  <StatusBadge
                    level={selectedClue.status === 'pending' ? 'yellow' : selectedClue.status === 'processing' ? 'blue' : 'green'}
                    label={selectedClue.status === 'pending' ? '待处理' : selectedClue.status === 'processing' ? '处理中' : '已完成'}
                    size="md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><Building2 size={13} />招标单位</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.biddingOrg}</div>
                </div>
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><User size={13} />投标人</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.bidder}</div>
                </div>
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><FileText size={13} />涉及金额</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.bidAmount}</div>
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
                <button className="flex-1 rounded-lg bg-[#38BDF8] py-2 text-sm font-medium text-white hover:bg-[#0EA5E9] transition-colors">
                  开始处理
                </button>
                <button className="flex-1 rounded-lg border border-[#D8E2F0] py-2 text-sm font-medium text-[#0F2245] hover:bg-[#EDF2F9] transition-colors">
                  标记已读
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
