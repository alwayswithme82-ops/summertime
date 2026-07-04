export interface LockIconProps {
  size?: number
  className?: string
  fill?: string
  stroke?: string
}

export default function LockIcon({
  size = 24,
  className,
  fill = '#D8B878',
  stroke = '#704721',
}: LockIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M19 29 V22 C19 12 25 7 32 7 C39 7 45 12 45 22 V29"
        fill="none"
        stroke={stroke}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="12"
        y="27"
        width="40"
        height="30"
        rx="6"
        fill={fill}
        stroke={stroke}
        strokeWidth="5"
      />
      <circle cx="32" cy="41" r="4" fill={stroke} />
      <path
        d="M32 44 V49"
        fill="none"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
