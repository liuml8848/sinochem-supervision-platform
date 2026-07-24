import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number | string
  suffix?: string
  trend?: 'up' | 'down' | 'flat'
  trendValue?: string
  icon?: LucideIcon
  color?: string
  className?: string
  subtitle?: string
}

export function StatCard({ title, value, suffix, trend, trendValue, icon: Icon, color = '#38BDF8', className, subtitle }: StatCardProps) {
  return (
    <div className={cn('rounded-lg bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#8BA4C7]">{title}</span>
        {Icon && (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: color + '18' }}
          >
            <Icon size={18} style={{ color }} />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-data-large text-[#0F2245] font-number">
          {typeof value === 'number' ? value.toLocaleString('zh-CN') : value}
        </span>
        {suffix && <span className="text-sm text-[#8BA4C7]">{suffix}</span>}
        {trendValue && (
          <span
            className={cn(
              'ml-1 text-xs font-medium',
              trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-[#8BA4C7]'
            )}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-[#8BA4C7]">{subtitle}</p>}
    </div>
  )
}
