export interface MagnifierIconProps {
  size?: number
  className?: string
  fill?: string
  stroke?: string
}

export default function MagnifierIcon({
  size = 24,
  className,
  fill = '#DDF5F1',
  stroke = '#744821',
}: MagnifierIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="27" cy="27" r="18" fill={fill} stroke={stroke} strokeWidth="6" />
      <path
        d="M40 40 L56 56"
        fill="none"
        stroke={stroke}
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 22 C20 16 26 13 33 15"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
