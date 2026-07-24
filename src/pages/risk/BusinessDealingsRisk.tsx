import { useState } from 'react';

export function BusinessDealingsRisk() {
  const [activeTab, setActiveTab] = useState<'overview' | 'model' | 'list'>('overview');

  const stats = [
    { label: '线索总数', value: 67 },
    { label: '高风险', value: 9 },
    { label: '中风险', value: 23 },
    { label: '低风险', value: 35 },
  ];

  const models = [
    {
      name: '关联交易识别模型',
      description: '基于企业工商数据和交易流水，识别关联方之间异常交易行为',
      status: '运行中',
      statusColor: '#2DD4BF',
      lastRun: '2025-06-15 23:00',
      alerts: 12,
      accuracy: '94.2%',
    },
    {
      name: '利益输送检测模型',
      description: '通过分析资金流向和定价偏差，检测潜在利益输送行为',
      status: '运行中',
      statusColor: '#2DD4BF',
      lastRun: '2025-06-15 23:00',
      alerts: 8,
      accuracy: '91.7%',
    },
    {
      name: '异常交易监控模型',
      description: '实时监控大额、频繁、异常时间节点等非常规交易行为',
      status: '运行中',
      statusColor: '#2DD4BF',
      lastRun: '2025-06-15 23:00',
      alerts: 23,
      accuracy: '88.5%',
    },
    {
      name: '往来款项分析模型',
      description: '对长期挂账、无合同往来、三方拆借等款项进行智能分析',
      status: '维护中',
      statusColor: '#F59E0B',
      lastRun: '2025-06-14 23:00',
      alerts: 5,
      accuracy: '86.3%',
    },
  ];

  const listData = [
    { id: 1, project: '化工原料采购项目', person: '王某某', company: '上海恒通贸易有限公司', amount: '¥3,250万', level: '高风险', levelColor: '#EF4444', date: '2025-06-15', status: '待处理', statusClass: 'bg-yellow-100 text-yellow-800' },
    { id: 2, project: '物流运输服务合同', person: '李某某', company: '深圳华信物流有限公司', amount: '¥780万', level: '中风险', levelColor: '#F97316', date: '2025-06-10', status: '处理中', statusClass: 'bg-blue-100 text-blue-800' },
    { id: 3, project: '设备维保服务协议', person: '张某某', company: '广州瑞丰机电有限公司', amount: '¥520万', level: '中风险', levelColor: '#F97316', date: '2025-06-05', status: '处理中', statusClass: 'bg-blue-100 text-blue-800' },
    { id: 4, project: '咨询服务采购项目', person: '赵某某', company: '北京智联咨询有限公司', amount: '¥280万', level: '低风险', levelColor: '#F59E0B', date: '2025-05-28', status: '已完成', statusClass: 'bg-green-100 text-green-800' },
    { id: 5, project: '信息化系统开发项目', person: '陈某某', company: '杭州博远科技有限公司', amount: '¥1,860万', level: '高风险', levelColor: '#EF4444', date: '2025-05-20', status: '待处理', statusClass: 'bg-yellow-100 text-yellow-800' },
  ];

  const tabs = [
    { key: 'overview' as const, label: '总览' },
    { key: 'model' as const, label: '模型分析' },
    { key: 'list' as const, label: '问题清单' },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-page-title text-[#0B1D4A]">违规业务往来</h1>
        <p className="text-sm text-[#8BA4C7] mt-1">监控企业与外部关联方之间的异常业务往来，识别隐性利益输送和违规交易</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg bg-white p-5 shadow-card">
            <span className="text-sm text-[#8BA4C7]">{s.label}</span>
            <div className="mt-1">
              <span className="text-data-large text-[#0F2245]">{s.value.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-[#D8E2F0]">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-[#0B1D4A] text-[#0B1D4A]'
                  : 'border-transparent text-[#8BA4C7] hover:text-[#0F2245] hover:border-[#D8E2F0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content: 总览 */}
      {activeTab === 'overview' && (
        <>
          {/* Risk Distribution Overview */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-lg bg-white p-6 shadow-card">
              <h3 className="font-semibold text-[#0F2245] mb-4">风险分布概览</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#0F2245] w-20">高风险</span>
                  <div className="flex-1 h-3 rounded-full bg-[#EDF2F9] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: '13.4%', backgroundColor: '#EF4444' }} />
                  </div>
                  <span className="text-sm font-medium text-[#0F2245] w-12 text-right">9</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#0F2245] w-20">中风险</span>
                  <div className="flex-1 h-3 rounded-full bg-[#EDF2F9] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: '34.3%', backgroundColor: '#F97316' }} />
                  </div>
                  <span className="text-sm font-medium text-[#0F2245] w-12 text-right">23</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#0F2245] w-20">低风险</span>
                  <div className="flex-1 h-3 rounded-full bg-[#EDF2F9] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: '52.3%', backgroundColor: '#F59E0B' }} />
                  </div>
                  <span className="text-sm font-medium text-[#0F2245] w-12 text-right">35</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-card">
              <h3 className="font-semibold text-[#0F2245] mb-4">本月趋势</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8BA4C7]">新增线索</span>
                  <span className="text-[#0F2245] font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8BA4C7]">已处理</span>
                  <span className="text-[#0F2245] font-medium">5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8BA4C7]">处理率</span>
                  <span className="text-[#0F2245] font-medium">41.7%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8BA4C7]">平均处理时长</span>
                  <span className="text-[#0F2245] font-medium">3.2天</span>
                </div>
                <div className="pt-2 border-t border-[#D8E2F0]">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8BA4C7]">涉及总金额</span>
                    <span className="text-[#0F2245] font-medium">¥6,690万</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Table */}
          <div className="rounded-lg bg-white shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-[#D8E2F0] flex items-center justify-between">
              <h3 className="font-semibold text-[#0F2245]">最新预警线索</h3>
              <button onClick={() => setActiveTab('list')} className="text-xs text-[#38BDF8] hover:underline">查看全部</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFD] border-b border-[#D8E2F0]">
                    {['序号', '涉及项目', '涉事人员', '涉及企业', '涉及金额', '预警级别', '状态'].map((col) => (
                      <th key={col} className="px-4 py-3 text-left text-sm font-medium text-[#8BA4C7] whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {listData.slice(0, 3).map((row) => (
                    <tr key={row.id} className="border-b border-[#D8E2F0] hover:bg-[#F8FAFD] transition-colors cursor-pointer">
                      <td className="px-4 py-3 text-sm text-[#0F2245]">{row.id}</td>
                      <td className="px-4 py-3 text-sm text-[#0F2245] font-medium">{row.project}</td>
                      <td className="px-4 py-3 text-sm text-[#0F2245]">{row.person}</td>
                      <td className="px-4 py-3 text-sm text-[#0F2245]">{row.company}</td>
                      <td className="px-4 py-3 text-sm text-[#0F2245] font-medium">{row.amount}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block px-2.5 py-1 rounded text-xs font-medium"
                          style={{ backgroundColor: row.levelColor + '18', color: row.levelColor }}
                        >
                          {row.level}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${row.statusClass}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Tab Content: 模型分析 */}
      {activeTab === 'model' && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {models.map((model) => (
            <div key={model.name} className="rounded-lg bg-white p-6 shadow-card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-[#0F2245]">{model.name}</h3>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium"
                  style={{ backgroundColor: model.statusColor + '18', color: model.statusColor }}
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: model.statusColor }} />
                  {model.status}
                </span>
              </div>
              <p className="text-sm text-[#8BA4C7] mb-4 leading-relaxed">{model.description}</p>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-[#D8E2F0]">
                <div>
                  <span className="text-xs text-[#8BA4C7]">最近运行</span>
                  <p className="text-sm text-[#0F2245] mt-0.5">{model.lastRun}</p>
                </div>
                <div>
                  <span className="text-xs text-[#8BA4C7]">产生预警</span>
                  <p className="text-sm text-[#0F2245] mt-0.5 font-medium">{model.alerts}条</p>
                </div>
                <div>
                  <span className="text-xs text-[#8BA4C7]">准确率</span>
                  <p className="text-sm text-[#0F2245] mt-0.5 font-medium">{model.accuracy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: 问题清单 */}
      {activeTab === 'list' && (
        <>
          {/* Filter Bar */}
          <div className="rounded-lg bg-white p-4 shadow-card">
            <div className="flex flex-wrap items-center gap-4">
              <select className="rounded-lg border border-[#D8E2F0] px-3 py-2 text-sm text-[#0F2245] bg-white outline-none focus:border-[#0B1D4A]">
                <option>全部涉及企业</option>
                <option>上海恒通贸易有限公司</option>
                <option>深圳华信物流有限公司</option>
                <option>广州瑞丰机电有限公司</option>
                <option>北京智联咨询有限公司</option>
                <option>杭州博远科技有限公司</option>
              </select>
              <select className="rounded-lg border border-[#D8E2F0] px-3 py-2 text-sm text-[#0F2245] bg-white outline-none focus:border-[#0B1D4A]">
                <option>全部预警级别</option>
                <option>高风险</option>
                <option>中风险</option>
                <option>低风险</option>
              </select>
              <select className="rounded-lg border border-[#D8E2F0] px-3 py-2 text-sm text-[#0F2245] bg-white outline-none focus:border-[#0B1D4A]">
                <option>全部状态</option>
                <option>待处理</option>
                <option>处理中</option>
                <option>已完成</option>
              </select>
              <div className="flex-1 min-w-[200px]">
                <input
                  className="w-full rounded-lg border border-[#D8E2F0] px-3 py-2 text-sm text-[#0F2245] placeholder-[#8BA4C7] outline-none focus:border-[#0B1D4A]"
                  placeholder="搜索项目名称或人员..."
                />
              </div>
              <button className="rounded-lg bg-[#0B1D4A] px-5 py-2 text-sm text-white hover:opacity-90 transition-opacity">查询</button>
              <button className="rounded-lg border border-[#D8E2F0] px-5 py-2 text-sm text-[#0F2245] hover:bg-[#F8FAFD] transition-colors">重置</button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg bg-white shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-[#D8E2F0] flex items-center justify-between">
              <h3 className="font-semibold text-[#0F2245]">问题清单</h3>
              <span className="text-xs text-[#8BA4C7]">共 {listData.length} 条</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFD] border-b border-[#D8E2F0]">
                    {['序号', '涉及项目', '涉事人员', '涉及企业', '涉及金额', '预警级别', '触发时间', '状态'].map((col) => (
                      <th key={col} className="px-4 py-3 text-left text-sm font-medium text-[#8BA4C7] whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {listData.map((row) => (
                    <tr key={row.id} className="border-b border-[#D8E2F0] hover:bg-[#F8FAFD] transition-colors cursor-pointer">
                      <td className="px-4 py-3 text-sm text-[#0F2245]">{row.id}</td>
                      <td className="px-4 py-3 text-sm text-[#0F2245] font-medium">{row.project}</td>
                      <td className="px-4 py-3 text-sm text-[#0F2245]">{row.person}</td>
                      <td className="px-4 py-3 text-sm text-[#0F2245]">{row.company}</td>
                      <td className="px-4 py-3 text-sm text-[#0F2245] font-medium">{row.amount}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block px-2.5 py-1 rounded text-xs font-medium"
                          style={{ backgroundColor: row.levelColor + '18', color: row.levelColor }}
                        >
                          {row.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#0F2245]">{row.date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${row.statusClass}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="px-6 py-3 border-t border-[#D8E2F0] flex items-center justify-between">
              <span className="text-xs text-[#8BA4C7]">显示 1-5 条，共 67 条</span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-xs border border-[#D8E2F0] rounded text-[#8BA4C7] hover:bg-[#F8FAFD]">上一页</button>
                <button className="px-3 py-1 text-xs bg-[#0B1D4A] text-white rounded">1</button>
                <button className="px-3 py-1 text-xs border border-[#D8E2F0] rounded text-[#0F2245] hover:bg-[#F8FAFD]">2</button>
                <button className="px-3 py-1 text-xs border border-[#D8E2F0] rounded text-[#0F2245] hover:bg-[#F8FAFD]">3</button>
                <button className="px-3 py-1 text-xs border border-[#D8E2F0] rounded text-[#8BA4C7] hover:bg-[#F8FAFD]">下一页</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
