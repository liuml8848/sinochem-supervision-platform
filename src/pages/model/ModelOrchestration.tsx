import { useState } from 'react'
import { Layers, Database, Filter, Brain, ArrowRight, Play, Settings, Download, Plus, FileOutput } from 'lucide-react'

interface FlowNode {
  id: string
  label: string
  icon: typeof Database
  color: string
  desc: string
}

interface FlowDefinition {
  id: string
  name: string
  description: string
  category: string
  status: 'active' | 'draft'
  nodes: FlowNode[]
}

const FLOW_NODES: Record<string, FlowNode[]> = {
  'flow-1': [
    { id: 'n1', label: '招投标数据源', icon: Database, color: '#38BDF8', desc: '对接集团招投标系统、公共资源交易平台' },
    { id: 'n2', label: '数据清洗', icon: Filter, color: '#2DD4BF', desc: '去重、格式化、缺失值处理' },
    { id: 'n3', label: '规则引擎', icon: Brain, color: '#8B5CF6', desc: '应招未招规则匹配，阈值判定' },
    { id: 'n4', label: '风险输出', icon: FileOutput, color: '#EF4444', desc: '生成风险线索，推送处置系统' },
  ],
  'flow-2': [
    { id: 'n1', label: '工商数据源', icon: Database, color: '#38BDF8', desc: '天眼查API、集团ERP系统、工商局数据' },
    { id: 'n2', label: '数据清洗', icon: Filter, color: '#2DD4BF', desc: '实体对齐、关联关系提取' },
    { id: 'n3', label: '规则引擎', icon: Brain, color: '#8B5CF6', desc: '关联交易识别算法，利益冲突检测' },
    { id: 'n4', label: '风险输出', icon: FileOutput, color: '#EF4444', desc: '生成关联交易线索报告' },
  ],
  'flow-3': [
    { id: 'n1', label: '采购数据源', icon: Database, color: '#38BDF8', desc: '采购管理系统、供应商数据库' },
    { id: 'n2', label: '数据清洗', icon: Filter, color: '#2DD4BF', desc: '分包信息标准化、资质数据校验' },
    { id: 'n3', label: '规则引擎', icon: Brain, color: '#8B5CF6', desc: '分包比例检测、资质匹配分析' },
    { id: 'n4', label: '风险输出', icon: FileOutput, color: '#EF4444', desc: '输出违规分包线索' },
  ],
  'flow-4': [
    { id: 'n1', label: '专家库数据', icon: Database, color: '#38BDF8', desc: '评标专家库、项目分配记录' },
    { id: 'n2', label: '数据清洗', icon: Filter, color: '#2DD4BF', desc: '专家信息清洗、关系图谱构建' },
    { id: 'n3', label: '规则引擎', icon: Brain, color: '#8B5CF6', desc: '回避规则匹配、利益关联分析' },
    { id: 'n4', label: '风险输出', icon: FileOutput, color: '#EF4444', desc: '生成专家回避预警' },
  ],
  'flow-5': [
    { id: 'n1', label: '供应商数据', icon: Database, color: '#38BDF8', desc: '供应商注册信息、资质文件、历史合作数据' },
    { id: 'n2', label: '数据清洗', icon: Filter, color: '#2DD4BF', desc: '资质审核、黑名单比对' },
    { id: 'n3', label: '规则引擎', icon: Brain, color: '#8B5CF6', desc: '准入条件评估、风险评分计算' },
    { id: 'n4', label: '风险输出', icon: FileOutput, color: '#EF4444', desc: '生成准入审批建议' },
  ],
  'flow-6': [
    { id: 'n1', label: '资金流水数据', icon: Database, color: '#38BDF8', desc: '银行流水、财务系统、资金监控平台' },
    { id: 'n2', label: '数据清洗', icon: Filter, color: '#2DD4BF', desc: '交易分类、异常模式提取' },
    { id: 'n3', label: '规则引擎', icon: Brain, color: '#8B5CF6', desc: '资金流向追踪、异常交易判定' },
    { id: 'n4', label: '风险输出', icon: FileOutput, color: '#EF4444', desc: '输出资金异常流向预警' },
  ],
}

const FLOWS: FlowDefinition[] = [
  { id: 'flow-1', name: '应招未招检测流程', description: '识别应招标但未招标的采购项目，防范规避招标行为', category: '招标采购监督', status: 'active', nodes: FLOW_NODES['flow-1'] },
  { id: 'flow-2', name: '关联交易识别流程', description: '识别企业与关联方之间的异常交易，排查利益输送风险', category: '经商办企监督', status: 'active', nodes: FLOW_NODES['flow-2'] },
  { id: 'flow-3', name: '违规分包检测流程', description: '检测中标后将工程违规分包、转包的行为', category: '招标采购监督', status: 'active', nodes: FLOW_NODES['flow-3'] },
  { id: 'flow-4', name: '专家回避检测流程', description: '检测评标专家未按规定回避的情况', category: '招标采购监督', status: 'active', nodes: FLOW_NODES['flow-4'] },
  { id: 'flow-5', name: '供应商准入审批流程', description: '对供应商准入进行自动化审核与风险评估', category: '综合', status: 'active', nodes: FLOW_NODES['flow-5'] },
  { id: 'flow-6', name: '资金异常流向检测流程', description: '追踪大额资金流向，检测异常转账与资金挪用行为', category: '财务监督', status: 'draft', nodes: FLOW_NODES['flow-6'] },
]

function FlowNodeBox({ node, index, total }: { node: FlowNode; index: number; total: number }) {
  const Icon = node.icon
  const isLast = index === total - 1
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5"
          style={{ backgroundColor: node.color + '15', border: '2px solid ' + node.color }}
        >
          <Icon size={28} style={{ color: node.color }} />
        </div>
        <span className="mt-1.5 text-xs font-semibold text-[#0F2245] text-center leading-tight">{node.label}</span>
        <span className="mt-0.5 text-[10px] text-[#8BA4C7] text-center leading-tight max-w-[100px]">{node.desc}</span>
      </div>
      {!isLast && (
        <div className="flex items-center mx-3">
          <svg width="60" height="40" className="overflow-visible">
            <line x1="5" y1="20" x2="50" y2="20" stroke="#D8E2F0" strokeWidth="2" strokeDasharray="6,3" />
            <polygon points="48,16 55,20 48,24" fill="#D8E2F0" />
            <circle cx="8" cy="20" r="3" fill="#8BA4C7" opacity="0.5" />
          </svg>
        </div>
      )}
    </div>
  )
}

export function ModelOrchestration() {
  const [selectedId, setSelectedId] = useState<string>('flow-1')
  const selected = FLOWS.find((f) => f.id === selectedId) || FLOWS[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-page-title text-[#0B1D4A]">模型编排</h1>
          <p className="mt-1 text-sm text-[#8BA4C7]">
            拖拽编排检测流程，构建自动化风险监控流水线
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#D8E2F0] bg-white px-3 py-2 text-xs font-medium text-[#0F2245] hover:bg-[#EDF2F9] transition-colors">
            <Download size={14} />
            导入流程
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-[#38BDF8] px-3 py-2 text-xs font-medium text-white hover:bg-[#0EA5E9] transition-colors shadow-sm">
            <Plus size={14} />
            新建流程
          </button>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Left Panel - Flow List */}
        <div className="w-72 shrink-0">
          <div className="rounded-lg bg-white shadow-card overflow-hidden">
            <div className="border-b border-[#D8E2F0] bg-[#F8FAFD] px-4 py-3">
              <h3 className="text-sm font-semibold text-[#0F2245] flex items-center gap-2">
                <Layers size={15} className="text-[#38BDF8]" />
                检测流程
              </h3>
            </div>
            <div className="divide-y divide-[#F0F2F5]">
              {FLOWS.map((flow) => (
                <button
                  key={flow.id}
                  onClick={() => setSelectedId(flow.id)}
                  className={`w-full px-4 py-3 text-left transition-colors hover:bg-[#EDF2F9] ${
                    selectedId === flow.id ? 'bg-[#EDF2F9] border-l-2 border-l-[#38BDF8]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${selectedId === flow.id ? 'text-[#0B1D4A]' : 'text-[#0F2245]'}`}>
                      {flow.name}
                    </h4>
                    <span
                      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                        flow.status === 'active'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {flow.status === 'active' ? '启用' : '草稿'}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#8BA4C7] line-clamp-1">{flow.description}</p>
                  <span className="mt-1 inline-block text-[10px] text-[#8BA4C7] bg-[#EDF2F9] px-1.5 py-0.5 rounded">
                    {flow.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Flow Canvas */}
        <div className="flex-1 min-w-0">
          <div className="rounded-lg bg-white shadow-card overflow-hidden">
            {/* Canvas Header */}
            <div className="flex items-center justify-between border-b border-[#D8E2F0] bg-[#F8FAFD] px-5 py-3">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-[#0F2245]">{selected.name}</h3>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    selected.status === 'active'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {selected.status === 'active' ? '已启用' : '草稿'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 rounded-lg border border-[#D8E2F0] bg-white px-3 py-1.5 text-xs font-medium text-[#0F2245] hover:bg-[#EDF2F9] transition-colors">
                  <Settings size={13} />
                  配置
                </button>
                <button className="flex items-center gap-1 rounded-lg bg-[#38BDF8] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0EA5E9] transition-colors shadow-sm">
                  <Play size={13} />
                  运行
                </button>
              </div>
            </div>

            {/* Canvas Body */}
            <div className="relative bg-[#F8FAFD] bg-[radial-gradient(#D8E2F0_1px,transparent_1px)] bg-[length:20px_20px] min-h-[480px] flex items-center justify-center">
              {/* Flow Node Graph */}
              <div className="flex items-center justify-center px-8 py-10">
                {selected.nodes.map((node, idx) => (
                  <FlowNodeBox key={node.id} node={node} index={idx} total={selected.nodes.length} />
                ))}
              </div>
            </div>

            {/* Node Legend / Stats */}
            <div className="border-t border-[#D8E2F0] px-5 py-3 bg-white">
              <div className="flex items-center gap-6">
                <span className="text-xs text-[#8BA4C7]">
                  节点数: <span className="font-semibold text-[#0F2245]">{selected.nodes.length}</span>
                </span>
                <span className="text-xs text-[#8BA4C7]">
                  上次运行: <span className="font-semibold text-[#0F2245]">2025-06-10 14:32</span>
                </span>
                <span className="text-xs text-[#8BA4C7]">
                  运行耗时: <span className="font-semibold text-[#0F2245]">3.2s</span>
                </span>
                <span className="text-xs text-[#8BA4C7]">
                  准确率: <span className="font-semibold text-[#0F2245]">92.5%</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Description */}
          <div className="mt-4 rounded-lg bg-white p-4 shadow-card">
            <h4 className="text-xs font-semibold text-[#0F2245] mb-1">流程说明</h4>
            <p className="text-xs text-[#8BA4C7] leading-relaxed">{selected.description}。本流程共包含 {selected.nodes.length} 个处理节点，从数据接入到风险输出实现全自动化处理，支持定时调度与手动触发。</p>
          </div>
        </div>
      </div>
    </div>
  )
}
