import { useLocation } from 'react-router-dom'
import { ChevronRight, Menu, Bell, User } from 'lucide-react'

const BREADCRUMB_MAP: Record<string, string> = {
  '/portal': '门户首页',
  '/cockpit': '驾驶舱',
  '/cockpit/group': '集团视图',
  '/cockpit/enterprise': '企业视图',
  '/risk': '风险监督',
  '/risk/bidding': '招标采购监督',
  '/risk/business': '经商办企监督',
  '/risk/finance': '财务监督',
  '/risk/business-dealings': '违规业务往来',
  '/model': '监管模型',
  '/model/plaza': '模型广场',
  '/model/orchestration': '模型编排',
  '/model/inspection': '风险巡检',
  '/dispatch': '风险处置',
  '/dispatch/workbench': '处置工作台',
  '/dispatch/clues': '风险线索',
  '/dispatch/auto-assign': '智能派单',
  '/dispatch/rectification': '整改任务',
  '/penetration': '风险线索',
  '/penetration/bidding': '招标采购领域风险线索',
  '/penetration/business': '经商办企领域风险线索',
  '/penetration/finance': '财务领域风险线索',
  '/penetration/business-dealings': '违规业务往来领域风险线索',
  '/supplier': '供应商情报',
  '/supplier/cockpit': '供应商驾驶舱',
  '/supplier/intelligence': '情报中台',
  '/supplier/monitoring-model': '供应商模型监测',
  '/supplier/public-opinion': '供应商舆情中心',
  '/graph': '图谱穿透',
  '/graph/relations': '人企图谱',
  '/graph/procurement': '项目图谱',
  '/graph/funds': '资金图谱',
  '/graph/three-dimensional': '三维图谱关联穿透',
  '/scorecard': '记分卡',
  '/scorecard/project': '项目计分卡',
  '/scorecard/person': '人员计分卡',
  '/scorecard/config': '计分指标配置',
  '/ai-center': 'AI中心',
  '/ai-center/policy-qa': '政策知识问答',
  '/ai-center/analysis': '智能分析问数',
  '/ai-center/risk-report': '智能风险报告',
}

interface HeaderProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const location = useLocation()
  const pathParts = location.pathname.split('/').filter(Boolean)

  const breadcrumbs = pathParts.map((_part, index) => {
    const path = '/' + pathParts.slice(0, index + 1).join('/')
    return {
      path,
      label: BREADCRUMB_MAP[path] || path,
    }
  })

  const pageTitle = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : '门户首页'

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#D8E2F0] bg-white px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-md text-[#8BA4C7] hover:bg-[#F8FAFD] hover:text-[#0F2245] transition-colors"
        >
          <Menu size={18} />
        </button>
        <h1 className="text-page-title text-[#0B1D4A]">{pageTitle}</h1>
        {breadcrumbs.length > 1 && (
          <div className="flex items-center gap-1 ml-2 text-sm text-[#8BA4C7]">
            {breadcrumbs.map((item, index) => (
              <span key={item.path} className="flex items-center gap-1">
                {index > 0 && <ChevronRight size={14} />}
                <span className={index === breadcrumbs.length - 1 ? 'text-[#0F2245] font-medium' : ''}>
                  {item.label}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button className="relative flex h-8 w-8 items-center justify-center rounded-md text-[#8BA4C7] hover:bg-[#F8FAFD] transition-colors">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            3
          </span>
        </button>
        <div className="flex items-center gap-2 text-sm text-[#0F2245]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4A6FA5] text-white">
            <User size={14} />
          </div>
          <span>系统管理员</span>
        </div>
      </div>
    </header>
  )
}
