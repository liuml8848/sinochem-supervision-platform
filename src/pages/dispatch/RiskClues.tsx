import { useState } from 'react'
import { Search, Filter, Eye, Download, ChevronDown, Calendar } from 'lucide-react'

const DOMAINS = ['全部领域', '招标采购', '经商办企', '财务监督']
const LEVELS = ['全部级别', '高风险', '中风险', '低风险']
const STATUSES = ['全部状态', '待核实', '核实中', '已转处置', '已归档']
const DATE_RANGES = ['全部时间', '近7天', '近30天', '近90天', '自定义']

interface Clue {
  id: number
  code: string
  title: string
  source: string
  domain: string
  domainColor: string
  level: string
  levelColor: string
  status: string
  statusColor: string
  createdAt: string
}

const CLUES: Clue[] = [
  { id: 1, code: 'XC-2026-0001', title: '某化工项目三家投标人MAC地址相同，涉嫌围标', source: '围标串标检测模型', domain: '招标采购', domainColor: '#EF4444', level: '高风险', levelColor: '#EF4444', status: '待核实', statusColor: '#F59E0B', createdAt: '2026-07-18 09:32' },
  { id: 2, code: 'XC-2026-0002', title: '某子公司设备采购金额超过300万元未招标', source: '应招未招检测模型', domain: '招标采购', domainColor: '#EF4444', level: '高风险', levelColor: '#EF4444', status: '核实中', statusColor: '#38BDF8', createdAt: '2026-07-17 14:15' },
  { id: 3, code: 'XC-2026-0003', title: '某区域负责人配偶名下公司与其所在企业有业务往来', source: '亲属经商识别模型', domain: '经商办企', domainColor: '#8B5CF6', level: '高风险', levelColor: '#EF4444', status: '已转处置', statusColor: '#8B5CF6', createdAt: '2026-07-16 11:20' },
  { id: 4, code: 'XC-2026-0004', title: '某贸易公司应收账款逾期超1年，涉及金额约2800万元', source: '账款拖欠监测模型', domain: '财务监督', domainColor: '#38BDF8', level: '高风险', levelColor: '#EF4444', status: '待核实', statusColor: '#F59E0B', createdAt: '2026-07-16 10:05' },
  { id: 5, code: 'XC-2026-0005', title: '某项目投标人中标率异常偏高(85%)，需核查关联关系', source: '投标人高中标率检测', domain: '招标采购', domainColor: '#EF4444', level: '中风险', levelColor: '#F59E0B', status: '核实中', statusColor: '#38BDF8', createdAt: '2026-07-15 16:42' },
  { id: 6, code: 'XC-2026-0006', title: '某销售经理在外注册同类型公司涉嫌利益输送', source: '在职员工经商办企检测', domain: '经商办企', domainColor: '#8B5CF6', level: '中风险', levelColor: '#F59E0B', status: '已转处置', statusColor: '#8B5CF6', createdAt: '2026-07-14 08:30' },
  { id: 7, code: 'XC-2026-0007', title: '某下属企业资产负债率连续6个月超过90%警戒线', source: '过度负债监测模型', domain: '财务监督', domainColor: '#38BDF8', level: '中风险', levelColor: '#F59E0B', status: '已归档', statusColor: '#2DD4BF', createdAt: '2026-07-13 13:55' },
  { id: 8, code: 'XC-2026-0008', title: '某基建项目评标委员会成员与中标人存在历史关联', source: '异常投标行为检测', domain: '招标采购', domainColor: '#EF4444', level: '低风险', levelColor: '#2DD4BF', status: '已归档', statusColor: '#2DD4BF', createdAt: '2026-07-12 15:10' },
]

export function RiskClues() {
  const [domain, setDomain] = useState('全部领域')
  const [level, setLevel] = useState('全部级别')
  const [status, setStatus] = useState('全部状态')
  const [dateRange, setDateRange] = useState('全部时间')
  const [search, setSearch] = useState('')

  const filtered = CLUES.filter((c) => {
    const matchDomain = domain === '全部领域' || c.domain === domain
    const matchLevel = level === '全部级别' || c.level === level
    const matchStatus = status === '全部状态' || c.status === status
    const matchSearch = !search || c.title.includes(search) || c.code.includes(search) || c.source.includes(search)
    return matchDomain && matchLevel && matchStatus && matchSearch
  })

  function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
    const [open, setOpen] = useState(false)
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="flex items-center gap-2 rounded-md border border-[#D8E2F0] bg-white px-3 py-2 text-sm text-[#0F2245] hover:border-[#8BA4C7] transition-colors"
        >
          {value}
          <ChevronDown size={14} className="text-[#8BA4C7]" />
        </button>
        {open && (
          <div className="absolute left-0 top-full z-10 mt-1 min-w-[140px] rounded-md border border-[#D8E2F0] bg-white py-1 shadow-lg">
            {options.map((opt) => (
              <button
                key={opt}
                onMouseDown={() => { onChange(opt); setOpen(false) }}
                className={`w-full px-3 py-1.5 text-left text-sm transition-colors ${value === opt ? 'bg-[#EDF2F9] text-[#0B1D4A] font-medium' : 'text-[#0F2245] hover:bg-[#F8FAFD]'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title text-[#0B1D4A]">风险线索</h1>
        <p className="mt-1 text-sm text-[#8BA4C7]">
          共 <span className="font-semibold text-[#0F2245]">{CLUES.length}</span> 条线索，
          <span className="text-[#EF4444] font-medium"> {CLUES.filter((c) => c.level === '高风险').length} 条高风险</span>
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-white p-4 shadow-card">
        <div className="flex items-center gap-2 text-sm text-[#8BA4C7]">
          <Filter size={16} />
          <span>筛选</span>
        </div>

        <Select value={domain} options={DOMAINS} onChange={setDomain} />
        <Select value={level} options={LEVELS} onChange={setLevel} />
        <Select value={status} options={STATUSES} onChange={setStatus} />
        <Select value={dateRange} options={DATE_RANGES} onChange={setDateRange} />

        <div className="relative ml-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8BA4C7]" />
          <input
            type="text"
            placeholder="搜索线索编号、标题或来源..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-60 rounded-md border border-[#D8E2F0] bg-white py-2 pl-9 pr-3 text-sm text-[#0F2245] placeholder:text-[#8BA4C7] focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
          />
        </div>

        <button className="inline-flex items-center gap-1.5 rounded-md bg-[#38BDF8] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
          <Download size={14} />
          导出
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#D8E2F0] bg-[#F8FAFD]">
                <th className="px-4 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider w-12">序号</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">线索编号</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">线索标题</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">来源</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">领域</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">预警级别</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">状态</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">创建时间</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((clue) => (
                <tr key={clue.id} className="border-b border-[#D8E2F0]/50 last:border-b-0 hover:bg-[#F8FAFD] transition-colors">
                  <td className="px-4 py-3.5 text-sm text-[#8BA4C7]">{String(clue.id).padStart(2, '0')}</td>
                  <td className="px-4 py-3.5 text-sm font-mono text-[#0F2245]">{clue.code}</td>
                  <td className="px-4 py-3.5 text-sm text-[#0F2245] max-w-[280px] truncate" title={clue.title}>{clue.title}</td>
                  <td className="px-4 py-3.5 text-sm text-[#8BA4C7]">{clue.source}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{ backgroundColor: clue.domainColor + '10', color: clue.domainColor }}
                    >
                      {clue.domain}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="inline-block rounded px-2 py-0.5 text-xs font-semibold"
                      style={{ backgroundColor: clue.levelColor + '14', color: clue.levelColor }}
                    >
                      {clue.level}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{ backgroundColor: clue.statusColor + '12', color: clue.statusColor }}
                    >
                      {clue.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-[#8BA4C7]">{clue.createdAt}</td>
                  <td className="px-4 py-3.5">
                    <button className="inline-flex items-center gap-1 text-xs font-medium text-[#38BDF8] hover:text-[#0B1D4A] transition-colors">
                      <Eye size={14} />
                      查看
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-[#8BA4C7]">
            <Search size={48} className="text-[#D8E2F0]" />
            <p className="mt-4 text-sm">未找到匹配的线索</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[#D8E2F0] px-4 py-3">
          <span className="text-xs text-[#8BA4C7]">显示 {filtered.length} 条，共 {CLUES.length} 条</span>
          <div className="flex items-center gap-1">
            <button className="rounded-md border border-[#D8E2F0] px-3 py-1.5 text-xs text-[#8BA4C7] hover:bg-[#F8FAFD]">上一页</button>
            <button className="rounded-md bg-[#0B1D4A] px-3 py-1.5 text-xs text-white">1</button>
            <button className="rounded-md border border-[#D8E2F0] px-3 py-1.5 text-xs text-[#8BA4C7] hover:bg-[#F8FAFD]">2</button>
            <button className="rounded-md border border-[#D8E2F0] px-3 py-1.5 text-xs text-[#8BA4C7] hover:bg-[#F8FAFD]">3</button>
            <span className="px-1 text-xs text-[#8BA4C7]">...</span>
            <button className="rounded-md border border-[#D8E2F0] px-3 py-1.5 text-xs text-[#8BA4C7] hover:bg-[#F8FAFD]">下一页</button>
          </div>
        </div>
      </div>
    </div>
  )
}
