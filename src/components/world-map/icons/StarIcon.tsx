export interface StarIconProps {
  size?: number
  className?: string
  fill?: string
  stroke?: string
}

export default function StarIcon({
  size = 24,
  className,
  fill = '#FFD35A',
  stroke = '#7A4B1F',
}: StarIconProps) {
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
        d="M32 6 L39 23 L57 24 L43 36 L48 54 L32 44 L16 54 L21 36 L7 24 L25 23 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29 14 L33 25 L44 26"
        fill="none"
        stroke="#FFF3A8"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
