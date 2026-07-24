import { type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'

interface Column<T> {
  key: string
  title: string
  dataIndex?: keyof T
  render?: (record: T, index: number) => ReactNode
  width?: string
  sortable?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  rowKey?: keyof T | ((record: T) => string)
  loading?: boolean
  pageSize?: number
  onRowClick?: (record: T) => void
  emptyText?: string
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  loading = false,
  pageSize = 10,
  onRowClick,
  emptyText = '暂无数据',
}: DataTableProps<T>) {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') return rowKey(record)
    if (typeof rowKey === 'string') return String(record[rowKey] ?? index)
    return String(index)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D8E2F0] border-t-[#38BDF8]" />
        <span className="ml-3 text-sm text-[#8BA4C7]">加载中...</span>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#8BA4C7]">
        <p className="text-sm">{emptyText}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[#D8E2F0]">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F8FAFD]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-medium text-[#8BA4C7] uppercase tracking-wider whitespace-nowrap"
                style={col.width ? { width: col.width } : undefined}
              >
                <div className="flex items-center gap-1">
                  {col.title}
                  {col.sortable && <ArrowUpDown size={12} className="text-[#D8E2F0]" />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, pageSize).map((record, index) => (
            <tr
              key={getRowKey(record, index)}
              onClick={() => onRowClick?.(record)}
              className={`
                border-t border-[#F0F2F5] transition-colors
                ${index % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFD]/50'}
                ${onRowClick ? 'cursor-pointer hover:bg-[#38BDF8]/5' : ''}
              `}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-sm text-[#0F2245] whitespace-nowrap"
                >
                  {col.render
                    ? col.render(record, index)
                    : col.dataIndex
                      ? String(record[col.dataIndex] ?? '')
                      : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > pageSize && (
        <div className="flex items-center justify-between border-t border-[#F0F2F5] px-4 py-3">
          <span className="text-xs text-[#8BA4C7]">
            共 {data.length} 条，显示前 {pageSize} 条
          </span>
          <div className="flex items-center gap-2">
            <button className="flex h-7 w-7 items-center justify-center rounded border border-[#D8E2F0] text-[#8BA4C7] hover:bg-[#F8FAFD]" disabled>
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs text-[#0F2245]">1</span>
            <button className="flex h-7 w-7 items-center justify-center rounded border border-[#D8E2F0] text-[#8BA4C7] hover:bg-[#F8FAFD]">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
