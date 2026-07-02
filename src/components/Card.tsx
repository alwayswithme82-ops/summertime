import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

/** 공용 카드 컨테이너 (스텁). */
export function Card({ children, className }: CardProps) {
  return <div className={`card${className ? ` ${className}` : ''}`}>{children}</div>
}
