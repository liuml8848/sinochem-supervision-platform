import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  if (value >= 100000000) {
    return `¥${(value / 100000000).toFixed(2)}亿`
  }
  if (value >= 10000) {
    return `¥${(value / 10000).toFixed(0)}万`
  }
  return `¥${value.toLocaleString()}`
}

export function formatNumber(value: number): string {
  return value.toLocaleString('zh-CN')
}

export function formatPercent(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}
