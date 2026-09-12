'use client'

import {
  ELEMENT_COLOR,
  ELEMENT_LABEL,
  SUIT_ELEMENT,
  SUIT_SYMBOL,
  cardHardValue,
  rankLabel,
} from '@/lib/game/cards'
import type { Card } from '@/lib/game/types'
import { cn } from '@/lib/utils'

interface Props {
  card: Card
  selected?: boolean
  disabled?: boolean
  showElement?: boolean
  onClick?: () => void
  className?: string
  isPair?: boolean // ★新規追加：このカードを含めたワンペアが成立しているかのフラグ
}

export function CardView({
  card,
  selected,
  disabled,
  showElement = true,
  onClick,
  className,
  isPair = false, // ★新規追加：デフォルトは false
}: Props) {
  const element = SUIT_ELEMENT[card.suit]
  const color = ELEMENT_COLOR[element]
  const label = rankLabel(card.rank)
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds'

  // ★重要：ペアが成立していて、かつこのカード自体が選択されている時に特殊演出をONにする
  const showPairEffect = isPair && selected

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`${label} ${ELEMENT_LABEL[element]} (${cardHardValue(card.rank)}点)`}
      className={cn(
        'relative flex aspect-[5/7] w-full select-none flex-col justify-between rounded-xl border-2 bg-white p-1.5 text-neutral-900 shadow-lg transition-all duration-150',
        'sm:p-2',
        // 通常の選択時：既存のゴールド枠線
        selected && !showPairEffect && '-translate-y-3 border-gold shadow-[0_0_18px_var(--gold)] ring-2 ring-gold',
        // ★新規追加：同じカード（ワンペア）選択時の超豪華なネオン＆パルスエフェクト
        showPairEffect && '-translate-y-4 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.8)] ring-4 ring-amber-400/40 animate-pulse bg-gradient-to-b from-white to-amber-50',
        // 非選択時
        !selected && 'border-white/60 hover:-translate-y-1',
        disabled && 'cursor-default opacity-95',
        className,
      )}
    >
      {/* ★新規追加：ワンペア成立時にカードの上に飛び出す「PAIR!」ポップアップバッジ */}
      {showPairEffect && (
        <div className="absolute -top-3.5 left-1/2 z-20 -translate-x-1/2 animate-bounce rounded-md bg-gradient-to-r from-amber-500 to-yellow-400 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-slate-950 shadow-md shadow-amber-500/30 whitespace-nowrap">
          PAIR!
        </div>
      )}

      {/* カード上部：数字とマーク */}
      <div className="flex items-center justify-between leading-none">
        <span
          className="font-display text-lg sm:text-xl font-bold"
          style={{ color: isRed ? '#d13b3b' : '#1b1b2b' }}
        >
          {label}
        </span>
        <span
          className="text-base leading-none sm:text-lg"
          style={{ color: isRed ? '#d13b3b' : '#1b1b2b' }}
        >
          {SUIT_SYMBOL[card.suit]}
        </span>
      </div>

      {/* カード中央：大きなマーク */}
      <span
        className="self-center text-2xl leading-none sm:text-3xl opacity-90"
        style={{ color: isRed ? '#d13b3b' : '#1b1b2b' }}
        aria-hidden
      >
        {SUIT_SYMBOL[card.suit]}
      </span>

      {/* カード下部：属性ラベルまたは逆向きマーク */}
      {showElement ? (
        <div
          className="flex items-center justify-center gap-1 rounded-md py-0.5 text-[10px] font-bold text-white sm:text-xs z-10"
          style={{ backgroundColor: color }}
        >
          {ELEMENT_LABEL[element]}
        </div>
      ) : (
        <div className="flex items-center justify-between leading-none">
          <span className="rotate-180 text-base sm:text-lg" style={{ color: isRed ? '#d13b3b' : '#1b1b2b' }} aria-hidden>
            {SUIT_SYMBOL[card.suit]}
          </span>
        </div>
      )}
    </button>
  )
}
