export function BusinessRisk() {
  const stats = [
    { label: '线索总数', value: 89 },
    { label: '红色预警', value: 12, color: '#EF4444' },
    { label: '橙色预警', value: 25, color: '#F97316' },
    { label: '黄色预警', value: 52, color: '#F59E0B' },
  ];

  const mockData = [
    { id: 1, person: '张某某', dept: '化工事业部', position: '副总经理', company: '上海恒通贸易有限公司', type: '违规经商办企', level: '红色预警', levelColor: '#EF4444', status: '待处理', statusClass: 'bg-yellow-100 text-yellow-800' },
    { id: 2, person: '李某某', dept: '财务部', position: '财务主管', company: '深圳华信企业管理咨询有限公司', type: '利益冲突', level: '橙色预警', levelColor: '#F97316', status: '处理中', statusClass: 'bg-blue-100 text-blue-800' },
    { id: 3, person: '王某某', dept: '采购部', position: '采购经理', company: '广州瑞丰建材有限公司', type: '违规经商办企', level: '红色预警', levelColor: '#EF4444', status: '处理中', statusClass: 'bg-blue-100 text-blue-800' },
    { id: 4, person: '赵某某', dept: '信息技术部', position: '高级工程师', company: '北京智联云创科技有限公司', type: '违规兼职', level: '黄色预警', levelColor: '#F59E0B', status: '已完成', statusClass: 'bg-green-100 text-green-800' },
    { id: 5, person: '陈某某', dept: '市场部', position: '市场总监', company: '杭州博远品牌策划有限公司', type: '违规经商办企', level: '橙色预警', levelColor: '#F97316', status: '待处理', statusClass: 'bg-yellow-100 text-yellow-800' },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-page-title text-[#0B1D4A]">经商办企监督</h1>
        <p className="text-sm text-[#8BA4C7] mt-1">监督员工及关联人员违规经商办企行为，防范利益冲突与廉洁风险</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg bg-white p-5 shadow-card">
            <span className="text-sm text-[#8BA4C7]">{s.label}</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-data-large text-[#0F2245]">{s.value.toLocaleString()}</span>
              {s.color && (
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="rounded-lg bg-white p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-4">
          <select className="rounded-lg border border-[#D8E2F0] px-3 py-2 text-sm text-[#0F2245] bg-white outline-none focus:border-[#0B1D4A]">
            <option>全部违规类型</option>
            <option>违规经商办企</option>
            <option>违规兼职</option>
            <option>利益冲突</option>
          </select>
          <select className="rounded-lg border border-[#D8E2F0] px-3 py-2 text-sm text-[#0F2245] bg-white outline-none focus:border-[#0B1D4A]">
            <option>全部部门</option>
            <option>化工事业部</option>
            <option>财务部</option>
            <option>采购部</option>
            <option>信息技术部</option>
            <option>市场部</option>
          </select>
          <select className="rounded-lg border border-[#D8E2F0] px-3 py-2 text-sm text-[#0F2245] bg-white outline-none focus:border-[#0B1D4A]">
            <option>全部预警级别</option>
            <option>红色预警</option>
            <option>橙色预警</option>
            <option>黄色预警</option>
          </select>
          <div className="flex-1 min-w-[200px]">
            <input
              className="w-full rounded-lg border border-[#D8E2F0] px-3 py-2 text-sm text-[#0F2245] placeholder-[#8BA4C7] outline-none focus:border-[#0B1D4A]"
              placeholder="搜索人员姓名..."
            />
          </div>
          <button className="rounded-lg bg-[#0B1D4A] px-5 py-2 text-sm text-white hover:opacity-90 transition-opacity">查询</button>
          <button className="rounded-lg border border-[#D8E2F0] px-5 py-2 text-sm text-[#0F2245] hover:bg-[#F8FAFD] transition-colors">重置</button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg bg-white shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#D8E2F0] flex items-center justify-between">
          <h3 className="font-semibold text-[#0F2245]">经商办企风险线索</h3>
          <span className="text-xs text-[#8BA4C7]">共 {mockData.length} 条</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8FAFD] border-b border-[#D8E2F0]">
                {['序号', '人员', '部门', '职位', '涉及企业', '违规类型', '预警级别', '状态'].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-sm font-medium text-[#8BA4C7] whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockData.map((row) => (
                <tr key={row.id} className="border-b border-[#D8E2F0] hover:bg-[#F8FAFD] transition-colors cursor-pointer">
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{row.id}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245] font-medium">{row.person}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{row.dept}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{row.position}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{row.company}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-1 rounded text-xs bg-[#EDF2F9] text-[#0F2245]">{row.type}</span>
                  </td>
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
        {/* Pagination */}
        <div className="px-6 py-3 border-t border-[#D8E2F0] flex items-center justify-between">
          <span className="text-xs text-[#8BA4C7]">显示 1-5 条，共 89 条</span>
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
