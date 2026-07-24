import { useState } from 'react'
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Clock,
  Filter,
  Search,
  Building2,
  AlertTriangle,
  Bell,
} from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { StatusBadge } from '@/components/StatusBadge'
import { cn } from '@/lib/utils'

type Sentiment = 'positive' | 'negative' | 'neutral'

interface NewsItem {
  id: string
  title: string
  source: string
  date: string
  sentiment: Sentiment
  summary: string
  relatedSuppliers: string[]
  url?: string
}

const newsData: NewsItem[] = [
  {
    id: 'N001',
    title: '中化蓝天集团获评2026年度浙江省绿色制造企业',
    source: '浙江日报',
    date: '2026-07-24',
    sentiment: 'positive',
    summary: '中化蓝天集团有限公司凭借在环保技术和清洁生产方面的突出表现，成功入选浙江省2026年度绿色制造企业名单，标志着企业在可持续发展方面取得重要进展。',
    relatedSuppliers: ['中化蓝天集团有限公司'],
  },
  {
    id: 'N002',
    title: '江苏中化化工装备公司因安全事故被应急管理部门约谈',
    source: '新华日报',
    date: '2026-07-23',
    sentiment: 'negative',
    summary: '江苏省应急管理厅今日就江苏中化化工装备有限公司近期发生的生产安全事故进行约谈，要求企业立即整改，严格落实安全生产主体责任。',
    relatedSuppliers: ['江苏中化化工装备有限公司'],
  },
  {
    id: 'N003',
    title: '中化现代农业与多地政府签署战略合作协议',
    source: '农民日报',
    date: '2026-07-22',
    sentiment: 'positive',
    summary: '中化现代农业有限公司近日与山东、河南、河北三地农业农村厅签署战略合作协议，将在数字农业、智慧种植等领域开展深度合作。',
    relatedSuppliers: ['中化现代农业有限公司'],
  },
  {
    id: 'N004',
    title: '上海中化国际物流推出智慧供应链管理平台',
    source: '中国交通报',
    date: '2026-07-21',
    sentiment: 'positive',
    summary: '上海中化国际物流有限公司自主研发的智慧供应链管理平台正式上线，通过物联网和大数据技术实现物流全链条可视化追溯。',
    relatedSuppliers: ['上海中化国际物流有限公司'],
  },
  {
    id: 'N005',
    title: '中化蓝天集团子公司涉及环境污染纠纷案件',
    source: '中国环境报',
    date: '2026-07-20',
    sentiment: 'negative',
    summary: '据杭州市中级人民法院公告，中化蓝天集团旗下子公司因废水排放问题被周边居民提起环境侵权诉讼，案件将于8月初开庭审理。',
    relatedSuppliers: ['中化蓝天集团有限公司'],
  },
  {
    id: 'N006',
    title: '化工行业景气度回升，中化系供应商订单同比增长23%',
    source: '经济参考报',
    date: '2026-07-19',
    sentiment: 'neutral',
    summary: '受化工行业景气度回升影响，中化系主要供应商上半年订单总额同比增长23%，其中新能源材料相关订单增幅最为显著。',
    relatedSuppliers: ['中化蓝天集团有限公司', '江苏中化化工装备有限公司'],
  },
  {
    id: 'N007',
    title: '北京中化工程科技中标雄安新区智慧管廊项目',
    source: '中国建设报',
    date: '2026-07-18',
    sentiment: 'positive',
    summary: '北京中化工程科技有限公司成功中标雄安新区地下综合管廊智能化工程项目，合同金额约2.8亿元，项目建设周期18个月。',
    relatedSuppliers: ['北京中化工程科技有限公司'],
  },
  {
    id: 'N008',
    title: '石油价格波动加剧，中化石油销售公司利润承压',
    source: '21世纪经济报道',
    date: '2026-07-17',
    sentiment: 'negative',
    summary: '受国际原油价格剧烈波动影响，中化石油销售有限公司二季度利润环比下降18%，企业表示将通过优化采购策略缓解成本压力。',
    relatedSuppliers: ['中化石油销售有限公司'],
  },
  {
    id: 'N009',
    title: '深圳中化信息通过CMMI5级认证',
    source: '深圳特区报',
    date: '2026-07-16',
    sentiment: 'positive',
    summary: '深圳中化信息技术有限公司正式通过CMMI5级成熟度认证，标志着企业在软件研发能力、项目管理水平等方面达到国际先进水平。',
    relatedSuppliers: ['深圳中化信息技术有限公司'],
  },
  {
    id: 'N010',
    title: '行业监管趋严，化工企业环保投入持续增加',
    source: '中国化工报',
    date: '2026-07-15',
    sentiment: 'neutral',
    summary: '随着环保监管政策持续收紧，化工行业企业环保投入占比从去年同期的3.2%上升至4.8%，行业整体面临转型升级压力。',
    relatedSuppliers: ['中化蓝天集团有限公司', '江苏中化化工装备有限公司'],
  },
]

const monitoredSuppliers = [
  { name: '中化蓝天集团有限公司', alerts: 3, lastEvent: '2026-07-20', risk: 'medium' },
  { name: '江苏中化化工装备有限公司', alerts: 5, lastEvent: '2026-07-23', risk: 'high' },
  { name: '中化石油销售有限公司', alerts: 2, lastEvent: '2026-07-17', risk: 'medium' },
  { name: '北京中化工程科技有限公司', alerts: 1, lastEvent: '2026-07-18', risk: 'low' },
  { name: '上海中化国际物流有限公司', alerts: 1, lastEvent: '2026-07-21', risk: 'low' },
]

const timelineData = [
  { date: '07-24', event: '中化蓝天获评绿色制造企业', sentiment: 'positive' as Sentiment },
  { date: '07-23', event: '江苏中化装备因安全事故被约谈', sentiment: 'negative' as Sentiment },
  { date: '07-22', event: '中化现代农业签战略合作协议', sentiment: 'positive' as Sentiment },
  { date: '07-21', event: '上海中化物流上线智慧平台', sentiment: 'positive' as Sentiment },
  { date: '07-20', event: '中化蓝天子公司涉环境诉讼', sentiment: 'negative' as Sentiment },
  { date: '07-19', event: '中化系供应商订单增长23%', sentiment: 'neutral' as Sentiment },
  { date: '07-18', event: '北京中化工程中标雄安项目', sentiment: 'positive' as Sentiment },
  { date: '07-17', event: '中化石油销售利润承压', sentiment: 'negative' as Sentiment },
]

const sentimentConfig: Record<Sentiment, { label: string; level: 'green' | 'red' | 'yellow'; icon: any }> = {
  positive: { label: '正面', level: 'green', icon: TrendingUp },
  negative: { label: '负面', level: 'red', icon: TrendingDown },
  neutral: { label: '中性', level: 'yellow', icon: Minus },
}

export function PublicOpinion() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sentimentFilter, setSentimentFilter] = useState<Sentiment | 'all'>('all')
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month'>('all')

  const filteredNews = newsData.filter((item) => {
    const matchSearch =
      item.title.includes(searchQuery) ||
      item.relatedSuppliers.some((s) => s.includes(searchQuery))
    const matchSentiment = sentimentFilter === 'all' || item.sentiment === sentimentFilter

    let matchDate = true
    if (dateRange === 'week') {
      const itemDate = new Date(item.date)
      const weekAgo = new Date('2026-07-17')
      matchDate = itemDate >= weekAgo
    }
    // 'all' and 'month' both cover all data since data is within a month

    return matchSearch && matchSentiment && matchDate
  })

  const positiveCount = newsData.filter((n) => n.sentiment === 'positive').length
  const negativeCount = newsData.filter((n) => n.sentiment === 'negative').length
  const neutralCount = newsData.filter((n) => n.sentiment === 'neutral').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="供应商舆情中心"
        description="供应商相关新闻资讯与舆情监控"
      />

      {/* Sentiment Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8BA4C7]">全部资讯</span>
            <Newspaper size={16} className="text-[#38BDF8]" />
          </div>
          <p className="mt-1 font-number text-data-large text-[#0F2245]">{newsData.length}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8BA4C7]">正面</span>
            <TrendingUp size={16} className="text-[#2DD4BF]" />
          </div>
          <p className="mt-1 font-number text-data-large text-[#2DD4BF]">{positiveCount}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8BA4C7]">负面</span>
            <TrendingDown size={16} className="text-[#EF4444]" />
          </div>
          <p className="mt-1 font-number text-data-large text-[#EF4444]">{negativeCount}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8BA4C7]">中性</span>
            <Minus size={16} className="text-[#F59E0B]" />
          </div>
          <p className="mt-1 font-number text-data-large text-[#F59E0B]">{neutralCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Main Content - News List */}
        <div className="space-y-4 lg:col-span-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 rounded-lg bg-white p-3 shadow-card">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8BA4C7]" />
              <input
                type="text"
                placeholder="搜索新闻标题或供应商..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-[#D8E2F0] bg-[#EDF2F9]/50 py-1.5 pl-8 pr-3 text-xs text-[#0F2245] placeholder:text-[#8BA4C7] focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter size={14} className="text-[#8BA4C7]" />
              {(['all', 'positive', 'negative', 'neutral'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSentimentFilter(s)}
                  className={cn(
                    'rounded px-2 py-1 text-xs font-medium transition-colors',
                    sentimentFilter === s
                      ? 'bg-[#0B1D4A] text-white'
                      : 'bg-[#EDF2F9] text-[#8BA4C7] hover:bg-[#D8E2F0]'
                  )}
                >
                  {s === 'all' ? '全部' : s === 'positive' ? '正面' : s === 'negative' ? '负面' : '中性'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#8BA4C7]" />
              {(['all', 'week', 'month'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDateRange(d)}
                  className={cn(
                    'rounded px-2 py-1 text-xs font-medium transition-colors',
                    dateRange === d
                      ? 'bg-[#0B1D4A] text-white'
                      : 'bg-[#EDF2F9] text-[#8BA4C7] hover:bg-[#D8E2F0]'
                  )}
                >
                  {d === 'all' ? '全部' : d === 'week' ? '近7天' : '近30天'}
                </button>
              ))}
            </div>
          </div>

          {/* News Items */}
          <div className="space-y-3">
            {filteredNews.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg bg-white py-12 shadow-card">
                <Newspaper size={40} className="text-[#D8E2F0]" />
                <p className="mt-3 text-sm text-[#8BA4C7]">暂无匹配的舆情资讯</p>
              </div>
            ) : (
              filteredNews.map((item) => {
                const sConf = sentimentConfig[item.sentiment]
                const SentimentIcon = sConf.icon
                return (
                  <div
                    key={item.id}
                    className="rounded-lg bg-white p-4 shadow-card transition-shadow hover:shadow-card-hover"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <StatusBadge level={sConf.level} label={sConf.label} />
                          <span className="text-xs font-medium text-[#0F2245] line-clamp-1">
                            {item.title}
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-[#8BA4C7] line-clamp-2">
                          {item.summary}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-[#8BA4C7]">
                          <span className="flex items-center gap-1">
                            <Newspaper size={10} />
                            {item.source}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {item.date}
                          </span>
                          {item.relatedSuppliers.map((s) => (
                            <span
                              key={s}
                              className="inline-flex items-center gap-0.5 rounded-sm bg-[#EDF2F9] px-1.5 py-0.5 text-[#38BDF8]"
                            >
                              <Building2 size={9} />
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <SentimentIcon
                        size={20}
                        className={cn(
                          'flex-shrink-0 mt-1',
                          item.sentiment === 'positive'
                            ? 'text-[#2DD4BF]'
                            : item.sentiment === 'negative'
                            ? 'text-[#EF4444]'
                            : 'text-[#F59E0B]'
                        )}
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 lg:col-span-3">
          {/* Key Supplier Monitoring */}
          <div className="rounded-lg bg-white p-4 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Bell size={14} className="text-[#38BDF8]" />
                <h3 className="text-sm font-semibold text-[#0F2245]">重点供应商监测</h3>
              </div>
              <span className="text-xs text-[#8BA4C7]">{monitoredSuppliers.length}家</span>
            </div>
            <div className="space-y-2">
              {monitoredSuppliers.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between rounded-md border border-[#D8E2F0] px-3 py-2 transition-colors hover:bg-[#EDF2F9]/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#0F2245] truncate">{s.name}</p>
                    <p className="text-[10px] text-[#8BA4C7]">最近事件: {s.lastEvent}</p>
                  </div>
                  <div className="ml-2 flex items-center gap-2">
                    {s.alerts > 0 && (
                      <span className="flex items-center gap-0.5 rounded-full bg-[#EF4444]/10 px-1.5 py-0.5 text-[10px] text-[#EF4444]">
                        <AlertTriangle size={9} />
                        {s.alerts}
                      </span>
                    )}
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full',
                        s.risk === 'high'
                          ? 'bg-[#EF4444]'
                          : s.risk === 'medium'
                          ? 'bg-[#F59E0B]'
                          : 'bg-[#2DD4BF]'
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-lg bg-white p-4 shadow-card">
            <div className="mb-3 flex items-center gap-1.5">
              <Clock size={14} className="text-[#38BDF8]" />
              <h3 className="text-sm font-semibold text-[#0F2245]">舆情时间线</h3>
            </div>
            <div className="relative space-y-0">
              {timelineData.map((item, i) => {
                const sConf = sentimentConfig[item.sentiment]
                return (
                  <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
                    {/* Timeline connector */}
                    {i < timelineData.length - 1 && (
                      <div className="absolute left-[7px] top-4 h-full w-px bg-[#D8E2F0]" />
                    )}
                    {/* Dot */}
                    <div
                      className={cn(
                        'mt-1 h-3.5 w-3.5 flex-shrink-0 rounded-full ring-2 ring-white',
                        item.sentiment === 'positive'
                          ? 'bg-[#2DD4BF]'
                          : item.sentiment === 'negative'
                          ? 'bg-[#EF4444]'
                          : 'bg-[#F59E0B]'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#0F2245]">{item.event}</p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-[10px] text-[#8BA4C7]">{item.date}</span>
                        <span className="text-[10px] text-[#8BA4C7]">|</span>
                        <span className={cn(
                          'text-[10px]',
                          item.sentiment === 'positive' ? 'text-[#2DD4BF]' : item.sentiment === 'negative' ? 'text-[#EF4444]' : 'text-[#F59E0B]'
                        )}>
                          {sConf.label}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
