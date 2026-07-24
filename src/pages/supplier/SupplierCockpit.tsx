import { useState } from 'react'
import { Building2, AlertTriangle, Activity, Newspaper, Users, DollarSign, Calendar } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { ChartCard } from '@/components/ChartCard'
import { PageHeader } from '@/components/PageHeader'
import { RiskLevelTag } from '@/components/StatusBadge'
import { formatCurrency } from '@/lib/utils'

const statCards = [
  { title: '供应商总数', value: 156, icon: Building2, color: '#38BDF8' },
  { title: '高风险企业', value: 23, icon: AlertTriangle, color: '#EF4444' },
  { title: '监测中', value: 45, icon: Activity, color: '#F59E0B' },
  { title: '舆情关注', value: 12, icon: Newspaper, color: '#F97316' },
]

const riskCategories = [
  { label: '高风险 (23家)', count: 23, color: '#EF4444' },
  { label: '中风险 (34家)', count: 34, color: '#F59E0B' },
  { label: '低风险 (48家)', count: 48, color: '#38BDF8' },
  { label: '正常 (51家)', count: 51, color: '#2DD4BF' },
]

const topSuppliers = [
  { rank: 1, name: '中化蓝天集团有限公司', category: '化工原料', risk: 'high', coopCount: 47, amount: 285600000, lastDate: '2026-06-15' },
  { rank: 2, name: '中化石油销售有限公司', category: '能源物资', risk: 'high', coopCount: 38, amount: 192300000, lastDate: '2026-06-10' },
  { rank: 3, name: '北京中化工程科技有限公司', category: '工程服务', risk: 'medium', coopCount: 29, amount: 156800000, lastDate: '2026-05-28' },
  { rank: 4, name: '上海中化国际物流有限公司', category: '物流运输', risk: 'medium', coopCount: 35, amount: 87500000, lastDate: '2026-06-20' },
  { rank: 5, name: '中化现代农业有限公司', category: '农业物资', risk: 'low', coopCount: 42, amount: 72300000, lastDate: '2026-06-18' },
  { rank: 6, name: '深圳中化信息技术有限公司', category: '信息技术', risk: 'low', coopCount: 18, amount: 45600000, lastDate: '2026-05-30' },
  { rank: 7, name: '江苏中化化工装备有限公司', category: '设备制造', risk: 'high', coopCount: 22, amount: 128500000, lastDate: '2026-04-22' },
  { rank: 8, name: '广州中化贸易有限公司', category: '贸易代理', risk: 'medium', coopCount: 31, amount: 67500000, lastDate: '2026-06-05' },
  { rank: 9, name: '天津中化仓储服务有限公司', category: '仓储服务', risk: 'low', coopCount: 15, amount: 23400000, lastDate: '2026-06-12' },
  { rank: 10, name: '成都中化环保科技有限公司', category: '环保服务', risk: 'medium', coopCount: 11, amount: 18900000, lastDate: '2026-05-20' },
]

const totalRiskCount = riskCategories.reduce((sum, c) => sum + c.count, 0)

export function SupplierCockpit() {
  const [sortField] = useState<'amount' | 'coopCount' | null>(null)

  return (
    <div className="space-y-6">
      <PageHeader
        title="供应商驾驶舱"
        description="供应商全景数据监控与风险概览"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value}
            icon={s.icon}
            color={s.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Risk Distribution */}
        <ChartCard title="供应商风险分布" className="lg:col-span-3">
          <div className="space-y-5">
            {/* Stacked bar */}
            <div className="flex h-8 w-full overflow-hidden rounded-md">
              {riskCategories.map((c) => (
                <div
                  key={c.label}
                  style={{
                    width: `${(c.count / totalRiskCount) * 100}%`,
                    backgroundColor: c.color,
                  }}
                  title={c.label}
                />
              ))}
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-3">
              {riskCategories.map((c) => (
                <div key={c.label} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-xs text-[#8BA4C7]">{c.label}</span>
                </div>
              ))}
            </div>
            {/* Donut-style breakdown */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {riskCategories.map((c) => {
                const pct = ((c.count / totalRiskCount) * 100).toFixed(0)
                return (
                  <div key={c.label} className="text-center">
                    <div
                      className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: c.color }}
                    >
                      {pct}%
                    </div>
                    <span className="text-[10px] text-[#8BA4C7]">{c.count}家</span>
                  </div>
                )
              })}
            </div>
          </div>
        </ChartCard>

        {/* Top 10 Suppliers Table */}
        <ChartCard title="Top 10 供应商" className="lg:col-span-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#D8E2F0]">
                  <th className="pb-2 pr-2 font-medium text-[#8BA4C7]">排名</th>
                  <th className="pb-2 pr-2 font-medium text-[#8BA4C7]">供应商名称</th>
                  <th className="pb-2 pr-2 font-medium text-[#8BA4C7]">类别</th>
                  <th className="pb-2 pr-2 font-medium text-[#8BA4C7]">风险等级</th>
                  <th className="pb-2 pr-2 text-right font-medium text-[#8BA4C7]">
                    <div className="flex items-center justify-end gap-1">
                      <Users size={12} /> 合作次数
                    </div>
                  </th>
                  <th className="pb-2 pr-2 text-right font-medium text-[#8BA4C7]">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign size={12} /> 涉及金额
                    </div>
                  </th>
                  <th className="pb-2 text-right font-medium text-[#8BA4C7]">
                    <div className="flex items-center justify-end gap-1">
                      <Calendar size={12} /> 最后合作
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {topSuppliers.map((s) => (
                  <tr
                    key={s.rank}
                    className="border-b border-[#D8E2F0] transition-colors hover:bg-[#EDF2F9]/50"
                  >
                    <td className="py-2.5 pr-2 font-number text-[#0F2245]">
                      {s.rank}
                    </td>
                    <td className="py-2.5 pr-2 font-medium text-[#0F2245]">
                      {s.name}
                    </td>
                    <td className="py-2.5 pr-2 text-[#8BA4C7]">{s.category}</td>
                    <td className="py-2.5 pr-2">
                      <RiskLevelTag level={s.risk} />
                    </td>
                    <td className="py-2.5 pr-2 text-right font-number text-[#0F2245]">
                      {s.coopCount}
                    </td>
                    <td className="py-2.5 pr-2 text-right font-number text-[#0F2245]">
                      {formatCurrency(s.amount)}
                    </td>
                    <td className="py-2.5 text-right text-[#8BA4C7]">{s.lastDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
