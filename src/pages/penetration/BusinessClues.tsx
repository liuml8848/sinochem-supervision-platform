import { useState } from 'react'
import {
  Search, X, FileText, Calendar, User, Building2, Shield, ExternalLink, Filter, Briefcase
} from 'lucide-react'
import { StatusBadge, RiskLevelTag } from '@/components/StatusBadge'

interface ClueRow {
  id: number
  personName: string
  personDept: string
  personPosition: string
  companyName: string
  registerDate: string
  registeredCapital: string
  riskLevel: 'high' | 'medium' | 'low'
  status: 'pending' | 'processing' | 'completed'
  detectTime: string
  detail: string
}

const CLUES: ClueRow[] = [
  { id: 1, personName: '张伟', personDept: '采购部', personPosition: '高级经理', companyName: '上海瑞鑫商贸有限公司', registerDate: '2023-03-15', registeredCapital: '500万', riskLevel: 'high', status: 'pending', detectTime: '2025-07-20 14:32', detail: '张伟担任采购部高级经理期间，其配偶注册成立上海瑞鑫商贸有限公司，该公司与中化存在多笔采购交易，涉嫌利益输送。' },
  { id: 2, personName: '李强', personDept: '工程建设部', personPosition: '副总经理', companyName: '北京恒达建筑咨询有限公司', registerDate: '2024-01-08', registeredCapital: '200万', riskLevel: 'high', status: 'processing', detectTime: '2025-07-19 09:15', detail: '李强未按规定申报，以其堂兄名义注册北京恒达建筑咨询有限公司，该公司承接了中化集团多个工程项目咨询服务。' },
  { id: 3, personName: '王芳', personDept: '财务部', personPosition: '资金主管', companyName: '深圳前海富盈投资合伙企业', registerDate: '2022-11-20', registeredCapital: '1,000万', riskLevel: 'medium', status: 'pending', detectTime: '2025-07-18 16:48', detail: '王芳作为资金主管，在外参股投资公司，与中化有间接资金往来，需进一步核实是否涉及利益冲突。' },
  { id: 4, personName: '赵明', personDept: '信息技术部', personPosition: '总监', companyName: '杭州云创科技有限公司', registerDate: '2024-06-01', registeredCapital: '300万', riskLevel: 'medium', status: 'processing', detectTime: '2025-07-17 11:20', detail: '赵明在入职中化前注册的公司至今未注销，且该公司曾参与中化IT项目投标，未在任职时申报。' },
  { id: 5, personName: '陈静', personDept: '人力资源部', personPosition: '招聘主管', companyName: '广州智联人力资源服务有限公司', registerDate: '2023-08-12', registeredCapital: '100万', riskLevel: 'low', status: 'completed', detectTime: '2025-07-16 08:05', detail: '陈静亲属注册的人力资源公司与中化有业务往来，但经核实已在入职时如实申报且采取了回避措施。' },
  { id: 6, personName: '刘洋', personDept: '市场部', personPosition: '区域经理', companyName: '成都锦程广告传媒有限公司', registerDate: '2024-04-18', registeredCapital: '150万', riskLevel: 'medium', status: 'pending', detectTime: '2025-07-15 15:40', detail: '刘洋利用职务之便，将公司广告业务外包给其个人注册的公司，涉嫌利益输送。' },
  { id: 7, personName: '孙磊', personDept: '供应链管理部', personPosition: '副经理', companyName: '天津海润物流有限公司', registerDate: '2023-12-05', registeredCapital: '800万', riskLevel: 'high', status: 'pending', detectTime: '2025-07-14 10:22', detail: '孙磊以其亲属名义注册物流公司，近一年承接中化物流订单超2,000万元，未向组织申报。' },
  { id: 8, personName: '周婷', personDept: '法务部', personPosition: '法务主管', companyName: '北京君合律师事务所（合伙）', registerDate: '2022-05-30', registeredCapital: '--', riskLevel: 'low', status: 'completed', detectTime: '2025-07-13 17:55', detail: '周婷在入职前为律师事务所合伙人，现已办理退伙并完成工商变更，经核实无利益冲突。' },
]

const STATS = [
  { label: '线索总数', value: 89, color: '#38BDF8' },
  { label: '高风险', value: 12, color: '#EF4444' },
  { label: '中风险', value: 28, color: '#F59E0B' },
  { label: '低风险', value: 49, color: '#2DD4BF' },
]

const RISK_DIST = [
  { label: '亲属经商办企', high: 5, medium: 10, low: 15, total: 30 },
  { label: '违规持股', high: 3, medium: 7, low: 12, total: 22 },
  { label: '未申报兼职', high: 2, medium: 6, low: 10, total: 18 },
  { label: '利益冲突交易', high: 2, medium: 5, low: 12, total: 19 },
]

const DEPTS = ['全部部门', '采购部', '工程建设部', '财务部', '信息技术部', '人力资源部', '市场部', '供应链管理部', '法务部']

export function BusinessClues() {
  const [levelFilter, setLevelFilter] = useState('全部')
  const [statusFilter, setStatusFilter] = useState('全部')
  const [deptFilter, setDeptFilter] = useState('全部部门')
  const [search, setSearch] = useState('')
  const [selectedClue, setSelectedClue] = useState<ClueRow | null>(null)

  const filtered = CLUES.filter((c) => {
    const matchLevel = levelFilter === '全部' || c.riskLevel === levelFilter
    const matchStatus = statusFilter === '全部' || c.status === statusFilter
    const matchDept = deptFilter === '全部部门' || c.personDept === deptFilter
    const matchSearch = !search || c.personName.includes(search) || c.companyName.includes(search) || c.personDept.includes(search)
    return matchLevel && matchStatus && matchDept && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-page-title text-[#0B1D4A]">经商办企领域风险线索</h1>
        <p className="mt-1 text-sm text-[#8BA4C7]">
          全面排查员工及亲属经商办企业、违规持股、利益冲突等违规行为
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
            <input type="text" placeholder="搜索姓名或企业..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-52 rounded-md border border-[#D8E2F0] bg-white py-1.5 pl-9 pr-3 text-xs text-[#0F2245] placeholder:text-[#8BA4C7] focus:border-[#38BDF8] focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-lg bg-white shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D8E2F0] bg-[#F8FAFD]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8BA4C7]">人员姓名</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8BA4C7]">所在部门</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8BA4C7]">职务</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#8BA4C7]">注册企业名称</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8BA4C7]">注册日期</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[#8BA4C7]">注册资本</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8BA4C7]">风险等级</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8BA4C7]">状态</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#8BA4C7]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2F5]">
              {filtered.map((clue) => (
                <tr key={clue.id} className="group hover:bg-[#EDF2F9] transition-colors cursor-pointer" onClick={() => setSelectedClue(clue)}>
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{clue.personName}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{clue.personDept}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{clue.personPosition}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245] max-w-[200px] truncate">{clue.companyName}</td>
                  <td className="px-4 py-3 text-sm text-[#8BA4C7] text-center">{clue.registerDate}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245] text-right font-number">{clue.registeredCapital}</td>
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
                <h3 className="text-sm font-semibold text-[#0F2245] mb-3">{selectedClue.personName} - {selectedClue.companyName}</h3>
                <div className="flex items-center gap-2">
                  <RiskLevelTag level={selectedClue.riskLevel} size="md" />
                  <StatusBadge level={selectedClue.status === 'pending' ? 'yellow' : selectedClue.status === 'processing' ? 'blue' : 'green'} label={selectedClue.status === 'pending' ? '待处理' : selectedClue.status === 'processing' ? '处理中' : '已完成'} size="md" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><User size={13} />人员姓名</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.personName}</div>
                </div>
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><Briefcase size={13} />职务</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.personPosition}</div>
                </div>
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><Building2 size={13} />所在部门</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.personDept}</div>
                </div>
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><Calendar size={13} />发现时间</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.detectTime}</div>
                </div>
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><Building2 size={13} />注册企业</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.companyName}</div>
                </div>
                <div className="rounded-lg bg-[#F8FAFD] p-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BA4C7] mb-1"><FileText size={13} />注册资本</div>
                  <div className="text-sm text-[#0F2245] font-medium">{selectedClue.registeredCapital}</div>
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
