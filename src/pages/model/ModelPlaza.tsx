import { useState } from 'react'
import { Search, Play, Pause, TrendingUp } from 'lucide-react'

interface ModelCard {
  id: number
  name: string
  category: string
  status: 'active' | 'inactive'
  version: string
  accuracy: string
  lastRun: string
  description: string
  color: string
}

const MODELS: ModelCard[] = [
  { id: 1, name: '围标串标检测模型', category: '招标采购监督', status: 'active', version: 'v1.2.0', accuracy: '92.5%', lastRun: '2025-06-10', description: '基于投标人关系网络分析，自动检测围标串标行为', color: '#EF4444' },
  { id: 2, name: '应招未招检测模型', category: '招标采购监督', status: 'active', version: 'v1.0.0', accuracy: '88.3%', lastRun: '2025-06-09', description: '识别应招标但未招标的采购项目，防范规避招标行为', color: '#F97316' },
  { id: 3, name: '投标人高中标率检测', category: '招标采购监督', status: 'active', version: 'v1.1.0', accuracy: '85.7%', lastRun: '2025-06-08', description: '分析投标人中标频率异常，识别潜在围标行为', color: '#F59E0B' },
  { id: 4, name: '异常投标行为检测', category: '招标采购监督', status: 'active', version: 'v1.0.5', accuracy: '90.1%', lastRun: '2025-06-07', description: '基于历史投标数据分析，识别异常投标模式', color: '#38BDF8' },
  { id: 5, name: '资质挂靠检测模型', category: '招标采购监督', status: 'active', version: 'v1.0.2', accuracy: '87.2%', lastRun: '2025-06-06', description: '检测供应商资质挂靠、借用资质等违规行为', color: '#8B5CF6' },
  { id: 6, name: '采购价格异常检测', category: '招标采购监督', status: 'inactive', version: 'v0.9.0', accuracy: '--', lastRun: '--', description: '对比市场价格，检测采购价格异常偏离情况', color: '#8BA4C7' },
  { id: 7, name: '亲属经商识别模型', category: '经商办企监督', status: 'active', version: 'v1.0.0', accuracy: '91.8%', lastRun: '2025-06-10', description: '识别员工亲属经商办企业，排查利益冲突', color: '#2DD4BF' },
  { id: 8, name: '员工持股外部企业检测', category: '经商办企监督', status: 'active', version: 'v1.0.3', accuracy: '89.5%', lastRun: '2025-06-05', description: '检测员工持股外部企业情况，识别违规持股行为', color: '#EC4899' },
  { id: 9, name: '在职员工经商办企检测', category: '经商办企监督', status: 'active', version: 'v1.1.0', accuracy: '93.2%', lastRun: '2025-06-04', description: '全面排查在职员工经商办企业情况', color: '#F59E0B' },
  { id: 10, name: '过度负债监测模型', category: '财务监督', status: 'active', version: 'v1.2.1', accuracy: '86.4%', lastRun: '2025-06-10', description: '监测企业资产负债率异常，预警过度负债风险', color: '#EF4444' },
  { id: 11, name: '违规融资担保监测', category: '财务监督', status: 'active', version: 'v1.0.8', accuracy: '88.9%', lastRun: '2025-06-09', description: '检测违规融资担保行为，防范金融风险', color: '#F97316' },
  { id: 12, name: '违规拆借监测模型', category: '财务监督', status: 'active', version: 'v1.0.6', accuracy: '90.3%', lastRun: '2025-06-08', description: '监控资金拆借行为，识别违规拆借风险', color: '#38BDF8' },
  { id: 13, name: '账款拖欠监测模型', category: '财务监督', status: 'active', version: 'v1.0.4', accuracy: '84.7%', lastRun: '2025-06-07', description: '监控应付账款账龄，预警账款拖欠风险', color: '#8B5CF6' },
  { id: 14, name: '资产权属不清监测', category: '财务监督', status: 'inactive', version: 'v0.8.5', accuracy: '--', lastRun: '--', description: '检测资产权属不清、产权关系混乱问题', color: '#8BA4C7' },
  { id: 15, name: '资金异常流向检测', category: '财务监督', status: 'active', version: 'v1.1.2', accuracy: '87.8%', lastRun: '2025-06-06', description: '追踪资金流向，检测异常大额转账行为', color: '#EC4899' },
  { id: 16, name: '供应商画像评分模型', category: '综合', status: 'active', version: 'v1.0.0', accuracy: '91.5%', lastRun: '2025-06-05', description: '综合评估供应商风险画像，生成风险评分', color: '#2DD4BF' },
]

const CATEGORIES = ['全部', '招标采购监督', '经商办企监督', '财务监督', '综合']

export function ModelPlaza() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('全部')

  const filtered = MODELS.filter((m) => {
    const matchCat = category === '全部' || m.category === category
    const matchSearch = !search || m.name.includes(search) || m.description.includes(search)
    return matchCat && matchSearch
  })

  const activeCount = MODELS.filter((m) => m.status === 'active').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title text-[#0B1D4A]">模型广场</h1>
        <p className="mt-1 text-sm text-[#8BA4C7]">
          共 <span className="font-semibold text-[#0F2245]">{MODELS.length}</span> 个监管模型，
          <span className="text-green-500 font-medium"> {activeCount} 个</span> 已启用
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8BA4C7]" />
          <input
            type="text"
            placeholder="搜索模型名称或描述..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 rounded-md border border-[#D8E2F0] bg-white py-2 pl-9 pr-3 text-sm text-[#0F2245] placeholder:text-[#8BA4C7] focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
          />
        </div>
        <div className="flex gap-1 rounded-lg bg-[#F8FAFD] p-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                category === cat ? 'bg-[#38BDF8] text-white shadow-sm' : 'text-[#8BA4C7] hover:text-[#0F2245]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((model) => (
          <div
            key={model.id}
            className="group cursor-pointer rounded-lg bg-white p-5 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-4">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: model.color + '15', color: model.color }}
              >
                <TrendingUp size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[#0F2245] text-sm truncate">{model.name}</h3>
                  <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${model.status === 'active' ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'}`}>
                    {model.status === 'active' ? <Play size={10} /> : <Pause size={10} />}
                    {model.status === 'active' ? '启用' : '停用'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#8BA4C7] leading-relaxed line-clamp-2">{model.description}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 border-t border-[#F0F2F5] pt-3">
              <div className="text-xs text-[#8BA4C7]"><span className="text-[#0F2245] font-medium">{model.version}</span> 版本</div>
              <div className="text-xs text-[#8BA4C7]">准确率 <span className="text-[#0F2245] font-medium">{model.accuracy}</span></div>
              <div className="text-xs text-[#8BA4C7]">上次 <span className="text-[#0F2245] font-medium">{model.lastRun}</span></div>
              <span className="ml-auto rounded-full px-2 py-0.5 text-xs" style={{ backgroundColor: model.color + '12', color: model.color }}>{model.category}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-[#8BA4C7]">
          <Search size={48} className="text-[#D8E2F0]" />
          <p className="mt-4 text-sm">未找到匹配的模型</p>
        </div>
      )}
    </div>
  )
}
