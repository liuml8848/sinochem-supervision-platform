import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  className?: string
  action?: React.ReactNode
}

export function EmptyState({
  title = '暂无数据',
  description = '当前没有可显示的内容',
  icon,
  className,
  action,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16', className)}>
      {icon || <Inbox size={48} className="text-[#D8E2F0]" />}
      <h3 className="mt-4 text-sm font-medium text-[#8BA4C7]">{title}</h3>
      <p className="mt-1 text-xs text-[#8BA4C7]/70">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
