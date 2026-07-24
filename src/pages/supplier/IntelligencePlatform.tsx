import { useState } from 'react'
import {
  Search,
  Building2,
  Users,
  Link2,
  AlertTriangle,
  Shield,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
} from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { cn } from '@/lib/utils'

interface Shareholder {
  name: string
  ratio: string
  type: string
}

interface RelatedCompany {
  name: string
  relation: string
  status: string
}

interface RiskIndicator {
  label: string
  level: 'high' | 'medium' | 'low'
  detail: string
}

interface SupplierProfile {
  id: string
  name: string
  regCode: string
  legalPerson: string
  registeredCapital: string
  establishedDate: string
  address: string
  industry: string
  businessScope: string
  shareholders: Shareholder[]
  relatedCompanies: RelatedCompany[]
  riskIndicators: RiskIndicator[]
  status: 'active' | 'inactive' | 'suspicious'
}

const supplierData: SupplierProfile[] = [
  {
    id: 'SUP-001',
    name: '中化蓝天集团有限公司',
    regCode: '91330000712878901X',
    legalPerson: '王建国',
    registeredCapital: '¥12.8亿',
    establishedDate: '1998-03-15',
    address: '浙江省杭州市西湖区文二路218号',
    industry: '化工原料制造',
    businessScope: '化工产品研发、生产与销售；危险化学品经营；货物进出口（依法须经批准的项目，经相关部门批准后方可开展经营活动）',
    shareholders: [
      { name: '中国中化集团有限公司', ratio: '65.2%', type: '国有法人' },
      { name: '浙江省国有资本运营有限公司', ratio: '18.5%', type: '国有法人' },
      { name: '其他股东', ratio: '16.3%', type: '社会公众' },
    ],
    relatedCompanies: [
      { name: '中化蓝天化工新材料有限公司', relation: '全资子公司', status: '存续' },
      { name: '浙江蓝天环保科技有限公司', relation: '控股子公司', status: '存续' },
      { name: '杭州中蓝新材料研发中心', relation: '关联公司', status: '存续' },
    ],
    riskIndicators: [
      { label: '经营异常', level: 'low', detail: '无异常记录' },
      { label: '行政处罚', level: 'medium', detail: '2025年存在1起环保处罚（已整改）' },
      { label: '司法诉讼', level: 'medium', detail: '涉及2起合同纠纷（审理中）' },
      { label: '关联交易', level: 'high', detail: '与子公司存在大额关联交易（需关注）' },
    ],
    status: 'active',
  },
  {
    id: 'SUP-002',
    name: '江苏中化化工装备有限公司',
    regCode: '91320000781654321P',
    legalPerson: '张志强',
    registeredCapital: '¥5.2亿',
    establishedDate: '2002-07-22',
    address: '江苏省南京市鼓楼区中山北路200号',
    industry: '化工装备制造',
    businessScope: '化工设备设计、制造、安装；压力容器制造；机械设备维修；技术咨询服务',
    shareholders: [
      { name: '陈明辉', ratio: '42.0%', type: '自然人' },
      { name: '中国中化集团有限公司', ratio: '33.5%', type: '国有法人' },
      { name: '南京化工投资有限公司', ratio: '24.5%', type: '企业法人' },
    ],
    relatedCompanies: [
      { name: '江苏中化装备安装工程有限公司', relation: '全资子公司', status: '存续' },
      { name: '南京中化设备检测中心', relation: '控股子公司', status: '存续' },
    ],
    riskIndicators: [
      { label: '经营异常', level: 'high', detail: '2026年2月被列入经营异常名录（未公示年度报告）' },
      { label: '行政处罚', level: 'high', detail: '2025年因安全事故被处罚款45万元' },
      { label: '司法诉讼', level: 'high', detail: '涉及5起买卖合同纠纷（3起败诉）' },
      { label: '关联交易', level: 'medium', detail: '实际控制人关联公司存在资金拆借' },
    ],
    status: 'suspicious',
  },
  {
    id: 'SUP-003',
    name: '中化现代农业有限公司',
    regCode: '91310000MA1FL3ABC8',
    legalPerson: '李文慧',
    registeredCapital: '¥8.6亿',
    establishedDate: '2008-11-03',
    address: '北京市西城区复兴门内大街28号',
    industry: '现代农业服务',
    businessScope: '农业技术开发、技术推广；化肥、农药、农膜销售；种子经营；农业信息服务；粮食收购',
    shareholders: [
      { name: '中国中化集团有限公司', ratio: '78.3%', type: '国有法人' },
      { name: '中国农业产业发展基金', ratio: '12.5%', type: '国有法人' },
      { name: '中化资本有限公司', ratio: '9.2%', type: '企业法人' },
    ],
    relatedCompanies: [
      { name: '中化现代农业（山东）有限公司', relation: '全资子公司', status: '存续' },
      { name: '中化现代农业（河南）有限公司', relation: '全资子公司', status: '存续' },
      { name: '北京中化农业科技研究院', relation: '关联公司', status: '存续' },
      { name: '中化化肥有限公司', relation: '兄弟公司', status: '存续' },
    ],
    riskIndicators: [
      { label: '经营异常', level: 'low', detail: '无异常记录' },
      { label: '行政处罚', level: 'low', detail: '无行政处罚记录' },
      { label: '司法诉讼', level: 'low', detail: '无重大诉讼记录' },
      { label: '关联交易', level: 'medium', detail: '与关联方交易占比较高（约35%）' },
    ],
    status: 'active',
  },
  {
    id: 'SUP-004',
    name: '上海中化国际物流有限公司',
    regCode: '9131000067123DEF56',
    legalPerson: '赵晓东',
    registeredCapital: '¥3.2亿',
    establishedDate: '2010-05-18',
    address: '上海市浦东新区陆家嘴环路1000号',
    industry: '物流运输',
    businessScope: '道路货物运输；国际货运代理；仓储服务；供应链管理；物流方案设计',
    shareholders: [
      { name: '中化国际物流控股有限公司', ratio: '60.0%', type: '企业法人' },
      { name: '上海港务集团', ratio: '25.0%', type: '国有法人' },
      { name: '其他股东', ratio: '15.0%', type: '社会公众' },
    ],
    relatedCompanies: [
      { name: '上海中化国际货运代理有限公司', relation: '全资子公司', status: '存续' },
      { name: '中化物流（宁波）有限公司', relation: '控股子公司', status: '存续' },
    ],
    riskIndicators: [
      { label: '经营异常', level: 'low', detail: '无异常记录' },
      { label: '行政处罚', level: 'medium', detail: '2025年因超载运输被处罚3次' },
      { label: '司法诉讼', level: 'low', detail: '涉及1起运输合同纠纷（已调解）' },
      { label: '关联交易', level: 'low', detail: '关联交易占比较低' },
    ],
    status: 'active',
  },
]

function CompanyInfoField({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={14} className="mt-0.5 text-[#8BA4C7] flex-shrink-0" />
      <div className="min-w-0">
        <span className="text-[10px] text-[#8BA4C7]">{label}</span>
        <p className="text-xs text-[#0F2245] break-all">{value}</p>
      </div>
    </div>
  )
}

function SupplierDetailCard({ supplier }: { supplier: SupplierProfile }) {
  const [expanded, setExpanded] = useState(false)

  const statusMap: Record<string, { level: 'green' | 'red' | 'yellow'; label: string }> = {
    active: { level: 'green', label: '正常' },
    inactive: { level: 'red', label: '停用' },
    suspicious: { level: 'yellow', label: '关注' },
  }

  return (
    <div className="rounded-lg bg-white shadow-card transition-shadow hover:shadow-card-hover">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D8E2F0] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#38BDF8]/10">
            <Building2 size={20} className="text-[#38BDF8]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#0F2245]">{supplier.name}</h3>
              <StatusBadge
                level={statusMap[supplier.status].level}
                label={statusMap[supplier.status].label}
              />
            </div>
            <p className="text-xs text-[#8BA4C7]">{supplier.industry} | {supplier.regCode}</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-[#38BDF8] hover:underline"
        >
          {expanded ? '收起' : '展开'}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Basic Info Grid */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <CompanyInfoField icon={Users} label="法定代表人" value={supplier.legalPerson} />
        <CompanyInfoField icon={DollarSign} label="注册资本" value={supplier.registeredCapital} />
        <CompanyInfoField icon={Calendar} label="成立日期" value={supplier.establishedDate} />
        <CompanyInfoField icon={MapPin} label="注册地址" value={supplier.address} />
      </div>

      {/* Business Scope */}
      <div className="border-t border-[#D8E2F0] px-4 py-3">
        <div className="flex items-start gap-2">
          <FileText size={14} className="mt-0.5 text-[#8BA4C7] flex-shrink-0" />
          <div>
            <span className="text-[10px] text-[#8BA4C7]">经营范围</span>
            <p className="text-xs text-[#0F2245]">{supplier.businessScope}</p>
          </div>
        </div>
      </div>

      {/* Expanded Sections */}
      {expanded && (
        <div className="border-t border-[#D8E2F0]">
          {/* Shareholders */}
          <div className="border-b border-[#D8E2F0] px-4 py-3">
            <div className="mb-2 flex items-center gap-1.5">
              <Users size={14} className="text-[#38BDF8]" />
              <span className="text-xs font-medium text-[#0F2245]">股东信息</span>
            </div>
            <div className="space-y-2">
              {supplier.shareholders.map((sh, i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-[#EDF2F9]/50 px-3 py-2">
                  <span className="text-xs text-[#0F2245]">{sh.name}</span>
                  <span className="text-xs text-[#8BA4C7]">{sh.ratio} | {sh.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Companies */}
          <div className="border-b border-[#D8E2F0] px-4 py-3">
            <div className="mb-2 flex items-center gap-1.5">
              <Link2 size={14} className="text-[#38BDF8]" />
              <span className="text-xs font-medium text-[#0F2245]">关联企业</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {supplier.relatedCompanies.map((rc, i) => (
                <div key={i} className="rounded-md border border-[#D8E2F0] px-3 py-2">
                  <p className="text-xs font-medium text-[#0F2245]">{rc.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[10px] text-[#8BA4C7]">{rc.relation}</span>
                    <span className="text-[10px] text-[#2DD4BF]">{rc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Indicators */}
          <div className="px-4 py-3">
            <div className="mb-2 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-[#EF4444]" />
              <span className="text-xs font-medium text-[#0F2245]">风险指标</span>
            </div>
            <div className="space-y-2">
              {supplier.riskIndicators.map((ri, i) => (
                <div key={i} className="flex items-start gap-3 rounded-md border border-[#D8E2F0] px-3 py-2">
                  <Shield
                    size={14}
                    className={cn(
                      'mt-0.5 flex-shrink-0',
                      ri.level === 'high' ? 'text-[#EF4444]' : ri.level === 'medium' ? 'text-[#F59E0B]' : 'text-[#2DD4BF]'
                    )}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#0F2245]">{ri.label}</span>
                      <StatusBadge
                        level={ri.level === 'high' ? 'red' : ri.level === 'medium' ? 'yellow' : 'green'}
                        label={ri.level === 'high' ? '高风险' : ri.level === 'medium' ? '中风险' : '低风险'}
                        size="sm"
                      />
                    </div>
                    <p className="mt-0.5 text-xs text-[#8BA4C7]">{ri.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function IntelligencePlatform() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<string>('all')

  const filteredSuppliers = supplierData.filter((s) => {
    const matchesSearch =
      s.name.includes(searchQuery) ||
      s.regCode.includes(searchQuery) ||
      s.legalPerson.includes(searchQuery)
    if (activeTab === 'all') return matchesSearch
    if (activeTab === 'active') return matchesSearch && s.status === 'active'
    if (activeTab === 'suspicious') return matchesSearch && s.status === 'suspicious'
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="情报中台"
        description="供应商全景情报查询与关联分析"
      />

      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8BA4C7]" />
          <input
            type="text"
            placeholder="搜索供应商名称、统一社会信用代码、法定代表人..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[#D8E2F0] bg-white py-2 pl-9 pr-4 text-xs text-[#0F2245] placeholder:text-[#8BA4C7] focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
          />
        </div>
        <div className="flex items-center gap-2">
          {[
            { key: 'all', label: '全部' },
            { key: 'active', label: '正常' },
            { key: 'suspicious', label: '需关注' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                activeTab === tab.key
                  ? 'bg-[#0B1D4A] text-white'
                  : 'bg-white text-[#8BA4C7] border border-[#D8E2F0] hover:border-[#38BDF8] hover:text-[#38BDF8]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Supplier List */}
      <div className="space-y-4">
        {filteredSuppliers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Building2 size={40} className="text-[#D8E2F0]" />
            <p className="mt-3 text-sm text-[#8BA4C7]">未找到匹配的供应商信息</p>
            <p className="mt-1 text-xs text-[#D8E2F0]">请调整搜索条件后重试</p>
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <SupplierDetailCard key={supplier.id} supplier={supplier} />
          ))
        )}
      </div>

      {/* Summary Bar */}
      <div className="rounded-lg bg-white px-4 py-3 shadow-card">
        <div className="flex items-center justify-center gap-8 text-xs text-[#8BA4C7]">
          <span>共 <strong className="text-[#0F2245]">{supplierData.length}</strong> 家供应商</span>
          <span>正常 <strong className="text-[#2DD4BF]">{supplierData.filter(s => s.status === 'active').length}</strong> 家</span>
          <span>关注 <strong className="text-[#F59E0B]">{supplierData.filter(s => s.status === 'suspicious').length}</strong> 家</span>
          <span>停用 <strong className="text-[#EF4444]">{supplierData.filter(s => s.status === 'inactive').length}</strong> 家</span>
        </div>
      </div>
    </div>
  )
}
