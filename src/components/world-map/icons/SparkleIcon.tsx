export interface SparkleIconProps {
  size?: number
  className?: string
  fill?: string
  stroke?: string
}

export default function SparkleIcon({
  size = 24,
  className,
  fill = '#FFE27A',
  stroke = '#8A5424',
}: SparkleIconProps) {
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
        d="M27 5 C29 18 35 25 47 28 C35 31 29 38 27 52 C25 38 19 31 7 28 C19 25 25 18 27 5 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M49 37 C50 43 53 47 59 49 C53 51 50 55 49 61 C48 55 45 51 39 49 C45 47 48 43 49 37 Z"
        fill="#FFF3B2"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
