'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import {
  ELEMENT_COLOR,
  ELEMENT_LABEL,
  SUIT_ELEMENT,
  SUIT_SYMBOL,
  SUITS,
  rankLabel,
} from '@/lib/game/cards'
import type { Card, Suit } from '@/lib/game/types'
import { Button } from '@/components/ui/button'
import { CardView } from './card-view'
import { cn } from '@/lib/utils'

interface Props {
  open: boolean
  hand: Card[]
  onConfirm: (cardId: string, rank: number, suit: Suit) => void
  onClose: () => void
}

export function RewriteDialog({ open, hand, onConfirm, onClose }: Props) {
  const [cardId, setCardId] = useState<string | null>(null)
  const [rank, setRank] = useState(1)
  const [suit, setSuit] = useState<Suit>('hearts')

  if (!open) return null

  const ranks = Array.from({ length: 13 }, (_, i) => i + 1)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center">
      <div className="anim-popin flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-gold/50 bg-popover text-popover-foreground shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-display text-base text-gold">カード書き換え</h2>
          <Button size="icon" variant="ghost" onClick={onClose} aria-label="閉じる">
            <X className="size-5" />
          </Button>
        </div>

        <div className="space-y-4 overflow-y-auto px-4 py-4">
          <div>
            <p className="mb-2 text-xs font-bold text-muted-foreground">
              1. 書き換えるカードを選ぶ
            </p>
            <div className="grid grid-cols-7 gap-1.5">
              {hand.map((c) => (
                <CardView
                  key={c.id}
                  card={c}
                  selected={cardId === c.id}
                  onClick={() => setCardId(c.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-muted-foreground">2. 数字を選ぶ</p>
            <div className="grid grid-cols-7 gap-1.5">
              {ranks.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRank(r)}
                  className={cn(
                    'rounded-md border py-2 font-display text-sm transition-colors',
                    rank === r
                      ? 'border-gold bg-gold text-primary-foreground'
                      : 'border-border bg-card text-foreground hover:bg-secondary',
                  )}
                >
                  {rankLabel(r)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-muted-foreground">
              3. 属性（マーク）を選ぶ
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {SUITS.map((s) => {
                const el = SUIT_ELEMENT[s]
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSuit(s)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-md border py-2 transition-colors',
                      suit === s
                        ? 'border-gold ring-2 ring-gold'
                        : 'border-border hover:bg-secondary',
                    )}
                    style={{ backgroundColor: suit === s ? undefined : undefined }}
                  >
                    <span
                      className="text-xl leading-none"
                      style={{ color: ELEMENT_COLOR[el] }}
                    >
                      {SUIT_SYMBOL[s]}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {ELEMENT_LABEL[el]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-border p-3">
          <Button
            className="w-full font-display"
            disabled={!cardId}
            onClick={() => {
              if (cardId) {
                onConfirm(cardId, rank, suit)
                onClose()
                setCardId(null)
              }
            }}
          >
            {cardId ? `${rankLabel(rank)} ${SUIT_SYMBOL[suit]} に書き換える` : 'カードを選んでください'}
          </Button>
        </div>
      </div>
    </div>
  )
}
