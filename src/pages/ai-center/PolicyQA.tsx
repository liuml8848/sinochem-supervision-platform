import { useState, useRef, useEffect } from 'react'
import { Send, BookOpen, FileText, ChevronRight, Building2, Scale, AlertCircle, Lightbulb, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/StatusBadge'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  references?: { title: string; source: string }[]
  timestamp: Date
}

const SUGGESTED_QUESTIONS = [
  {
    id: 'q1',
    question: '招标采购中关联关系认定标准是什么？',
    category: '招标采购',
    icon: FileText,
  },
  {
    id: 'q2',
    question: '员工经商办企业有哪些禁止性规定？',
    category: '经商办企',
    icon: Building2,
  },
  {
    id: 'q3',
    question: '领导干部个人事项申报的范围和标准？',
    category: '个人事项',
    icon: Scale,
  },
  {
    id: 'q4',
    question: '利益冲突申报的具体要求和时限？',
    category: '利益冲突',
    icon: AlertCircle,
  },
  {
    id: 'q5',
    question: '供应商管理中的廉洁风险防控要点？',
    category: '供应商管理',
    icon: Lightbulb,
  },
  {
    id: 'q6',
    question: '纪检监督工作中发现问题线索的处置流程？',
    category: '线索处置',
    icon: BookOpen,
  },
]

const POLICY_CATEGORIES = [
  { name: '全部', active: true },
  { name: '招标采购', active: false },
  { name: '经商办企', active: false },
  { name: '利益冲突', active: false },
  { name: '个人事项', active: false },
  { name: '供应商管理', active: false },
]

function getMockResponse(question: string): Message {
  if (question.includes('关联关系') || question.includes('招标')) {
    return {
      id: 'r1',
      role: 'assistant',
      content: `根据《中化集团招标采购管理办法（2025年修订版）》及相关规定，**关联关系认定标准**如下：

## 一、认定范围

1. **股权关联**：投标人与招标人之间存在直接或间接控股、参股关系，持股比例超过5%的；
2. **人员关联**：投标人的法定代表人、董事、高管与招标人的项目负责人、评标委员会成员之间存在近亲属关系；
3. **经济关联**：投标人在投标前12个月内与招标人存在除本次招标外的其他经济往来；
4. **历史关联**：投标人的前员工在离职后2年内参与原单位的招标项目。

## 二、处置要求

- 存在关联关系的投标人应**主动申报**，未申报的按串标处理；
- 评标过程中发现关联关系未申报的，**立即取消投标资格**；
- 已中标的，**解除合同**并列入供应商黑名单。

## 三、法律依据

> 依据《招标投标法实施条例》第三十四条、《中化集团供应商管理办法》第二十二条。`,
      references: [
        { title: '中化集团招标采购管理办法（2025年修订版）', source: '集团纪委办公室' },
        { title: '中化集团供应商管理办法', source: '集团采购管理部' },
        { title: '招标投标法实施条例', source: '国务院' },
      ],
      timestamp: new Date(),
    }
  }

  return {
    id: 'r2',
    role: 'assistant',
    content: `根据相关规定，针对您的问题回复如下：

## 政策依据

该事项涉及中化集团相关管理规定和上级政策文件要求，具体认定标准和处置流程如下：

1. 严格执行相关管理办法的规定条款；
2. 涉及违规行为的，按照《中化集团员工违规违纪处理办法》处理；
3. 情节严重或造成重大损失的，移交纪检监察部门处理。

## 建议

建议查阅相关制度文件原文，或联系本单位纪检部门获取详细信息。`,
    references: [
      { title: '中化集团员工违规违纪处理办法', source: '集团纪委办公室' },
      { title: '中国中化合规管理指引', source: '集团法律部' },
    ],
    timestamp: new Date(),
  }
}

export function PolicyQA() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '您好！我是纪检政策知识助手，可以为您查询和解答各类纪检监督相关政策法规问题。请问有什么可以帮助您的？',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeCategory, setActiveCategory] = useState('全部')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (text?: string) => {
    const question = (text || input).trim()
    if (!question || isTyping) return

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = getMockResponse(question)
      setMessages((prev) => [...prev, response])
      setIsTyping(false)
    }, 1800)
  }

  const handleSuggestedClick = (question: string) => {
    handleSend(question)
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-page-title text-[#0B1D4A]">政策知识问答</h1>
          <p className="mt-1 text-sm text-[#8BA4C7]">基于知识库的纪检监督相关政策智能问答</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Chat Area */}
        <div className="flex flex-1 flex-col rounded-lg bg-white shadow-card">
          {/* Chat Header */}
          <div className="flex items-center gap-2 border-b border-[#EDF2F9] px-5 py-3.5">
            <Sparkles size={16} className="text-[#38BDF8]" />
            <span className="text-sm font-medium text-[#0F2245]">纪检政策知识助手</span>
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-600">在线</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-5" style={{ maxHeight: '520px', minHeight: '400px' }}>
            {messages.map((msg) => (
              <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-3',
                  msg.role === 'user'
                    ? 'bg-[#0B1D4A] text-white rounded-br-md'
                    : 'bg-[#F8FAFD] text-[#0F2245] rounded-bl-md'
                )}>
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed [&_h1]:text-base [&_h1]:font-semibold [&_h1]:mt-3 [&_h1]:mb-2 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mt-2.5 [&_h2]:mb-1.5 [&_h3]:text-sm [&_h3]:font-medium [&_h3]:mt-2 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-1.5 [&_li]:text-sm [&_li]:mb-0.5 [&_strong]:font-semibold [&_blockquote]:border-l-2 [&_blockquote]:border-[#D8E2F0] [&_blockquote]:pl-3 [&_blockquote]:text-[#8BA4C7] [&_blockquote]:italic [&_blockquote]:my-2 [&_blockquote]:text-xs">
                        <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/^## (.*$)/gm, '<h2>$1</h2>').replace(/^### (.*$)/gm, '<h3>$1</h3>').replace(/^- (.*$)/gm, '<li>$1</li>').replace(/(\d+)\. /g, '<br/>$1. ') }} />
                      </div>

                      {/* References */}
                      {msg.references && msg.references.length > 0 && (
                        <div className="mt-3 rounded-lg border border-[#D8E2F0] bg-white p-3">
                          <p className="mb-2 text-[10px] font-medium text-[#8BA4C7] uppercase tracking-wider">参考依据</p>
                          <div className="space-y-1.5">
                            {msg.references.map((ref, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs">
                                <FileText size={12} className="mt-0.5 shrink-0 text-[#38BDF8]" />
                                <div>
                                  <p className="font-medium text-[#0F2245]">{ref.title}</p>
                                  <p className="text-[#8BA4C7]">{ref.source}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                  <p className={cn(
                    'mt-1.5 text-[10px]',
                    msg.role === 'user' ? 'text-white/60' : 'text-[#8BA4C7]'
                  )}>
                    {msg.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-[#F8FAFD] px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#8BA4C7]" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#8BA4C7]" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#8BA4C7]" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-[#EDF2F9] p-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="请输入您想查询的政策问题..."
                className="flex-1 h-10 rounded-lg border border-[#D8E2F0] bg-[#F8FAFD] px-4 text-sm text-[#0F2245] placeholder:text-[#8BA4C7] outline-none focus:border-[#38BDF8] focus:bg-white"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                  input.trim() && !isTyping ? 'bg-[#0B1D4A] text-white hover:bg-[#0B1D4A]/90' : 'bg-[#EDF2F9] text-[#8BA4C7] cursor-not-allowed'
                )}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden w-72 shrink-0 lg:block">
          <div className="space-y-4">
            {/* Category Tags */}
            <div className="rounded-lg bg-white p-4 shadow-card">
              <h3 className="mb-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">政策分类</h3>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setActiveCategory('全部')}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs transition-colors',
                    activeCategory === '全部' ? 'bg-[#0B1D4A] text-white' : 'bg-[#EDF2F9] text-[#0F2245] hover:bg-[#D8E2F0]'
                  )}
                >
                  全部
                </button>
                <button
                  onClick={() => setActiveCategory('招标采购')}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs transition-colors',
                    activeCategory === '招标采购' ? 'bg-[#0B1D4A] text-white' : 'bg-[#EDF2F9] text-[#0F2245] hover:bg-[#D8E2F0]'
                  )}
                >
                  招标采购
                </button>
                <button
                  onClick={() => setActiveCategory('经商办企')}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs transition-colors',
                    activeCategory === '经商办企' ? 'bg-[#0B1D4A] text-white' : 'bg-[#EDF2F9] text-[#0F2245] hover:bg-[#D8E2F0]'
                  )}
                >
                  经商办企
                </button>
                <button
                  onClick={() => setActiveCategory('利益冲突')}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs transition-colors',
                    activeCategory === '利益冲突' ? 'bg-[#0B1D4A] text-white' : 'bg-[#EDF2F9] text-[#0F2245] hover:bg-[#D8E2F0]'
                  )}
                >
                  利益冲突
                </button>
                <button
                  onClick={() => setActiveCategory('个人事项')}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs transition-colors',
                    activeCategory === '个人事项' ? 'bg-[#0B1D4A] text-white' : 'bg-[#EDF2F9] text-[#0F2245] hover:bg-[#D8E2F0]'
                  )}
                >
                  个人事项
                </button>
                <button
                  onClick={() => setActiveCategory('供应商管理')}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs transition-colors',
                    activeCategory === '供应商管理' ? 'bg-[#0B1D4A] text-white' : 'bg-[#EDF2F9] text-[#0F2245] hover:bg-[#D8E2F0]'
                  )}
                >
                  供应商管理
                </button>
              </div>
            </div>

            {/* Suggested Questions */}
            <div className="rounded-lg bg-white p-4 shadow-card">
              <h3 className="mb-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">常见问题</h3>
              <div className="space-y-1">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleSuggestedClick(q.question)}
                    className="flex w-full items-start gap-2.5 rounded-lg p-2.5 text-left text-xs text-[#0F2245] hover:bg-[#F8FAFD] transition-colors group"
                  >
                    <q.icon size={14} className="mt-0.5 shrink-0 text-[#8BA4C7] group-hover:text-[#0B1D4A]" />
                    <span className="flex-1 leading-snug">{q.question}</span>
                    <ChevronRight size={12} className="mt-0.5 shrink-0 text-[#D8E2F0] group-hover:text-[#8BA4C7]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-lg bg-white p-4 shadow-card">
              <h3 className="mb-3 text-xs font-semibold text-[#8BA4C7] uppercase tracking-wider">知识库统计</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8BA4C7]">政策文件</span>
                  <span className="text-xs font-medium text-[#0F2245]">1,286 篇</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8BA4C7]">法规条目</span>
                  <span className="text-xs font-medium text-[#0F2245]">4,532 条</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8BA4C7]">典型案例</span>
                  <span className="text-xs font-medium text-[#0F2245]">368 个</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8BA4C7]">更新日期</span>
                  <span className="text-xs font-medium text-[#0F2245]">2026-07-20</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
