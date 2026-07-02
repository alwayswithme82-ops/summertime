import type { ReactNode } from 'react'

type Tone = 'neutral' | 'success' | 'danger'

interface BadgeProps {
  children: ReactNode
  tone?: Tone
}

/** 작은 상태 배지 (스텁). */
export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}
