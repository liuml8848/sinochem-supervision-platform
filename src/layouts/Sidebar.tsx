import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronLeft, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Icon imports
import {
  LayoutDashboard,
  TrendingUp,
  Search,
  Puzzle,
  Zap,
  FileText,
  Building2,
  GitGraph,
  ClipboardCheck,
  Bot,
  Building,
  Landmark,
  ShieldAlert,
  Users,
  Briefcase,
  AlertTriangle,
  Gavel,
  Eye,
  Radio,
  MessageSquare,
  FileBarChart,
  Activity,
} from 'lucide-react'

interface MenuItem {
  key: string
  label: string
  icon: LucideIcon
  path?: string
  children?: { key: string; label: string; path: string }[]
}

const MENU_ITEMS: MenuItem[] = [
  {
    key: '/portal',
    label: '门户首页',
    icon: LayoutDashboard,
    path: '/portal',
  },
  {
    key: '/cockpit',
    label: '驾驶舱',
    icon: TrendingUp,
    children: [
      { key: '/cockpit/group', label: '集团视图', path: '/cockpit/group' },
      { key: '/cockpit/enterprise', label: '企业视图', path: '/cockpit/enterprise' },
    ],
  },
  {
    key: '/risk',
    label: '风险监督',
    icon: Search,
    children: [
      { key: '/risk/bidding', label: '招标采购监督', path: '/risk/bidding' },
      { key: '/risk/business', label: '经商办企监督', path: '/risk/business' },
      { key: '/risk/finance', label: '财务监督', path: '/risk/finance' },
      { key: '/risk/business-dealings', label: '违规业务往来', path: '/risk/business-dealings' },
    ],
  },
  {
    key: '/model',
    label: '监管模型',
    icon: Puzzle,
    children: [
      { key: '/model/plaza', label: '模型广场', path: '/model/plaza' },
      { key: '/model/orchestration', label: '模型编排', path: '/model/orchestration' },
      { key: '/model/inspection', label: '风险巡检', path: '/model/inspection' },
    ],
  },
  {
    key: '/dispatch',
    label: '风险处置',
    icon: Zap,
    children: [
      { key: '/dispatch/workbench', label: '处置工作台', path: '/dispatch/workbench' },
      { key: '/dispatch/clues', label: '风险线索', path: '/dispatch/clues' },
      { key: '/dispatch/auto-assign', label: '智能派单', path: '/dispatch/auto-assign' },
      { key: '/dispatch/rectification', label: '整改任务', path: '/dispatch/rectification' },
    ],
  },
  {
    key: '/penetration',
    label: '风险线索',
    icon: FileText,
    children: [
      { key: '/penetration/bidding', label: '招标采购领域', path: '/penetration/bidding' },
      { key: '/penetration/business', label: '经商办企领域', path: '/penetration/business' },
      { key: '/penetration/finance', label: '财务领域', path: '/penetration/finance' },
      { key: '/penetration/business-dealings', label: '违规业务往来', path: '/penetration/business-dealings' },
    ],
  },
  {
    key: '/supplier',
    label: '供应商情报',
    icon: Building2,
    children: [
      { key: '/supplier/cockpit', label: '供应商驾驶舱', path: '/supplier/cockpit' },
      { key: '/supplier/intelligence', label: '情报中台', path: '/supplier/intelligence' },
      { key: '/supplier/monitoring-model', label: '供应商模型监测', path: '/supplier/monitoring-model' },
      { key: '/supplier/public-opinion', label: '供应商舆情中心', path: '/supplier/public-opinion' },
    ],
  },
  {
    key: '/graph',
    label: '图谱穿透',
    icon: GitGraph,
    children: [
      { key: '/graph/relations', label: '人企图谱', path: '/graph/relations' },
      { key: '/graph/procurement', label: '项目图谱', path: '/graph/procurement' },
      { key: '/graph/funds', label: '资金图谱', path: '/graph/funds' },
      { key: '/graph/three-dimensional', label: '三维图谱穿透', path: '/graph/three-dimensional' },
    ],
  },
  {
    key: '/scorecard',
    label: '记分卡',
    icon: ClipboardCheck,
    children: [
      { key: '/scorecard/project', label: '项目计分卡', path: '/scorecard/project' },
      { key: '/scorecard/person', label: '人员计分卡', path: '/scorecard/person' },
      { key: '/scorecard/config', label: '计分指标配置', path: '/scorecard/config' },
    ],
  },
  {
    key: '/ai-center',
    label: 'AI中心',
    icon: Bot,
    children: [
      { key: '/ai-center/policy-qa', label: '政策知识问答', path: '/ai-center/policy-qa' },
      { key: '/ai-center/analysis', label: '智能分析问数', path: '/ai-center/analysis' },
      { key: '/ai-center/risk-report', label: '智能风险报告', path: '/ai-center/risk-report' },
    ],
  },
]

interface SidebarProps {
  collapsed: boolean
  expandedMenus: string[]
  onToggleMenu: (key: string) => void
  onToggleCollapse: () => void
}

export default function Sidebar({ collapsed, expandedMenus, onToggleMenu, onToggleCollapse }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path
  const isMenuActive = (item: MenuItem) => {
    if (item.path) return isActive(item.path)
    if (item.children) return item.children.some((child) => isActive(child.path))
    return false
  }

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-screen flex-col bg-[#0B1D4A] transition-all duration-300 scrollbar-thin overflow-y-auto"
      style={{ width: collapsed ? 64 : 220 }}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-center border-b border-white/10 px-4">
        {collapsed ? (
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#38BDF8] text-white font-bold text-sm">
            中
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#38BDF8] text-white font-bold text-sm">
              中
            </div>
            <div className="text-white text-sm font-medium leading-tight">
              <div>纪检监察</div>
              <div className="text-[10px] text-white/60">大数据监督平台</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3">
        {MENU_ITEMS.map((item) => {
          const active = isMenuActive(item)
          const hasChildren = !!item.children
          const isExpanded = expandedMenus.includes(item.key)

          return (
            <div key={item.key}>
              {/* Menu item */}
              <button
                onClick={() => {
                  if (hasChildren) {
                    onToggleMenu(item.key)
                    if (collapsed) {
                      onToggleCollapse()
                    }
                  } else if (item.path) {
                    navigate(item.path)
                  }
                }}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                  active && !hasChildren
                    ? 'bg-white/10 text-[#38BDF8] border-r-2 border-[#38BDF8]'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={18} className="shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {hasChildren && (
                      <ChevronDown
                        size={14}
                        className={cn('transition-transform', isExpanded && 'rotate-180')}
                      />
                    )}
                  </>
                )}
              </button>

              {/* Children */}
              {hasChildren && isExpanded && !collapsed && (
                <div className="bg-[#0F2245]/60">
                  {item.children!.map((child) => (
                    <button
                      key={child.key}
                      onClick={() => navigate(child.path)}
                      className={cn(
                        'flex w-full items-center gap-2 py-2 pl-12 pr-4 text-sm transition-colors text-left',
                        isActive(child.path)
                          ? 'text-[#38BDF8] bg-white/10'
                          : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                      )}
                    >
                      <span className="truncate">{child.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center justify-center gap-2 py-2 text-white/50 hover:text-white/80 transition-colors text-xs"
        >
          <ChevronLeft size={14} className={cn('transition-transform', collapsed && 'rotate-180')} />
          {!collapsed && <span>收起菜单</span>}
        </button>
      </div>
    </aside>
  )
}
