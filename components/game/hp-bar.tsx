'use client'

import { cn } from '@/lib/utils'

interface Props {
  hp: number
  maxHp: number
  className?: string
}

export function HpBar({ hp, maxHp, className }: Props) {
  const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100))
  const low = pct <= 30
  return (
    <div className={cn('w-full', className)}>
      <div className="mb-1 flex items-center justify-between text-xs font-bold text-white/90">
        <span>HP</span>
        <span className="tabular-nums">
          {Math.max(0, Math.ceil(hp))} / {maxHp}
        </span>
      </div>
      <div className="h-3.5 w-full overflow-hidden rounded-full border border-white/25 bg-black/50">
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-500 ease-out',
            low ? 'bg-danger' : 'bg-safe',
          )}
          style={{
            width: `${pct}%`,
            boxShadow: low
              ? '0 0 12px var(--danger)'
              : '0 0 12px var(--safe)',
          }}
        />
      </div>
    </div>
  )
}
