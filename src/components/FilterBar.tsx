import { Search } from 'lucide-react'
import { type ReactNode } from 'react'

interface FilterItem {
  key: string
  label: string
  children: ReactNode
}

interface FilterBarProps {
  filters: FilterItem[]
  onSearch?: (keyword: string) => void
  onReset?: () => void
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
}

export function FilterBar({
  filters,
  onSearch,
  onReset,
  searchPlaceholder = '搜索...',
  searchValue = '',
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg bg-[#F8FAFD] p-4">
      {filters.map((filter) => (
        <div key={filter.key} className="flex items-center gap-2">
          <label className="text-xs font-medium text-[#8BA4C7] whitespace-nowrap">
            {filter.label}
          </label>
          {filter.children}
        </div>
      ))}
      {onSearch && (
        <div className="relative ml-auto">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8BA4C7]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch(searchValue)}
            className="w-48 rounded-md border border-[#D8E2F0] bg-white py-1.5 pl-8 pr-3 text-xs text-[#0F2245] placeholder:text-[#8BA4C7] focus:border-[#38BDF8] focus:outline-none"
          />
        </div>
      )}
      {onReset && (
        <button
          onClick={onReset}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-[#8BA4C7] hover:bg-white hover:text-[#0F2245] transition-colors"
        >
          重置
        </button>
      )}
    </div>
  )
}
