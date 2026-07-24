import { useState, useRef, useCallback, useEffect } from 'react'
import { Search, RotateCcw, Eye, EyeOff, Tag, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Data types ─────────────────────────────────────────
interface Node {
  id: string; name: string; group: string; risk: number; x: number; y: number; z: number
}

const INITIAL_NODES: Node[] = [
  { id: 'p1', name: '张建国', group: 'person', risk: 3, x: 280, y: 120, z: 0 },
  { id: 'p2', name: '李明华', group: 'person', risk: 2, x: 550, y: 80, z: 100 },
  { id: 'p3', name: '王浩然', group: 'person', risk: 2, x: 380, y: 300, z: 50 },
  { id: 'p4', name: '陈志远', group: 'person', risk: 1, x: 650, y: 220, z: 150 },
  { id: 'p5', name: '赵明辉', group: 'person', risk: 3, x: 120, y: 310, z: 80 },
  { id: 'c1', name: '北京华泰科技有限公司', group: 'company', risk: 3, x: 380, y: 190, z: 30 },
  { id: 'c2', name: '上海恒通贸易有限公司', group: 'company', risk: 2, x: 500, y: 160, z: 120 },
  { id: 'c3', name: '广州远洋物流有限公司', group: 'company', risk: 1, x: 480, y: 320, z: 90 },
  { id: 'c4', name: '深圳鹏程建设有限公司', group: 'company', risk: 3, x: 200, y: 240, z: 60 },
  { id: 'c5', name: '南京金陵机械设备公司', group: 'company', risk: 1, x: 620, y: 340, z: 140 },
  { id: 'pr1', name: '化工原料集中采购项目', group: 'project', risk: 3, x: 320, y: 260, z: 40 },
  { id: 'pr2', name: 'IT设备招标采购项目', group: 'project', risk: 2, x: 580, y: 260, z: 110 },
  { id: 'pr3', name: '办公楼装修工程项目', group: 'project', risk: 1, x: 440, y: 120, z: 160 },
  { id: 'a1', name: '银行账户 ****6217', group: 'account', risk: 3, x: 300, y: 160, z: 70 },
  { id: 'a2', name: '银行账户 ****8329', group: 'account', risk: 2, x: 530, y: 300, z: 20 },
]

const RAW_LINKS = [
  { source: 'p1', target: 'c1', label: '法定代表人', style: 'solid' },
  { source: 'p1', target: 'c4', label: '实际控制人', style: 'solid' },
  { source: 'p1', target: 'pr1', label: '项目负责人', style: 'solid' },
  { source: 'p1', target: 'a1', label: '资金往来', style: 'dashed' },
  { source: 'p2', target: 'c1', label: '亲属关联', style: 'dashed' },
  { source: 'p2', target: 'c2', label: '大股东', style: 'solid' },
  { source: 'p2', target: 'pr1', label: '评标专家', style: 'solid' },
  { source: 'p3', target: 'c3', label: '高管任职', style: 'solid' },
  { source: 'p3', target: 'pr2', label: '投标负责人', style: 'solid' },
  { source: 'p4', target: 'c2', label: '董事', style: 'solid' },
  { source: 'p4', target: 'pr2', label: '项目经理', style: 'solid' },
  { source: 'p5', target: 'c4', label: '关联人员', style: 'dashed' },
  { source: 'c1', target: 'pr1', label: '中标方', style: 'solid' },
  { source: 'c2', target: 'pr2', label: '中标方', style: 'solid' },
  { source: 'c3', target: 'pr1', label: '投标参与', style: 'solid' },
  { source: 'c4', target: 'pr2', label: '投标参与', style: 'solid' },
  { source: 'c1', target: 'a1', label: '资金往来', style: 'dashed' },
  { source: 'c4', target: 'a1', label: '账户关联', style: 'dashed' },
  { source: 'pr1', target: 'a1', label: '项目付款', style: 'solid' },
  { source: 'c2', target: 'a2', label: '资金往来', style: 'dashed' },
  { source: 'pr2', target: 'a2', label: '项目收款', style: 'solid' },
  { source: 'p2', target: 'p4', label: '同事关系', style: 'dashed' },
]

// ── Visual config ─────────────────────────────────────
const GROUP: Record<string, { color: string; label: string; radius: number }> = {
  person:   { color: '#4A90D9', label: '人员', radius: 22 },
  company:  { color: '#F5A623', label: '企业', radius: 28 },
  project:  { color: '#50C878', label: '项目', radius: 26 },
  account:  { color: '#9B59B6', label: '账户', radius: 20 },
}

const RISK_RING: Record<number, string> = { 3: '#EF4444', 2: '#F97316', 1: '#38BDF8', 0: '#8BA4C7' }
const RISK_LABEL: Record<number, string> = { 3: '高', 2: '中', 1: '低', 0: '无' }

// ── Component ─────────────────────────────────────────
export function ThreeDimensionalGraph() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES)
  const [search, setSearch] = useState('')
  const [mode3D, setMode3D] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showLegend, setShowLegend] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [detailTab, setDetailTab] = useState<'basic' | 'relations' | 'risk'>('basic')
  const [hovered, setHovered] = useState<string | null>(null)

  // ── Drag state ──
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<{ nodeId: string; startX: number; startY: number; origX: number; origY: number } | null>(null)
  const didDrag = useRef(false)

  const selNode = nodes.find((n) => n.id === selected)
  const selLinks = selNode ? RAW_LINKS.filter((l) => l.source === selNode.id || l.target === selNode.id) : []

  const filtered = search ? nodes.filter((n) => n.name.includes(search)) : nodes
  const filteredIds = new Set(filtered.map((n) => n.id))

  const byId = useCallback((id: string) => nodes.find((n) => n.id === id), [nodes])

  const relatedIds = new Set<string>()
  if (selNode) {
    relatedIds.add(selNode.id)
    selLinks.forEach((l) => { relatedIds.add(l.source); relatedIds.add(l.target) })
  }

  // ── SVG coordinate conversion ──
  const svgCoords = useCallback((e: React.MouseEvent) => {
    const svg = svgRef.current; if (!svg) return null
    const pt = svg.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const ctm = svg.getScreenCTM(); if (!ctm) return null
    const svgPt = pt.matrixTransform(ctm.inverse())
    return { x: svgPt.x, y: svgPt.y }
  }, [])

  // ── Drag handlers ──
  const onMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    if (e.button !== 0) return
    e.stopPropagation()
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return
    const pt = svgCoords(e); if (!pt) return
    dragRef.current = { nodeId, startX: pt.x, startY: pt.y, origX: node.x, origY: node.y }
    didDrag.current = false
  }, [nodes, svgCoords])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current) return
    const pt = svgCoords(e); if (!pt) return
    const dx = pt.x - dragRef.current.startX
    const dy = pt.y - dragRef.current.startY
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) didDrag.current = true
    setNodes((prev) =>
      prev.map((n) =>
        n.id === dragRef.current!.nodeId
          ? { ...n, x: dragRef.current!.origX + dx, y: dragRef.current!.origY + dy }
          : n
      )
    )
  }, [svgCoords])

  const onMouseUp = useCallback(() => {
    dragRef.current = null
  }, [])

  // Global mouseup to catch releases outside SVG
  useEffect(() => {
    const up = () => { dragRef.current = null }
    window.addEventListener('mouseup', up)
    return () => window.removeEventListener('mouseup', up)
  }, [])

  // ── 3D projection helper ──
  const project = (x: number, _y: number, z: number) => {
    if (!mode3D) return { px: x, py: _y, s: 1 }
    const dz = (z - 80) / 200 // normalize to roughly [-0.4, 0.4]
    const scale = 0.75 + dz * 0.5
    return { px: x, py: _y - dz * 30, s: Math.max(0.6, Math.min(1.3, scale)) }
  }

  return (
    <div className="h-[calc(100vh-104px)] -m-6 flex flex-col bg-[#EDF2F9]">
      {/* ── Top search bar ── */}
      <div className="flex items-center gap-3 px-5 py-2.5 bg-white border-b border-[#D8E2F0] shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8BA4C7]" />
          <input
            placeholder="输入实体名称搜索..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setSelected(null) }}
            className="w-full rounded-md border border-[#D8E2F0] bg-white py-1.5 pl-9 pr-3 text-sm text-[#0F2245] placeholder:text-[#8BA4C7] focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
          />
        </div>
        <button className="rounded-md bg-[#1B3A6B] px-4 py-1.5 text-sm text-white hover:bg-[#0B1D4A] transition-colors">搜索</button>
        <button onClick={() => { setSearch(''); setSelected(null) }} className="rounded-md border border-[#D8E2F0] px-4 py-1.5 text-sm text-[#8BA4C7] hover:bg-[#F8FAFD] transition-colors">重置</button>
        <div className="ml-auto text-xs text-[#8BA4C7]">
          实体 {nodes.length} · 关系 {RAW_LINKS.length}
        </div>
      </div>

      {/* ── Main area ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canvas */}
        <div className="flex-1 relative" style={{ background: 'radial-gradient(ellipse at center, #1a2540 0%, #0c1524 100%)' }}>
          {/* Grid dots */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.08 }}>
            <defs>
              <pattern id="dots" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="25" cy="25" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>

          {/* Graph SVG */}
          <svg ref={svgRef} className="absolute inset-0 w-full h-full" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid meet"
            onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
          >
            <defs>
              {['#EF4444','#F97316','#38BDF8'].map((c) => (
                <radialGradient key={c} id={`g-${c.slice(1)}`}><stop offset="0%" stopColor={c} stopOpacity="0.35"/><stop offset="100%" stopColor={c} stopOpacity="0"/></radialGradient>
              ))}
              <filter id="node-glow"><feGaussianBlur stdDeviation="2.5"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>

            {/* Links */}
            {RAW_LINKS.map((l, i) => {
              const s = byId(l.source); const t = byId(l.target)
              if (!s || !t) return null
              const sp = project(s.x, s.y, s.z); const tp = project(t.x, t.y, t.z)
              const active = !selNode || relatedIds.has(l.source) && relatedIds.has(l.target)
              const isSel = selNode && (l.source === selNode.id || l.target === selNode.id)
              const midX = (sp.px + tp.px) / 2; const midY = (sp.py + tp.py) / 2
              return (
                <g key={i}>
                  <path
                    d={`M${sp.px},${sp.py} Q${midX},${midY - 15} ${tp.px},${tp.py}`}
                    fill="none"
                    stroke={l.style === 'dashed' ? '#F97316' : 'rgba(255,255,255,0.45)'}
                    strokeWidth={isSel ? 2.5 : 1.2}
                    strokeDasharray={l.style === 'dashed' ? '6 3' : 'none'}
                    opacity={active ? (isSel ? 1 : 0.65) : 0.12}
                    style={{ transition: 'opacity 0.3s' }}
                  />
                  {active && showLabels && (
                    <text x={midX} y={midY - 18} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="9">{l.label}</text>
                  )}
                </g>
              )
            })}

            {/* Nodes */}
            {nodes.map((n) => {
              const { px, py, s } = project(n.x, n.y, n.z)
              const cfg = GROUP[n.group]
              const r = cfg.radius * s
              const isSel = n.id === selected
              const isHov = n.id === hovered
              const active = !selNode || relatedIds.has(n.id)
              const inSearch = !search || filteredIds.has(n.id)
              const opacity = !active ? 0.2 : inSearch ? 1 : 0.2
              const high = n.risk === 3

              return (
                <g
                  key={n.id}
                  transform={`translate(${px},${py})`}
                  style={{ cursor: dragRef.current?.nodeId === n.id ? 'grabbing' : 'grab', transition: 'opacity 0.3s', opacity }}
                  onClick={() => { if (!didDrag.current) { setSelected(isSel ? null : n.id); setDetailTab('basic') } }}
                  onMouseDown={(e) => onMouseDown(e, n.id)}
                  onMouseEnter={() => setHovered(n.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Risk glow */}
                  {high && (
                    <circle r={r + 14} fill={`url(#g-${RISK_RING[n.risk].slice(1)})`} className="animate-pulse" />
                  )}
                  {n.risk === 2 && (
                    <circle r={r + 8} fill="rgba(249,115,22,0.08)" />
                  )}
                  {/* Main circle */}
                  <circle r={r} fill={cfg.color} stroke={isSel || isHov ? '#fff' : 'rgba(255,255,255,0.25)'} strokeWidth={isSel || isHov ? 3 : 1.5} filter={isSel ? 'url(#node-glow)' : undefined} />
                  {/* Risk ring */}
                  {n.risk >= 1 && (
                    <circle r={r - 3} fill="none" stroke={RISK_RING[n.risk]} strokeWidth="2" strokeDasharray={n.risk === 3 ? '3 2' : 'none'} opacity={0.7} />
                  )}
                  {/* Center icon text */}
                  <text y={r > 22 ? 4 : 3} textAnchor="middle" fill="white" fontSize={r > 24 ? 12 : 10} fontWeight="bold">
                    {cfg.label[0]}
                  </text>
                  {/* Label */}
                  {showLabels && (
                    <text y={r + 15} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize={r > 24 ? 11 : 10} fontWeight={isSel ? 'bold' : 'normal'}>
                      {n.name.length > 8 ? n.name.slice(0, 7) + '…' : n.name}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Floating controls */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
            <div className="flex rounded-lg bg-black/25 backdrop-blur p-0.5">
              <button onClick={() => setMode3D(true)} className={cn('rounded px-3 py-1 text-xs font-medium transition', mode3D ? 'bg-[#38BDF8] text-white' : 'text-white/50 hover:text-white/80')}>三维</button>
              <button onClick={() => setMode3D(false)} className={cn('rounded px-3 py-1 text-xs font-medium transition', !mode3D ? 'bg-[#38BDF8] text-white' : 'text-white/50 hover:text-white/80')}>二维</button>
            </div>
            <button onClick={() => setShowLabels(!showLabels)} className={cn('flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition backdrop-blur', showLabels ? 'bg-black/25 text-white' : 'bg-black/10 text-white/40')}>
              {showLabels ? <Eye size={13} /> : <EyeOff size={13} />} 显示标签
            </button>
            <button onClick={() => setShowLegend(!showLegend)} className={cn('flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition backdrop-blur', showLegend ? 'bg-black/25 text-white' : 'bg-black/10 text-white/40')}>
              <Tag size={13} /> 显示图例
            </button>
          </div>

          {/* Bottom toolbar */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-lg bg-black/25 backdrop-blur p-1 z-10">
            <button className="flex h-7 w-7 items-center justify-center rounded text-white/50 hover:text-white hover:bg-white/10"><ZoomIn size={15} /></button>
            <button className="flex h-7 w-7 items-center justify-center rounded text-white/50 hover:text-white hover:bg-white/10"><ZoomOut size={15} /></button>
            <button className="flex h-7 w-7 items-center justify-center rounded text-white/50 hover:text-white hover:bg-white/10"><RotateCcw size={14} /></button>
            <button className="flex h-7 w-7 items-center justify-center rounded text-white/50 hover:text-white hover:bg-white/10"><Maximize2 size={14} /></button>
          </div>

          {/* Legend */}
          {showLegend && (
            <div className="absolute bottom-3 left-36 rounded-lg bg-black/25 backdrop-blur p-2.5 z-10 text-xs">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {Object.entries(GROUP).map(([k, v]) => (
                  <span key={k} className="flex items-center gap-1.5 text-white/60">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: v.color }} />
                    {v.label}
                  </span>
                ))}
                <span className="border-l border-white/15 mx-1" />
                {Object.entries(RISK_LABEL).map(([k, v]) => (
                  <span key={k} className="flex items-center gap-1 text-white/50">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ background: RISK_RING[Number(k)] }} />
                    {v}风险
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right detail panel */}
        {selNode && (
          <div className="w-80 shrink-0 bg-white border-l border-[#D8E2F0] overflow-y-auto z-20 shadow-lg">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F0F2F5]">
              <h3 className="font-semibold text-sm text-[#0F2245]">实体详情</h3>
              <button onClick={() => setSelected(null)} className="flex h-7 w-7 items-center justify-center rounded-md text-[#8BA4C7] hover:bg-[#F8FAFD]"><X size={15} /></button>
            </div>
            {/* Info */}
            <div className="px-5 py-4 border-b border-[#F0F2F5]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full text-white text-sm font-bold" style={{ background: GROUP[selNode.group].color }}>
                  {selNode.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-[#0F2245] text-sm truncate">{selNode.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#8BA4C7]">{GROUP[selNode.group].label}</span>
                    <span className="inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium" style={{ background: RISK_RING[selNode.risk]+'15', color: RISK_RING[selNode.risk] }}>
                      {RISK_LABEL[selNode.risk]}风险
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Tabs */}
            <div className="flex border-b border-[#F0F2F5]">
              {(['basic','relations','risk'] as const).map((t) => (
                <button key={t} onClick={() => setDetailTab(t)} className={cn('flex-1 py-2.5 text-xs font-medium relative', detailTab === t ? 'text-[#38BDF8]' : 'text-[#8BA4C7] hover:text-[#0F2245]')}>
                  {{basic:'基本信息',relations:'关联关系',risk:'风险信息'}[t]}
                  {detailTab === t && <div className="absolute bottom-0 left-1/3 right-1/3 h-0.5 rounded bg-[#38BDF8]" />}
                </button>
              ))}
            </div>
            {/* Content */}
            <div className="p-5">
              {detailTab === 'basic' && (
                <div className="space-y-3 text-sm">
                  {[['实体名称',selNode.name],['实体类型',GROUP[selNode.group].label],['风险等级',RISK_LABEL[selNode.risk]+'风险'],['关联实体',String(new Set(selLinks.map(l=>l.source===selNode.id?l.target:l.source)).size)+' 个'],['关联关系',selLinks.length+' 条']].map(([k,v]) => (
                    <div key={k as string} className="flex justify-between"><span className="text-[#8BA4C7]">{k}</span><span className="text-[#0F2245] font-medium" style={k==='风险等级'?{color:RISK_RING[selNode.risk]}:{}}>{v}</span></div>
                  ))}
                </div>
              )}
              {detailTab === 'relations' && (
                <div className="space-y-2">
                  {selLinks.length === 0 ? <p className="text-sm text-[#8BA4C7]">暂无关联关系</p> : selLinks.map((l, i) => {
                    const oid = l.source === selNode.id ? l.target : l.source
                    const o = byId(oid)
                    return (
                      <div key={i} onClick={() => { if(o){ setSelected(o.id); setDetailTab('basic') }}} className="flex items-center gap-2.5 rounded-lg border border-[#F0F2F5] p-2.5 cursor-pointer hover:bg-[#F8FAFD] transition-colors">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold" style={{ background: o ? GROUP[o.group].color : '#8BA4C7' }}>{o ? o.name[0] : '?'}</div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm text-[#0F2245] truncate font-medium">{o?.name||'未知'}</div>
                          <div className="text-xs text-[#8BA4C7]">{l.label} {l.style==='dashed'?'(可疑)':''}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              {detailTab === 'risk' && (
                <div className="space-y-4">
                  <div className="rounded-lg p-3 text-xs" style={{ background: RISK_RING[selNode.risk]+'10', border: '1px solid '+RISK_RING[selNode.risk]+'20' }}>
                    <div className="font-medium mb-1.5" style={{ color: RISK_RING[selNode.risk] }}>风险提示</div>
                    <ul className="space-y-1" style={{ color: RISK_RING[selNode.risk] }}>
                      {selNode.risk === 3 && <><li>· 关联多个高风险企业</li><li>· 存在资金异常往来</li><li>· 涉及围标串标线索</li></>}
                      {selNode.risk === 2 && <><li>· 存在关联交易未披露</li><li>· 需持续关注经营动态</li></>}
                      {selNode.risk <= 1 && <li>· 当前未发现显著风险</li>}
                    </ul>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5"><span className="text-[#8BA4C7]">风险评分</span><span className="font-medium text-[#0F2245]">{selNode.risk===3?85:selNode.risk===2?55:25}/100</span></div>
                    <div className="h-2 rounded-full bg-[#F0F2F5] overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: selNode.risk===3?'85%':selNode.risk===2?'55%':'25%', background: RISK_RING[selNode.risk] }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
