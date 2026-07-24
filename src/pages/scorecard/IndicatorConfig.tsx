import { useState } from 'react'
import { ChevronDown, ChevronRight, Settings, Plus, Save, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/StatusBadge'

interface SubIndicator {
  name: string
  category: string
  redThreshold: number
  orangeThreshold: number
  yellowThreshold: number
  weight: number
  enabled: boolean
}

interface CategoryGroup {
  name: string
  expanded: boolean
  indicators: SubIndicator[]
}

const INITIAL_CATEGORIES: CategoryGroup[] = [
  {
    name: '招标采购指标',
    expanded: true,
    indicators: [
      { name: '围标串标嫌疑指数', category: '招标采购', redThreshold: 80, orangeThreshold: 60, yellowThreshold: 40, weight: 15, enabled: true },
      { name: '关联关系排查指数', category: '招标采购', redThreshold: 75, orangeThreshold: 55, yellowThreshold: 35, weight: 12, enabled: true },
      { name: '投标异常行为指数', category: '招标采购', redThreshold: 85, orangeThreshold: 65, yellowThreshold: 45, weight: 10, enabled: true },
      { name: '供应商评价异常指数', category: '招标采购', redThreshold: 70, orangeThreshold: 50, yellowThreshold: 30, weight: 8, enabled: true },
      { name: '中标价格偏离指数', category: '招标采购', redThreshold: 90, orangeThreshold: 70, yellowThreshold: 50, weight: 5, enabled: false },
    ],
  },
  {
    name: '经商办企指标',
    expanded: false,
    indicators: [
      { name: '注册关联企业指数', category: '经商办企', redThreshold: 80, orangeThreshold: 60, yellowThreshold: 40, weight: 12, enabled: true },
      { name: '参股投资占比指数', category: '经商办企', redThreshold: 75, orangeThreshold: 55, yellowThreshold: 35, weight: 10, enabled: true },
      { name: '企业任职冲突指数', category: '经商办企', redThreshold: 85, orangeThreshold: 65, yellowThreshold: 45, weight: 8, enabled: true },
      { name: '亲属经商关联指数', category: '经商办企', redThreshold: 70, orangeThreshold: 50, yellowThreshold: 30, weight: 10, enabled: true },
    ],
  },
  {
    name: '财务指标',
    expanded: false,
    indicators: [
      { name: '个人消费异常指数', category: '财务', redThreshold: 80, orangeThreshold: 60, yellowThreshold: 40, weight: 10, enabled: true },
      { name: '收入申报合规指数', category: '财务', redThreshold: 75, orangeThreshold: 55, yellowThreshold: 35, weight: 8, enabled: true },
      { name: '利益冲突申报指数', category: '财务', redThreshold: 85, orangeThreshold: 65, yellowThreshold: 45, weight: 5, enabled: true },
      { name: '资金往来异常指数', category: '财务', redThreshold: 90, orangeThreshold: 70, yellowThreshold: 50, weight: 7, enabled: true },
    ],
  },
]

const VERSIONS = ['V2.3.1（当前版本）', 'V2.3.0', 'V2.2.0', 'V2.1.0']

function WeightSlider({ value, onChange, disabled }: { value: number; onChange: (v: number) => void; disabled?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={0}
        max={20}
        step={0.5}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1.5 w-16 appearance-none rounded-full bg-[#EDF2F9] outline-none disabled:opacity-50
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0B1D4A] [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:disabled:bg-[#D8E2F0]"
      />
      <span className={cn(
        'w-8 text-right text-xs font-number',
        disabled ? 'text-[#D8E2F0]' : 'text-[#0F2245]'
      )}>
        {value}%
      </span>
    </div>
  )
}

export function IndicatorConfig() {
  const [categories, setCategories] = useState<CategoryGroup[]>(INITIAL_CATEGORIES)
  const [selectedVersion, setSelectedVersion] = useState(VERSIONS[0])
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [showValidation, setShowValidation] = useState(false)

  const allIndicators = categories.flatMap((c) => c.indicators)
  const enabledIndicators = allIndicators.filter((i) => i.enabled)
  const totalWeight = enabledIndicators.reduce((sum, i) => sum + i.weight, 0)
  const weightValid = Math.abs(totalWeight - 100) < 0.5
  const weightPercent = Math.min((totalWeight / 100) * 100, 100)

  const toggleCategory = (name: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.name === name ? { ...c, expanded: !c.expanded } : c))
    )
  }

  const updateWeight = (categoryIdx: number, indicatorIdx: number, newWeight: number) => {
    setCategories((prev) => {
      const next = prev.map((c) => ({ ...c, indicators: c.indicators.map((i) => ({ ...i })) }))
      next[categoryIdx].indicators[indicatorIdx].weight = newWeight
      return next
    })
    setHasChanges(true)
  }

  const toggleEnabled = (categoryIdx: number, indicatorIdx: number) => {
    setCategories((prev) => {
      const next = prev.map((c) => ({ ...c, indicators: c.indicators.map((i) => ({ ...i })) }))
      next[categoryIdx].indicators[indicatorIdx].enabled = !next[categoryIdx].indicators[indicatorIdx].enabled
      return next
    })
    setHasChanges(true)
  }

  const handleSave = () => {
    if (!weightValid) {
      setShowValidation(true)
      return
    }
    setSaving(true)
    setShowSaveSuccess(false)
    setTimeout(() => {
      setSaving(false)
      setShowSaveSuccess(true)
      setHasChanges(false)
      setTimeout(() => setShowSaveSuccess(false), 3000)
    }, 1500)
  }

  const handleReset = () => {
    setCategories(INITIAL_CATEGORIES.map((c) => ({ ...c, indicators: c.indicators.map((i) => ({ ...i })) })))
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-page-title text-[#0B1D4A]">计分指标配置</h1>
          <p className="mt-1 text-sm text-[#8BA4C7]">配置各维度指标的阈值、权重及启用状态</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Version Selector */}
          <div className="relative">
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="h-9 rounded-lg border border-[#D8E2F0] bg-white px-8 pr-3 text-sm text-[#0F2245] outline-none appearance-none cursor-pointer focus:border-[#38BDF8]"
            >
              {VERSIONS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8BA4C7] pointer-events-none" />
          </div>
          <button
            onClick={handleReset}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-[#D8E2F0] bg-white px-3 text-sm text-[#0F2245] hover:bg-[#EDF2F9] transition-colors"
          >
            <RotateCcw size={14} />
            重置
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={cn(
              'flex h-9 items-center gap-1.5 rounded-lg px-4 text-sm font-medium text-white transition-colors',
              hasChanges && !saving ? 'bg-[#0B1D4A] hover:bg-[#0B1D4A]/90' : 'bg-[#8BA4C7] cursor-not-allowed'
            )}
          >
            {saving ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                保存中...
              </>
            ) : (
              <>
                <Save size={14} />
                保存配置
              </>
            )}
          </button>
          {showSaveSuccess && (
            <span className="flex items-center gap-1 text-xs text-green-500">
              <CheckCircle size={14} />
              配置已保存
            </span>
          )}
        </div>
      </div>

      {/* Weight Validation */}
      <div className={cn(
        'rounded-lg border p-3 transition-colors',
        weightValid ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {weightValid ? (
              <CheckCircle size={16} className="text-green-500" />
            ) : (
              <AlertCircle size={16} className="text-yellow-500" />
            )}
            <span className={cn(
              'text-sm font-medium',
              weightValid ? 'text-green-700' : 'text-yellow-700'
            )}>
              权重合计：{totalWeight.toFixed(1)}% / 100%
            </span>
          </div>
          <div className="h-2 w-32 rounded-full bg-white overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                weightValid ? 'bg-green-400' : 'bg-yellow-400'
              )}
              style={{ width: `${weightPercent}%` }}
            />
          </div>
        </div>
        {!weightValid && showValidation && (
          <p className="mt-2 text-xs text-yellow-600">
            权重合计必须为100%，当前{totalWeight > 100 ? '超出' : '不足'}{(Math.abs(totalWeight - 100)).toFixed(1)}%
          </p>
        )}
      </div>

      {/* Category Sections with Weight Sliders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {categories.map((cat, catIdx) => (
          <div key={cat.name} className="rounded-lg bg-white shadow-card">
            <button
              onClick={() => toggleCategory(cat.name)}
              className="flex w-full items-center justify-between border-b border-[#EDF2F9] px-5 py-3.5 text-left"
            >
              <div className="flex items-center gap-2">
                {cat.expanded ? <ChevronDown size={16} className="text-[#8BA4C7]" /> : <ChevronRight size={16} className="text-[#8BA4C7]" />}
                <h3 className="text-sm font-semibold text-[#0F2245]">{cat.name}</h3>
              </div>
              <span className="text-xs text-[#8BA4C7]">
                {cat.indicators.filter((i) => i.enabled).length}/{cat.indicators.length} 启用
              </span>
            </button>
            {cat.expanded && (
              <div className="divide-y divide-[#EDF2F9]">
                {cat.indicators.map((ind, indIdx) => (
                  <div key={ind.name} className={cn(
                    'px-5 py-3 transition-colors',
                    !ind.enabled && 'opacity-50'
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={ind.enabled}
                            onChange={() => toggleEnabled(catIdx, indIdx)}
                            className="peer sr-only"
                          />
                          <div className="h-4 w-7 rounded-full border border-[#D8E2F0] bg-[#EDF2F9] after:absolute after:left-[2px] after:top-[2px] after:h-3 after:w-3 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#0B1D4A] peer-checked:after:translate-x-full" />
                        </label>
                        <span className="text-xs font-medium text-[#0F2245]">{ind.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-[#8BA4C7]">权重</span>
                        <WeightSlider
                          value={ind.weight}
                          onChange={(v) => updateWeight(catIdx, indIdx, v)}
                          disabled={!ind.enabled}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-[#8BA4C7]">
                      <span>
                        红牌阈值: <span className="font-medium text-red-500">{ind.redThreshold}分</span>
                      </span>
                      <span>
                        橙牌阈值: <span className="font-medium text-orange-500">{ind.orangeThreshold}分</span>
                      </span>
                      <span>
                        黄牌阈值: <span className="font-medium text-yellow-500">{ind.yellowThreshold}分</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Full Indicator Table */}
      <div className="rounded-lg bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-[#EDF2F9] px-6 py-4">
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-[#8BA4C7]" />
            <h3 className="text-sm font-semibold text-[#0F2245]">指标明细表</h3>
          </div>
          <button className="flex h-7 items-center gap-1 rounded-md border border-[#D8E2F0] bg-white px-2.5 text-xs text-[#0F2245] hover:bg-[#EDF2F9] transition-colors">
            <Plus size={12} />
            新增指标
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EDF2F9]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#8BA4C7]">指标名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#8BA4C7]">类别</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#8BA4C7]">
                  <span className="text-red-500">红牌阈值</span>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#8BA4C7]">
                  <span className="text-orange-500">橙牌阈值</span>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#8BA4C7]">
                  <span className="text-yellow-500">黄牌阈值</span>
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#8BA4C7]">权重(%)</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-[#8BA4C7]">状态</th>
              </tr>
            </thead>
            <tbody>
              {allIndicators.map((ind, idx) => (
                <tr
                  key={ind.name}
                  className={cn(
                    'border-b border-[#EDF2F9] text-sm transition-colors hover:bg-[#F8FAFD]',
                    idx === allIndicators.length - 1 && 'border-b-0',
                    !ind.enabled && 'opacity-50'
                  )}
                >
                  <td className="px-4 py-3.5 font-medium text-[#0F2245]">{ind.name}</td>
                  <td className="px-4 py-3.5 text-[#8BA4C7]">{ind.category}</td>
                  <td className="px-4 py-3.5 text-center font-number text-red-500">{ind.redThreshold}</td>
                  <td className="px-4 py-3.5 text-center font-number text-orange-500">{ind.orangeThreshold}</td>
                  <td className="px-4 py-3.5 text-center font-number text-yellow-500">{ind.yellowThreshold}</td>
                  <td className="px-4 py-3.5 text-center font-number text-[#0F2245]">{ind.weight}</td>
                  <td className="px-4 py-3.5 text-center">
                    <StatusBadge level={ind.enabled ? 'active' : 'inactive'} label={ind.enabled ? '启用' : '停用'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
