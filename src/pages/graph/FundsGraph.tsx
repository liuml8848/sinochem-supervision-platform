import { useState } from 'react'
import {
  X,
  DollarSign,
  Building2,
  ArrowRight,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCw,
  TrendingUp,
  PieChart,
} from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { formatCurrency } from '@/lib/utils'

interface FundEntity {
  id: string
  label: string
  type: 'source' | 'intermediary' | 'target'
  x: number
  y: number
  amount: number
  detail: string
  color: string
}

interface FundFlow {
  source: string
  target: string
  amount: number
  label: string
  risk: 'normal' | 'suspicious' | 'high'
}

const entities: FundEntity[] = [
  // Sources (left)
  { id: 'src1', label: '集团财务公司', type: 'source', x: 80, y: 80, amount: 650000000, detail: '资金归集中心', color: '#38BDF8' },
  { id: 'src2', label: '外部银行贷款', type: 'source', x: 80, y: 220, amount: 320000000, detail: '商业银行贷款', color: '#38BDF8' },
  { id: 'src3', label: '政府补贴资金', type: 'source', x: 80, y: 360, amount: 85000000, detail: '专项扶持资金', color: '#38BDF8' },
  // Intermediaries (middle)
  { id: 'mid1', label: '中化蓝天集团', type: 'intermediary', x: 280, y: 120, amount: 420000000, detail: '化工板块主体', color: '#F97316' },
  { id: 'mid2', label: '中化石油销售', type: 'intermediary', x: 280, y: 280, amount: 380000000, detail: '能源板块主体', color: '#F97316' },
  { id: 'mid3', label: '中化现代农业', type: 'intermediary', x: 280, y: 440, amount: 180000000, detail: '农业板块主体', color: '#F97316' },
  // Targets (right)
  { id: 'tgt1', label: '供应商付款', type: 'target', x: 500, y: 70, amount: 520000000, detail: '采购货款支付', color: '#2DD4BF' },
  { id: 'tgt2', label: '项目投资', type: 'target', x: 500, y: 200, amount: 280000000, detail: '在建工程投入', color: '#2DD4BF' },
  { id: 'tgt3', label: '关联公司', type: 'target', x: 500, y: 330, amount: 150000000, detail: '关联交易流出', color: '#EF4444' },
  { id: 'tgt4', label: '利息税费', type: 'target', x: 500, y: 460, amount: 95000000, detail: '财务费用支出', color: '#2DD4BF' },
]

const flows: FundFlow[] = [
  { source: 'src1', target: 'mid1', amount: 280000000, label: '内部调拨', risk: 'normal' },
  { source: 'src1', target: 'mid2', amount: 220000000, label: '内部调拨', risk: 'normal' },
  { source: 'src2', target: 'mid2', amount: 180000000, label: '项目贷款', risk: 'normal' },
  { source: 'src3', target: 'mid3', amount: 85000000, label: '专项拨付', risk: 'normal' },
  { source: 'src2', target: 'mid1', amount: 140000000, label: '流动资金', risk: 'suspicious' },
  { source: 'mid1', target: 'tgt1', amount: 280000000, label: '采购付款', risk: 'normal' },
  { source: 'mid1', target: 'tgt2', amount: 150000000, label: '技改投资', risk: 'normal' },
  { source: 'mid1', target: 'tgt3', amount: 120000000, label: '关联往来', risk: 'high' },
  { source: 'mid2', target: 'tgt1', amount: 180000000, label: '采购付款', risk: 'normal' },
  { source: 'mid2', target: 'tgt4', amount: 65000000, label: '税费支出', risk: 'normal' },
  { source: 'mid2', target: 'tgt3', amount: 30000000, label: '关联往来', risk: 'suspicious' },
  { source: 'mid3', target: 'tgt1', amount: 60000000, label: '采购付款', risk: 'normal' },
  { source: 'mid3', target: 'tgt2', amount: 80000000, label: '农业投资', risk: 'normal' },
  { source: 'src1', target: 'tgt3', amount: 90000000, label: '直接划转', risk: 'high' },
]

const riskColors = {
  normal: { stroke: '#8BA4C7', label: '' },
  suspicious: { stroke: '#F59E0B', label: '可疑' },
  high: { stroke: '#EF4444', label: '关注' },
}

export function FundsGraph() {
  const [selectedFlow, setSelectedFlow] = useState<FundFlow | null>(null)
  const [selectedEntity, setSelectedEntity] = useState<FundEntity | null>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showAllLabels, setShowAllLabels] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }
  const handleMouseUp = () => setDragging(false)

  const flowAmounts = flows.map((f) => f.amount)
  const maxAmount = Math.max(...flowAmounts)
  const minAmount = Math.min(...flowAmounts)

  const getFlowWidth = (amount: number) => {
    const normalized = (amount - minAmount) / (maxAmount - minAmount)
    return 1.5 + normalized * 5
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="资金图谱"
        description="资金流向追踪与异常识别"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-lg bg-white shadow-card lg:col-span-3">
          {/* Toolbar */}
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-lg border border-[#D8E2F0] bg-white/90 px-2 py-1.5 shadow-sm backdrop-blur">
            <button
              onClick={() => setScale((s) => Math.min(s + 0.1, 2.5))}
              className="rounded p-1 text-[#8BA4C7] hover:bg-[#EDF2F9] hover:text-[#0F2245]"
            >
              <ZoomIn size={14} />
            </button>
            <span className="text-xs text-[#8BA4C7]">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale((s) => Math.max(s - 0.1, 0.4))}
              className="rounded p-1 text-[#8BA4C7] hover:bg-[#EDF2F9] hover:text-[#0F2245]"
            >
              <ZoomOut size={14} />
            </button>
            <div className="mx-1 h-4 w-px bg-[#D8E2F0]" />
            <button
              onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }) }}
              className="rounded p-1 text-[#8BA4C7] hover:bg-[#EDF2F9] hover:text-[#0F2245]"
            >
              <RotateCw size={14} />
            </button>
            <div className="mx-1 h-4 w-px bg-[#D8E2F0]" />
            <button
              onClick={() => setShowAllLabels(!showAllLabels)}
              className={`rounded px-2 py-0.5 text-xs font-medium ${showAllLabels ? 'bg-[#0B1D4A] text-white' : 'text-[#8BA4C7]'}`}
            >
              标签
            </button>
          </div>

          {/* Legend */}
          <div className="absolute right-3 top-3 z-10 rounded-lg border border-[#D8E2F0] bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-1 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#38BDF8]" />
                资金来源
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#F97316]" />
                资金中转
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#2DD4BF]" />
                资金去向
              </span>
              <span className="flex items-center gap-1.5 mt-1 pt-1 border-t border-[#D8E2F0]">
                <span className="inline-block h-1.5 w-4 rounded-sm bg-[#EF4444]" />
                异常资金
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-4 rounded-sm bg-[#F59E0B]" />
                可疑资金
              </span>
            </div>
          </div>

          <svg
            viewBox="0 0 600 520"
            className="w-full cursor-grab active:cursor-grabbing"
            style={{ minHeight: 500 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
              <defs>
                <pattern id="fgGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#EDF2F9" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="600" height="520" fill="url(#fgGrid)" />

              {/* Column labels */}
              <text x="80" y="30" textAnchor="middle" fontSize="10" fill="#8BA4C7" fontWeight="600">资金来源</text>
              <text x="280" y="30" textAnchor="middle" fontSize="10" fill="#8BA4C7" fontWeight="600">资金中转</text>
              <text x="500" y="30" textAnchor="middle" fontSize="10" fill="#8BA4C7" fontWeight="600">资金去向</text>

              {/* Flow arrows (drawn first so they're behind nodes) */}
              {flows.map((flow, i) => {
                const src = entities.find((e) => e.id === flow.source)
                const tgt = entities.find((e) => e.id === flow.target)
                if (!src || !tgt) return null

                const isSelected = selectedFlow === flow
                const width = getFlowWidth(flow.amount)
                const risk = riskColors[flow.risk]
                const strokeColor = isSelected ? risk.stroke : risk.stroke
                const opacity = isSelected ? 1 : flow.risk === 'high' ? 0.85 : 0.55

                // Draw curved path for visual interest
                const midX = (src.x + tgt.x) / 2
                const midY = (src.y + tgt.y) / 2
                const curve = (tgt.y - src.y) * 0.15

                // Multiple parallel lines for thickness effect
                const numLines = Math.ceil(width)
                return (
                  <g key={i} onClick={() => { setSelectedFlow(flow); setSelectedEntity(null) }} className="cursor-pointer">
                    {Array.from({ length: numLines }).map((_, li) => {
                      const offsetY = (li - (numLines - 1) / 2) * 1.5
                      return (
                        <path
                          key={li}
                          d={`M ${src.x + 20} ${src.y + offsetY} Q ${midX} ${midY + offsetY + curve}, ${tgt.x - 20} ${tgt.y + offsetY}`}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="1.2"
                          opacity={opacity}
                          strokeDasharray={flow.risk === 'high' ? '6,3' : flow.risk === 'suspicious' ? '4,3' : 'none'}
                        />
                      )
                    })}

                    {/* Arrow head */}
                    <polygon
                      points={`${tgt.x - 18},${tgt.y - 4} ${tgt.x - 10},${tgt.y} ${tgt.x - 18},${tgt.y + 4}`}
                      fill={strokeColor}
                      opacity={opacity}
                    />

                    {/* Amount label */}
                    {(showAllLabels || isSelected) && (
                      <g>
                        <rect
                          x={midX - 32}
                          y={midY + curve - 8}
                          width={64}
                          height={16}
                          rx="3"
                          fill="white"
                          stroke={risk.stroke}
                          strokeWidth="0.5"
                        />
                        <text
                          x={midX}
                          y={midY + curve + 3}
                          textAnchor="middle"
                          fontSize="8"
                          fill={risk.stroke}
                          fontWeight={flow.risk !== 'normal' ? '600' : '400'}
                        >
                          {formatCurrency(flow.amount)}
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}

              {/* Entities */}
              {entities.map((entity) => {
                const isSelected = selectedEntity?.id === entity.id

                return (
                  <g
                    key={entity.id}
                    onClick={() => { setSelectedEntity(entity); setSelectedFlow(null) }}
                    className="cursor-pointer"
                  >
                    {/* Selection pulse */}
                    {isSelected && (
                      <rect
                        x={entity.x - 55}
                        y={entity.y - 18}
                        width={110}
                        height={36}
                        rx="8"
                        fill="none"
                        stroke={entity.color}
                        strokeWidth="2"
                        opacity="0.4"
                      />
                    )}

                    {/* Entity box */}
                    <rect
                      x={entity.x - 50}
                      y={entity.y - 14}
                      width={100}
                      height={28}
                      rx="6"
                      fill={entity.color}
                      fillOpacity="0.1"
                      stroke={isSelected ? entity.color : entity.color}
                      strokeWidth={isSelected ? 2 : 1.5}
                      strokeOpacity={isSelected ? 1 : 0.6}
                    />

                    {/* Icon */}
                    {entity.type === 'source' && (
                      <DollarSign x={entity.x - 36} y={entity.y - 8} width={16} height={16} color={entity.color} />
                    )}
                    {entity.type === 'intermediary' && (
                      <Building2 x={entity.x - 36} y={entity.y - 8} width={16} height={16} color={entity.color} />
                    )}
                    {entity.type === 'target' && (
                      <TrendingUp x={entity.x - 36} y={entity.y - 8} width={16} height={16} color={entity.color} />
                    )}

                    {/* Label */}
                    <text
                      x={entity.x - 14}
                      y={entity.y + 3}
                      fontSize="9"
                      fontWeight="600"
                      fill="#0F2245"
                    >
                      {entity.label}
                    </text>
                  </g>
                )
              })}
            </g>
          </svg>
        </div>

        {/* Detail Panel */}
        <div className="space-y-3 lg:col-span-1">
          {selectedEntity && (
            <div className="rounded-lg bg-white p-4 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: selectedEntity.color + '15' }}
                  >
                    {selectedEntity.type === 'source' ? (
                      <DollarSign size={16} style={{ color: selectedEntity.color }} />
                    ) : selectedEntity.type === 'intermediary' ? (
                      <Building2 size={16} style={{ color: selectedEntity.color }} />
                    ) : (
                      <TrendingUp size={16} style={{ color: selectedEntity.color }} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F2245]">{selectedEntity.label}</p>
                    <p className="text-xs text-[#8BA4C7]">
                      {selectedEntity.type === 'source' ? '资金来源' : selectedEntity.type === 'intermediary' ? '资金中转' : '资金去向'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedEntity(null)} className="rounded p-1 text-[#8BA4C7] hover:bg-[#EDF2F9]">
                  <X size={14} />
                </button>
              </div>
              <div className="mt-3 space-y-2 border-t border-[#D8E2F0] pt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8BA4C7]">涉及金额</span>
                  <span className="font-number font-bold text-[#0F2245]">{formatCurrency(selectedEntity.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8BA4C7]">说明</span>
                  <span className="text-[#0F2245]">{selectedEntity.detail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8BA4C7]">关联交易笔数</span>
                  <span className="font-number font-bold text-[#0F2245]">
                    {flows.filter((f) => f.source === selectedEntity.id || f.target === selectedEntity.id).length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {selectedFlow && (
            <div className="rounded-lg bg-white p-4 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0F2245]">资金流详情</span>
                <button onClick={() => setSelectedFlow(null)} className="rounded p-1 text-[#8BA4C7] hover:bg-[#EDF2F9]">
                  <X size={14} />
                </button>
              </div>
              <div className="mt-2 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 py-1.5">
                  <span className="text-[#0F2245] font-medium">
                    {entities.find((e) => e.id === selectedFlow.source)?.label}
                  </span>
                  <ArrowRight size={12} className="text-[#8BA4C7]" />
                  <span className="text-[#0F2245] font-medium">
                    {entities.find((e) => e.id === selectedFlow.target)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8BA4C7]">金额</span>
                  <span className="font-number font-bold text-[#0F2245]">{formatCurrency(selectedFlow.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8BA4C7]">类型</span>
                  <span className="text-[#0F2245]">{selectedFlow.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8BA4C7]">风险评估</span>
                  <span className={`font-medium ${selectedFlow.risk === 'high' ? 'text-[#EF4444]' : selectedFlow.risk === 'suspicious' ? 'text-[#F59E0B]' : 'text-[#2DD4BF]'}`}>
                    {selectedFlow.risk === 'high' ? '异常' : selectedFlow.risk === 'suspicious' ? '可疑' : '正常'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!selectedEntity && !selectedFlow && (
            <div className="rounded-lg bg-white p-5 shadow-card">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <PieChart size={32} className="text-[#D8E2F0]" />
                <p className="mt-3 text-sm font-medium text-[#0F2245]">点击查看资金详情</p>
                <p className="mt-1 text-xs text-[#8BA4C7]">点击任意节点或资金流查看详细信息</p>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="rounded-lg bg-white p-4 shadow-card">
            <h4 className="mb-2 text-xs font-semibold text-[#0F2245]">资金总览</h4>
            <div className="space-y-2 text-xs">
              <div className="rounded-md bg-[#EDF2F9]/50 px-2 py-1.5">
                <span className="text-[#8BA4C7]">资金总流入</span>
                <p className="font-number font-bold text-[#0F2245]">
                  {formatCurrency(entities.filter((e) => e.type === 'source').reduce((sum, e) => sum + e.amount, 0))}
                </p>
              </div>
              <div className="rounded-md bg-[#EDF2F9]/50 px-2 py-1.5">
                <span className="text-[#8BA4C7]">资金总流出</span>
                <p className="font-number font-bold text-[#0F2245]">
                  {formatCurrency(entities.filter((e) => e.type === 'target').reduce((sum, e) => sum + e.amount, 0))}
                </p>
              </div>
              <div className="rounded-md bg-[#EDF2F9]/50 px-2 py-1.5">
                <span className="text-[#8BA4C7]">异常交易</span>
                <p className="font-number font-bold text-[#EF4444]">
                  {flows.filter((f) => f.risk === 'high').length} 笔
                </p>
              </div>
              <div className="rounded-md bg-[#EDF2F9]/50 px-2 py-1.5">
                <span className="text-[#8BA4C7]">可疑交易</span>
                <p className="font-number font-bold text-[#F59E0B]">
                  {flows.filter((f) => f.risk === 'suspicious').length} 笔
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
