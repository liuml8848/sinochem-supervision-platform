import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
  headerRight?: ReactNode
  height?: number | string
}

export function ChartCard({ title, subtitle, children, className, headerRight, height }: ChartCardProps) {
  return (
    <div className={cn('rounded-lg bg-white p-5 shadow-card', className)}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#0F2245]">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-[#8BA4C7]">{subtitle}</p>}
        </div>
        {headerRight && <div>{headerRight}</div>}
      </div>
      <div style={height ? { height } : undefined}>{children}</div>
    </div>
  )
}
