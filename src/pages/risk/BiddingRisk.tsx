export function BiddingRisk() {
  const stats = [
    { label: '风险线索总数', value: 156 },
    { label: '高风险', value: 23 },
    { label: '中风险', value: 45 },
    { label: '低风险', value: 88 },
  ];

  const mockData = [
    { id: 1, project: '化工原料集中采购项目', type: '围标串标', dept: '化工事业部', person: '王某某', level: '高风险', levelColor: '#EF4444', status: '待处理', statusClass: 'bg-yellow-100 text-yellow-800', date: '2025-06-15', amount: '¥3,250万' },
    { id: 2, project: '园区基础设施改造工程', type: '违规分包', dept: '工程管理部', person: '赵某某', level: '中风险', levelColor: '#F97316', status: '处理中', statusClass: 'bg-blue-100 text-blue-800', date: '2025-06-10', amount: '¥1,860万' },
    { id: 3, project: '实验室设备采购项目', type: '供应商关联', dept: '科技发展部', person: '钱某某', level: '低风险', levelColor: '#F59E0B', status: '已完成', statusClass: 'bg-green-100 text-green-800', date: '2025-06-05', amount: '¥520万' },
    { id: 4, project: '物流运输服务招标', type: '资质造假', dept: '供应链管理部', person: '孙某某', level: '中风险', levelColor: '#F97316', status: '待处理', statusClass: 'bg-yellow-100 text-yellow-800', date: '2025-05-28', amount: '¥780万' },
    { id: 5, project: '信息化系统升级项目', type: '评标不公', dept: '信息技术部', person: '李某某', level: '高风险', levelColor: '#EF4444', status: '处理中', statusClass: 'bg-blue-100 text-blue-800', date: '2025-05-20', amount: '¥2,100万' },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-page-title text-[#0B1D4A]">招标采购监督</h1>
        <p className="text-sm text-[#8BA4C7] mt-1">对招标采购全流程进行风险监控与预警，覆盖招标、投标、评标、定标各环节</p>
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

      {/* Filter Bar */}
      <div className="rounded-lg bg-white p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-4">
          <select className="rounded-lg border border-[#D8E2F0] px-3 py-2 text-sm text-[#0F2245] bg-white outline-none focus:border-[#0B1D4A]">
            <option>全部问题类型</option>
            <option>围标串标</option>
            <option>违规分包</option>
            <option>供应商关联</option>
            <option>资质造假</option>
            <option>评标不公</option>
          </select>
          <select className="rounded-lg border border-[#D8E2F0] px-3 py-2 text-sm text-[#0F2245] bg-white outline-none focus:border-[#0B1D4A]">
            <option>全部部门</option>
            <option>化工事业部</option>
            <option>工程管理部</option>
            <option>科技发展部</option>
            <option>供应链管理部</option>
            <option>信息技术部</option>
          </select>
          <select className="rounded-lg border border-[#D8E2F0] px-3 py-2 text-sm text-[#0F2245] bg-white outline-none focus:border-[#0B1D4A]">
            <option>全部预警级别</option>
            <option>高风险</option>
            <option>中风险</option>
            <option>低风险</option>
          </select>
          <div className="flex-1 min-w-[200px]">
            <input
              className="w-full rounded-lg border border-[#D8E2F0] px-3 py-2 text-sm text-[#0F2245] placeholder-[#8BA4C7] outline-none focus:border-[#0B1D4A]"
              placeholder="搜索项目名称..."
            />
          </div>
          <button className="rounded-lg bg-[#0B1D4A] px-5 py-2 text-sm text-white hover:opacity-90 transition-opacity">查询</button>
          <button className="rounded-lg border border-[#D8E2F0] px-5 py-2 text-sm text-[#0F2245] hover:bg-[#F8FAFD] transition-colors">重置</button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg bg-white shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#D8E2F0] flex items-center justify-between">
          <h3 className="font-semibold text-[#0F2245]">风险线索列表</h3>
          <span className="text-xs text-[#8BA4C7]">共 {mockData.length} 条</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8FAFD] border-b border-[#D8E2F0]">
                {['序号', '项目名称', '问题类型', '部门', '责任人', '预警级别', '状态', '发现日期', '涉及金额'].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-sm font-medium text-[#8BA4C7] whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockData.map((row) => (
                <tr key={row.id} className="border-b border-[#D8E2F0] hover:bg-[#F8FAFD] transition-colors cursor-pointer">
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{row.id}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245] font-medium">{row.project}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{row.type}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{row.dept}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{row.person}</td>
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
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{row.date}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245] font-medium">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-6 py-3 border-t border-[#D8E2F0] flex items-center justify-between">
          <span className="text-xs text-[#8BA4C7]">显示 1-5 条，共 156 条</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-xs border border-[#D8E2F0] rounded text-[#8BA4C7] hover:bg-[#F8FAFD]">上一页</button>
            <button className="px-3 py-1 text-xs bg-[#0B1D4A] text-white rounded">1</button>
            <button className="px-3 py-1 text-xs border border-[#D8E2F0] rounded text-[#0F2245] hover:bg-[#F8FAFD]">2</button>
            <button className="px-3 py-1 text-xs border border-[#D8E2F0] rounded text-[#0F2245] hover:bg-[#F8FAFD]">3</button>
            <button className="px-3 py-1 text-xs border border-[#D8E2F0] rounded text-[#8BA4C7] hover:bg-[#F8FAFD]">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}
