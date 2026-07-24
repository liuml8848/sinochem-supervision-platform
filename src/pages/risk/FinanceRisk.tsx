export function FinanceRisk() {
  const stats = [
    { label: '线索总数', value: 132 },
    { label: '高风险', value: 18 },
    { label: '中风险', value: 42 },
    { label: '低风险', value: 72 },
  ];

  const mockData = [
    { id: 1, code: 'FS-2025-00012', title: '向关联方无合同拆借资金800万元', dept: '财务部', person: '李某某', amount: '¥800万', level: '高风险', levelColor: '#EF4444', status: '待处理', statusClass: 'bg-yellow-100 text-yellow-800' },
    { id: 2, code: 'FS-2025-00008', title: '大额应收账款长期挂账未催收', dept: '化工事业部', person: '张某某', amount: '¥2,350万', level: '高风险', levelColor: '#EF4444', status: '处理中', statusClass: 'bg-blue-100 text-blue-800' },
    { id: 3, code: 'FS-2025-00005', title: '超预算列支办公费用280万元', dept: '综合管理部', person: '王某某', amount: '¥280万', level: '中风险', levelColor: '#F97316', status: '处理中', statusClass: 'bg-blue-100 text-blue-800' },
    { id: 4, code: 'FS-2025-00003', title: '虚构咨询业务套取资金120万元', dept: '市场部', person: '陈某某', amount: '¥120万', level: '高风险', levelColor: '#EF4444', status: '待处理', statusClass: 'bg-yellow-100 text-yellow-800' },
    { id: 5, code: 'FS-2025-00001', title: '差旅费报销凭证不合规45笔', dept: '信息技术部', person: '赵某某', amount: '¥36万', level: '低风险', levelColor: '#F59E0B', status: '已完成', statusClass: 'bg-green-100 text-green-800' },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-page-title text-[#0B1D4A]">财务监督</h1>
        <p className="text-sm text-[#8BA4C7] mt-1">对财务收支、资金往来、预算执行等情况进行全方面风险监控</p>
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
            <option>违规拆借</option>
            <option>账款拖欠</option>
            <option>预算超支</option>
            <option>虚假报销</option>
            <option>资金挪用</option>
          </select>
          <select className="rounded-lg border border-[#D8E2F0] px-3 py-2 text-sm text-[#0F2245] bg-white outline-none focus:border-[#0B1D4A]">
            <option>全部部门</option>
            <option>财务部</option>
            <option>化工事业部</option>
            <option>综合管理部</option>
            <option>市场部</option>
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
              placeholder="搜索问题标题或编号..."
            />
          </div>
          <button className="rounded-lg bg-[#0B1D4A] px-5 py-2 text-sm text-white hover:opacity-90 transition-opacity">查询</button>
          <button className="rounded-lg border border-[#D8E2F0] px-5 py-2 text-sm text-[#0F2245] hover:bg-[#F8FAFD] transition-colors">重置</button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg bg-white shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-[#D8E2F0] flex items-center justify-between">
          <h3 className="font-semibold text-[#0F2245]">财务监督风险线索</h3>
          <span className="text-xs text-[#8BA4C7]">共 {mockData.length} 条</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F8FAFD] border-b border-[#D8E2F0]">
                {['序号', '编号', '问题标题', '部门', '责任人', '涉及金额', '预警级别', '状态'].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-sm font-medium text-[#8BA4C7] whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockData.map((row) => (
                <tr key={row.id} className="border-b border-[#D8E2F0] hover:bg-[#F8FAFD] transition-colors cursor-pointer">
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{row.id}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245] font-mono">{row.code}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245] font-medium max-w-[280px] truncate" title={row.title}>{row.title}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{row.dept}</td>
                  <td className="px-4 py-3 text-sm text-[#0F2245]">{row.person}</td>
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
        {/* Pagination */}
        <div className="px-6 py-3 border-t border-[#D8E2F0] flex items-center justify-between">
          <span className="text-xs text-[#8BA4C7]">显示 1-5 条，共 132 条</span>
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
