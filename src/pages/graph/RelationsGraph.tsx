import { useState, useRef } from 'react'
import { X, User, Building2, Search, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'

interface GraphNode {
  id: string
  label: string
  type: 'person' | 'company'
  x: number
  y: number
  detail?: string
}

interface GraphEdge {
  source: string
  target: string
  label: string
}

const initialNodes: GraphNode[] = [
  // Person nodes
  { id: 'p1', label: '王建国', type: 'person', x: 200, y: 60, detail: '法定代表人' },
  { id: 'p2', label: '张志强', type: 'person', x: 400, y: 80, detail: '实际控制人' },
  { id: 'p3', label: '李文慧', type: 'person', x: 80, y: 120, detail: '高管' },
  { id: 'p4', label: '赵晓东', type: 'person', x: 520, y: 120, detail: '法定代表人' },
  { id: 'p5', label: '陈明辉', type: 'person', x: 340, y: 160, detail: '大股东' },
  // Company nodes
  { id: 'c1', label: '中化蓝天集团', type: 'company', x: 180, y: 220, detail: '化工·注册资本12.8亿' },
  { id: 'c2', label: '江苏中化装备', type: 'company', x: 420, y: 230, detail: '装备制造·注册资本5.2亿' },
  { id: 'c3', label: '中化现代农业', type: 'company', x: 80, y: 310, detail: '农业服务·注册资本8.6亿' },
  { id: 'c4', label: '上海中化物流', type: 'company', x: 300, y: 350, detail: '物流运输·注册资本3.2亿' },
  { id: 'c5', label: '中化石油销售', type: 'company', x: 520, y: 300, detail: '能源销售·注册资本15.6亿' },
  { id: 'c6', label: '北京中化工程', type: 'company', x: 180, y: 420, detail: '工程服务·注册资本4.5亿' },
]

const initialEdges: GraphEdge[] = [
  { source: 'p1', target: 'c1', label: '法定代表人' },
  { source: 'p1', target: 'c3', label: '高管' },
  { source: 'p2', target: 'c2', label: '实际控制人' },
  { source: 'p5', target: 'c2', label: '大股东' },
  { source: 'p4', target: 'c4', label: '法定代表人' },
  { source: 'p3', target: 'c3', label: '法定代表人' },
  { source: 'p4', target: 'c5', label: '高管' },
  { source: 'c1', target: 'c4', label: '控股' },
  { source: 'c1', target: 'c6', label: '参股' },
  { source: 'c3', target: 'c6', label: '合作项目' },
  { source: 'c2', target: 'c5', label: '供货关系' },
  { source: 'c1', target: 'c3', label: '关联交易' },
]

function DetailPanel({ node, onClose }: { node: GraphNode; onClose: () => void }) {
  return (
    <div className="rounded-lg border border-[#D8E2F0] bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {node.type === 'person' ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#38BDF8]/10">
              <User size={16} className="text-[#38BDF8]" />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F97316]/10">
              <Building2 size={16} className="text-[#F97316]" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-[#0F2245]">{node.label}</p>
            <p className="text-xs text-[#8BA4C7]">
              {node.type === 'person' ? '人员节点' : '企业节点'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-[#8BA4C7] hover:bg-[#EDF2F9] hover:text-[#0F2245]"
        >
          <X size={14} />
        </button>
      </div>

      <div className="mt-3 space-y-2 border-t border-[#D8E2F0] pt-3">
        {node.detail && (
          <div className="text-xs text-[#8BA4C7]">
            <span className="font-medium text-[#0F2245]">详情：</span>
            {node.detail}
          </div>
        )}
        <div className="text-xs text-[#8BA4C7]">
          <span className="font-medium text-[#0F2245]">关联关系数：</span>
          {initialEdges.filter((e) => e.source === node.id || e.target === node.id).length}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {initialEdges
            .filter((e) => e.source === node.id || e.target === node.id)
            .map((e, i) => {
              const other = initialNodes.find((n) => n.id === (e.source === node.id ? e.target : e.source))
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-[#EDF2F9] px-2 py-0.5 text-[10px] text-[#8BA4C7]"
                >
                  {other?.label}
                  <span className="text-[#38BDF8]">({e.label})</span>
                </span>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export function RelationsGraph() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  const handleMouseUp = () => {
    setDragging(false)
  }

  const zoomIn = () => setScale((s) => Math.min(s + 0.1, 2.5))
  const zoomOut = () => setScale((s) => Math.max(s - 0.1, 0.4))
  const resetView = () => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="人企图谱"
        description="人员与企业关联关系可视化分析"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Main SVG Canvas */}
        <div className="relative overflow-hidden rounded-lg bg-white shadow-card lg:col-span-3">
          {/* Toolbar */}
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-lg border border-[#D8E2F0] bg-white/90 px-2 py-1.5 shadow-sm backdrop-blur">
            <button
              onClick={zoomIn}
              className="rounded p-1 text-[#8BA4C7] hover:bg-[#EDF2F9] hover:text-[#0F2245]"
              title="放大"
            >
              <ZoomIn size={14} />
            </button>
            <span className="text-xs text-[#8BA4C7]">{Math.round(scale * 100)}%</span>
            <button
              onClick={zoomOut}
              className="rounded p-1 text-[#8BA4C7] hover:bg-[#EDF2F9] hover:text-[#0F2245]"
              title="缩小"
            >
              <ZoomOut size={14} />
            </button>
            <div className="mx-1 h-4 w-px bg-[#D8E2F0]" />
            <button
              onClick={resetView}
              className="rounded p-1 text-[#8BA4C7] hover:bg-[#EDF2F9] hover:text-[#0F2245]"
              title="重置视图"
            >
              <RotateCw size={14} />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute right-3 top-3 z-10 rounded-lg border border-[#D8E2F0] bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#38BDF8]" />
                人员
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#F97316]" />
                企业
              </span>
            </div>
          </div>

          <svg
            ref={svgRef}
            viewBox="0 0 680 520"
            className="w-full cursor-grab active:cursor-grabbing"
            style={{ minHeight: 500 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <g
              transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}
            >
              {/* Background grid */}
              <defs>
                <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#EDF2F9" strokeWidth="0.5" />
                </pattern>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <rect width="100" height="100" fill="url(#smallGrid)" />
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#D8E2F0" strokeWidth="1" />
                </pattern>
                {/* Arrow marker */}
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#8BA4C7" />
                </marker>
              </defs>
              <rect width="680" height="520" fill="url(#grid)" />

              {/* Edges */}
              {initialEdges.map((edge, i) => {
                const source = initialNodes.find((n) => n.id === edge.source)
                const target = initialNodes.find((n) => n.id === edge.target)
                if (!source || !target) return null

                const dx = target.x - source.x
                const dy = target.y - source.y
                const angle = Math.atan2(dy, dx)

                // Adjust end points to edge of node circles
                const sourceRadius = source.type === 'person' ? 20 : 24
                const targetRadius = target.type === 'person' ? 20 : 24

                const sx = source.x + Math.cos(angle) * sourceRadius
                const sy = source.y + Math.sin(angle) * sourceRadius
                const tx = target.x - Math.cos(angle) * targetRadius
                const ty = target.y - Math.sin(angle) * targetRadius

                // Midpoint for label
                const midX = (sx + tx) / 2
                const midY = (sy + ty) / 2

                return (
                  <g key={i}>
                    <line
                      x1={sx}
                      y1={sy}
                      x2={tx}
                      y2={ty}
                      stroke="#8BA4C7"
                      strokeWidth="1.5"
                      strokeDasharray={edge.label === '关联交易' || edge.label === '合作项目' ? '5,3' : 'none'}
                      markerEnd="url(#arrowhead)"
                      className="transition-opacity hover:opacity-80"
                    />
                    {/* Edge label background */}
                    <rect
                      x={midX - 28}
                      y={midY - 8}
                      width={56}
                      height="16"
                      rx="3"
                      fill="white"
                      stroke="#D8E2F0"
                      strokeWidth="0.5"
                    />
                    <text
                      x={midX}
                      y={midY + 3}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#8BA4C7"
                      className="select-none"
                    >
                      {edge.label}
                    </text>
                  </g>
                )
              })}

              {/* Nodes */}
              {initialNodes.map((node) => {
                const isPerson = node.type === 'person'
                const radius = isPerson ? 20 : 24
                const isSelected = selectedNode?.id === node.id

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer transition-opacity hover:opacity-90"
                  >
                    {/* Glow for selected */}
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={radius + 6}
                        fill="none"
                        stroke={isPerson ? '#38BDF8' : '#F97316'}
                        strokeWidth="2"
                        opacity="0.5"
                      >
                        <animate
                          attributeName="r"
                          from={radius + 4}
                          to={radius + 9}
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.5"
                          to="0"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {isPerson ? (
                      <>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={radius}
                          fill="#38BDF8"
                          fillOpacity="0.15"
                          stroke="#38BDF8"
                          strokeWidth="2"
                        />
                        <User
                          x={node.x - 10}
                          y={node.y - 10}
                          width={20}
                          height={20}
                          color="#38BDF8"
                        />
                      </>
                    ) : (
                      <>
                        <rect
                          x={node.x - radius}
                          y={node.y - radius}
                          width={radius * 2}
                          height={radius * 2}
                          rx="6"
                          fill="#F97316"
                          fillOpacity="0.15"
                          stroke="#F97316"
                          strokeWidth="2"
                        />
                        <Building2
                          x={node.x - 10}
                          y={node.y - 10}
                          width={20}
                          height={20}
                          color="#F97316"
                        />
                      </>
                    )}

                    {/* Node label */}
                    <text
                      x={node.x}
                      y={node.y + radius + 14}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="600"
                      fill="#0F2245"
                      className="select-none"
                    >
                      {node.label}
                    </text>
                  </g>
                )
              })}
            </g>
          </svg>
        </div>

        {/* Detail Panel Sidebar */}
        <div className="space-y-3 lg:col-span-1">
          {selectedNode ? (
            <DetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
          ) : (
            <div className="rounded-lg bg-white p-5 shadow-card">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Search size={32} className="text-[#D8E2F0]" />
                <p className="mt-3 text-sm font-medium text-[#0F2245]">点击节点查看详情</p>
                <p className="mt-1 text-xs text-[#8BA4C7]">
                  点击图谱中的人员或企业节点，查看关联关系详情
                </p>
              </div>
            </div>
          )}

          {/* Stats Summary */}
          <div className="rounded-lg bg-white p-4 shadow-card">
            <h4 className="mb-2 text-xs font-semibold text-[#0F2245]">图谱概览</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md bg-[#EDF2F9]/50 px-2 py-1.5">
                <span className="text-[#8BA4C7]">人员节点</span>
                <p className="font-number font-bold text-[#38BDF8]">
                  {initialNodes.filter((n) => n.type === 'person').length}
                </p>
              </div>
              <div className="rounded-md bg-[#EDF2F9]/50 px-2 py-1.5">
                <span className="text-[#8BA4C7]">企业节点</span>
                <p className="font-number font-bold text-[#F97316]">
                  {initialNodes.filter((n) => n.type === 'company').length}
                </p>
              </div>
              <div className="rounded-md bg-[#EDF2F9]/50 px-2 py-1.5">
                <span className="text-[#8BA4C7]">关联关系</span>
                <p className="font-number font-bold text-[#0F2245]">{initialEdges.length}</p>
              </div>
              <div className="rounded-md bg-[#EDF2F9]/50 px-2 py-1.5">
                <span className="text-[#8BA4C7]">操作提示</span>
                <p className="text-[#8BA4C7]">拖拽平移</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
