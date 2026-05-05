import { cn } from '@/lib/utils'

export function Progress({ value, className, color = 'navy' }: {
  value: number
  className?: string
  color?: 'navy' | 'brand' | 'emerald' | 'blue' | 'amber' | 'red'
}) {
  const colors = {
    navy:    'bg-navy',
    brand:   'bg-brand',
    emerald: 'bg-emerald-500',
    blue:    'bg-blue-500',
    amber:   'bg-amber-500',
    red:     'bg-red-500',
  }
  return (
    <div className={cn('h-2 w-full rounded-full bg-slate-100', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', colors[color])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
