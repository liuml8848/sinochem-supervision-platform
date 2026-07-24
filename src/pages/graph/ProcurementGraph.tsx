import { useState } from 'react'
import {
  X,
  FolderOpen,
  Building2,
  Users,
  DollarSign,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { formatCurrency } from '@/lib/utils'

interface PGNode {
  id: string
  label: string
  type: 'project' | 'supplier' | 'bidder'
  x: number
  y: number
  detail: string
  amount: number
  status?: 'ongoing' | 'completed' | 'pending'
}

interface PGEdge {
  source: string
  target: string
  label: string
  amount: number
  year: number
}

const nodes: PGNode[] = [
  // Projects (left column)
  { id: 'pr1', label: '智慧化工园区', type: 'project', x: 120, y: 80, detail: '信息化建设工程', amount: 58000000, status: 'ongoing' },
  { id: 'pr2', label: '仓储物流中心', type: 'project', x: 120, y: 200, detail: '基建工程项目', amount: 32000000, status: 'ongoing' },
  { id: 'pr3', label: '环保技改项目', type: 'project', x: 120, y: 320, detail: '技术改造工程', amount: 18500000, status: 'completed' },
  { id: 'pr4', label: '供应链数字化', type: 'project', x: 120, y: 440, detail: '信息化服务项目', amount: 12600000, status: 'pending' },

  // Suppliers (middle column)
  { id: 's1', label: '中化蓝天集团', type: 'supplier', x: 340, y: 100, detail: '化工原料供应商', amount: 156000000 },
  { id: 's2', label: '江苏中化装备', type: 'supplier', x: 340, y: 220, detail: '装备制造供应商', amount: 98500000 },
  { id: 's3', label: '北京中化工程', type: 'supplier', x: 340, y: 340, detail: '工程技术供应商', amount: 72400000 },
  { id: 's4', label: '深圳中化信息', type: 'supplier', x: 340, y: 460, detail: '信息技术供应商', amount: 38600000 },

  // Bidders (right column)
  { id: 'b1', label: '东方建设集团', type: 'bidder', x: 560, y: 80, detail: '建筑工程企业', amount: 0 },
  { id: 'b2', label: '华信科技公司', type: 'bidder', x: 560, y: 200, detail: '信息技术企业', amount: 0 },
  { id: 'b3', label: '中建八局', type: 'bidder', x: 560, y: 320, detail: '大型建筑央企', amount: 0 },
  { id: 'b4', label: '华东设计院', type: 'bidder', x: 560, y: 440, detail: '工程设计机构', amount: 0 },
]

const edges: PGEdge[] = [
  { source: 'pr1', target: 's1', label: '中标供应', amount: 28000000, year: 2026 },
  { source: 'pr1', target: 's4', label: '中标供应', amount: 8600000, year: 2026 },
  { source: 'pr2', target: 's2', label: '中标供应', amount: 18500000, year: 2026 },
  { source: 'pr2', target: 's3', label: '中标供应', amount: 9200000, year: 2025 },
  { source: 'pr3', target: 's2', label: '中标供应', amount: 7200000, year: 2025 },
  { source: 'pr3', target: 's1', label: '中标供应', amount: 5600000, year: 2025 },
  { source: 'pr4', target: 's4', label: '中标供应', amount: 12600000, year: 2026 },
  { source: 'pr4', target: 's3', label: '中标供应', amount: 3800000, year: 2026 },
  { source: 's1', target: 'b1', label: '分包合作', amount: 12000000, year: 2026 },
  { source: 's2', target: 'b3', label: '分包合作', amount: 8500000, year: 2026 },
  { source: 's3', target: 'b4', label: '设计分包', amount: 3200000, year: 2025 },
  { source: 's4', target: 'b2', label: '技术合作', amount: 4500000, year: 2026 },
]

const typeColors: Record<string, { bg: string; text: string; border: string; icon: any }> = {
  project: { bg: '#38BDF8', text: '#0F2245', border: '#38BDF8', icon: FolderOpen },
  supplier: { bg: '#F97316', text: '#0F2245', border: '#F97316', icon: Building2 },
  bidder: { bg: '#2DD4BF', text: '#0F2245', border: '#2DD4BF', icon: Users },
}

function NodeIcon({ type }: { type: string }) {
  const Icon = typeColors[type]?.icon || Building2
  return <Icon size={16} />
}

export function ProcurementGraph() {
  const [selectedNode, setSelectedNode] = useState<PGNode | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<PGEdge | null>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }
  const handleMouseUp = () => setDragging(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="项目图谱"
        description="项目-供应商-投标方关系网络分析"
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
          </div>

          {/* Legend */}
          <div className="absolute right-3 top-3 z-10 rounded-lg border border-[#D8E2F0] bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-1 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#38BDF8]" />
                项目
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#F97316]" />
                供应商
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#2DD4BF]" />
                投标方
              </span>
            </div>
          </div>

          <svg
            viewBox="0 0 680 520"
            className="w-full cursor-grab active:cursor-grabbing"
            style={{ minHeight: 500 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
              <defs>
                <pattern id="pgGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#EDF2F9" strokeWidth="0.5" />
                </pattern>
                <marker id="arrowPG" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#8BA4C7" />
                </marker>
              </defs>
              <rect width="680" height="520" fill="url(#pgGrid)" />

              {/* Column labels */}
              <text x="120" y="30" textAnchor="middle" fontSize="10" fill="#8BA4C7" fontWeight="600">项目</text>
              <text x="340" y="30" textAnchor="middle" fontSize="10" fill="#8BA4C7" fontWeight="600">供应商</text>
              <text x="560" y="30" textAnchor="middle" fontSize="10" fill="#8BA4C7" fontWeight="600">投标方</text>

              {/* Edges */}
              {edges.map((edge, i) => {
                const source = nodes.find((n) => n.id === edge.source)
                const target = nodes.find((n) => n.id === edge.target)
                if (!source || !target) return null

                const isSelected = selectedEdge === edge
                const strokeW = Math.max(1.5, Math.min(edge.amount / 5000000, 4))

                return (
                  <g
                    key={i}
                    onClick={() => setSelectedEdge(edge)}
                    className="cursor-pointer"
                  >
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isSelected ? '#38BDF8' : '#8BA4C7'}
                      strokeWidth={isSelected ? strokeW + 1 : strokeW}
                      strokeOpacity={isSelected ? 1 : 0.6}
                      markerEnd="url(#arrowPG)"
                    />
                    <rect
                      x={(source.x + target.x) / 2 - 30}
                      y={(source.y + target.y) / 2 - 8}
                      width={60}
                      height={16}
                      rx="3"
                      fill="white"
                      stroke="#D8E2F0"
                      strokeWidth="0.5"
                    />
                    <text
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2 + 3}
                      textAnchor="middle"
                      fontSize="8"
                      fill="#8BA4C7"
                    >
                      {edge.label} ({edge.year})
                    </text>
                  </g>
                )
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const colors = typeColors[node.type]
                const isSelected = selectedNode?.id === node.id
                const isPerson = node.type === 'project'

                return (
                  <g
                    key={node.id}
                    onClick={() => { setSelectedNode(node); setSelectedEdge(null) }}
                    className="cursor-pointer"
                  >
                    {/* Selection glow */}
                    {isSelected && (
                      <rect
                        x={node.x - 40}
                        y={node.y - 22}
                        width={80}
                        height={44}
                        rx="10"
                        fill="none"
                        stroke={colors.border}
                        strokeWidth="2"
                        opacity="0.5"
                      />
                    )}

                    {/* Node rect */}
                    <rect
                      x={node.x - 36}
                      y={node.y - 18}
                      width={72}
                      height={36}
                      rx="8"
                      fill={colors.bg}
                      fillOpacity="0.12"
                      stroke={isSelected ? colors.border : colors.bg}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />

                    {/* Icon */}
                    <foreignObject x={node.x - 28} y={node.y - 11} width="18" height="22">
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          color: colors.bg,
                        }}
                      >
                        {node.type === 'project' ? (
                          <FolderOpen size={14} />
                        ) : node.type === 'supplier' ? (
                          <Building2 size={14} />
                        ) : (
                          <Users size={14} />
                        )}
                      </div>
                    </foreignObject>

                    {/* Label */}
                    <text
                      x={node.x + 4}
                      y={node.y + 4}
                      textAnchor="start"
                      fontSize="9"
                      fontWeight="600"
                      fill="#0F2245"
                    >
                      {node.label}
                    </text>

                    {/* Amount */}
                    <text
                      x={node.x}
                      y={node.y + 28}
                      textAnchor="middle"
                      fontSize="8"
                      fill="#8BA4C7"
                    >
                      {formatCurrency(node.amount)}
                    </text>
                  </g>
                )
              })}
            </g>
          </svg>
        </div>

        {/* Detail Panel */}
        <div className="space-y-3 lg:col-span-1">
          {selectedNode && (
            <div className="rounded-lg bg-white p-4 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: typeColors[selectedNode.type].bg + '15' }}
                  >
                    <NodeIcon type={selectedNode.type} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F2245]">{selectedNode.label}</p>
                    <p className="text-xs text-[#8BA4C7]">{selectedNode.detail}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="rounded p-1 text-[#8BA4C7] hover:bg-[#EDF2F9]"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="mt-3 space-y-2 border-t border-[#D8E2F0] pt-3">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8BA4C7]">涉及金额</span>
                  <span className="font-number font-bold text-[#0F2245]">{formatCurrency(selectedNode.amount)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#8BA4C7]">关联关系数</span>
                  <span className="font-number font-bold text-[#0F2245]">
                    {edges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id).length}
                  </span>
                </div>
                {selectedNode.status && (
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8BA4C7]">项目状态</span>
                    <span className={`font-medium ${
                      selectedNode.status === 'ongoing' ? 'text-[#38BDF8]' : selectedNode.status === 'completed' ? 'text-[#2DD4BF]' : 'text-[#F59E0B]'
                    }`}>
                      {selectedNode.status === 'ongoing' ? '进行中' : selectedNode.status === 'completed' ? '已完成' : '待启动'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedEdge && (
            <div className="rounded-lg bg-white p-4 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0F2245]">关系详情</span>
                <button
                  onClick={() => setSelectedEdge(null)}
                  className="rounded p-1 text-[#8BA4C7] hover:bg-[#EDF2F9]"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="mt-2 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#8BA4C7]">关系类型</span>
                  <span className="text-[#0F2245]">{selectedEdge.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8BA4C7]">涉及金额</span>
                  <span className="font-number font-bold text-[#0F2245]">{formatCurrency(selectedEdge.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8BA4C7]">年份</span>
                  <span className="text-[#0F2245]">{selectedEdge.year}</span>
                </div>
              </div>
            </div>
          )}

          {!selectedNode && !selectedEdge && (
            <div className="rounded-lg bg-white p-5 shadow-card">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Search size={32} className="text-[#D8E2F0]" />
                <p className="mt-3 text-sm font-medium text-[#0F2245]">点击节点或连线</p>
                <p className="mt-1 text-xs text-[#8BA4C7]">查看项目与供应商、投标方之间的关联详情</p>
              </div>
            </div>
          )}

          {/* Summary stats */}
          <div className="rounded-lg bg-white p-4 shadow-card">
            <h4 className="mb-2 text-xs font-semibold text-[#0F2245]">图谱统计</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md bg-[#EDF2F9]/50 px-2 py-1.5">
                <span className="text-[#8BA4C7]">项目</span>
                <p className="font-number font-bold text-[#38BDF8]">{nodes.filter((n) => n.type === 'project').length}</p>
              </div>
              <div className="rounded-md bg-[#EDF2F9]/50 px-2 py-1.5">
                <span className="text-[#8BA4C7]">供应商</span>
                <p className="font-number font-bold text-[#F97316]">{nodes.filter((n) => n.type === 'supplier').length}</p>
              </div>
              <div className="rounded-md bg-[#EDF2F9]/50 px-2 py-1.5">
                <span className="text-[#8BA4C7]">投标方</span>
                <p className="font-number font-bold text-[#2DD4BF]">{nodes.filter((n) => n.type === 'bidder').length}</p>
              </div>
              <div className="rounded-md bg-[#EDF2F9]/50 px-2 py-1.5">
                <span className="text-[#8BA4C7]">关联总数</span>
                <p className="font-number font-bold text-[#0F2245]">{edges.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
