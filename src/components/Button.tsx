import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

/** 공용 버튼 (스텁 — 스타일은 이후 확장). */
export function Button({ variant = 'primary', ...props }: ButtonProps) {
  return <button className={`btn btn-${variant}`} {...props} />
}
