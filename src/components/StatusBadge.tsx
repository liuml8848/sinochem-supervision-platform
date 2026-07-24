import { cn } from '@/lib/utils'

type RiskLevel = 'red' | 'orange' | 'yellow' | 'blue' | 'green' | 'gray'

const COLOR_MAP: Record<RiskLevel, { bg: string; text: string; border: string }> = {
  red: { bg: 'rgba(239,68,68,0.1)', text: '#EF4444', border: 'rgba(239,68,68,0.3)' },
  orange: { bg: 'rgba(249,115,22,0.1)', text: '#F97316', border: 'rgba(249,115,22,0.3)' },
  yellow: { bg: 'rgba(245,158,11,0.1)', text: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
  blue: { bg: 'rgba(56,189,248,0.1)', text: '#38BDF8', border: 'rgba(56,189,248,0.3)' },
  green: { bg: 'rgba(45,212,191,0.1)', text: '#2DD4BF', border: 'rgba(45,212,191,0.3)' },
  gray: { bg: 'rgba(139,164,199,0.1)', text: '#8BA4C7', border: 'rgba(139,164,199,0.3)' },
}

interface StatusBadgeProps {
  level?: RiskLevel
  label: string
  className?: string
  size?: 'sm' | 'md'
}

export function StatusBadge({ level = 'gray', label, className, size = 'sm' }: StatusBadgeProps) {
  const colors = COLOR_MAP[level]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: '1px solid ' + colors.border,
      }}
    >
      {label}
    </span>
  )
}

const LABEL_MAP: Record<string, { level: RiskLevel; label: string }> = {
  high: { level: 'red', label: '高风险' },
  medium: { level: 'yellow', label: '中风险' },
  low: { level: 'blue', label: '低风险' },
  red: { level: 'red', label: '红色预警' },
  orange: { level: 'orange', label: '橙色预警' },
  yellow: { level: 'yellow', label: '黄色预警' },
  blue: { level: 'blue', label: '蓝色预警' },
  pending: { level: 'yellow', label: '待处理' },
  processing: { level: 'blue', label: '处理中' },
  completed: { level: 'green', label: '已完成' },
  active: { level: 'green', label: '启用' },
  inactive: { level: 'gray', label: '停用' },
}

interface RiskLevelTagProps {
  level: string
  size?: 'sm' | 'md'
}

export function RiskLevelTag({ level, size = 'sm' }: RiskLevelTagProps) {
  const config = LABEL_MAP[level] || { level: 'gray' as RiskLevel, label: level }
  return <StatusBadge level={config.level} label={config.label} size={size} />
}
