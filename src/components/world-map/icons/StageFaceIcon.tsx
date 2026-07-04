export interface StageFaceIconProps {
  size?: number
  className?: string
  mood?: 'happy' | 'calm' | 'locked'
}

export default function StageFaceIcon({
  size = 34,
  className,
  mood = 'happy',
}: StageFaceIconProps) {
  const isHappy = mood === 'happy'
  const isLocked = mood === 'locked'
  const faceColor = isHappy ? '#FFF0A8' : '#F7E4BE'
  const cheekColor = isHappy ? '#F29A65' : '#DFA27A'

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      opacity={isLocked ? 0.5 : 1}
    >
      <circle cx="32" cy="33" r="25" fill={faceColor} opacity="0.3" />

      <circle cx="22" cy="28" r="3.6" fill="#684224" />
      <circle cx="42" cy="28" r="3.6" fill="#684224" />
      <circle cx="21" cy="27" r="1.1" fill="#FFFBE7" />
      <circle cx="41" cy="27" r="1.1" fill="#FFFBE7" />

      <path
        d="M12.5 38 C14.5 34.5 21.5 34.5 23.5 38 C21.5 42 14.5 42 12.5 38 Z"
        fill={cheekColor}
        opacity="0.5"
      />
      <path
        d="M40.5 38 C42.5 34.5 49.5 34.5 51.5 38 C49.5 42 42.5 42 40.5 38 Z"
        fill={cheekColor}
        opacity="0.5"
      />

      <path
        d={isLocked ? 'M25 42 C29 40 35 40 39 42' : 'M24 39 C27 46 37 46 40 39'}
        fill="none"
        stroke="#684224"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 31 C31 34 31.5 36 34 36"
        fill="none"
        stroke="#8A623C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <path
        d="M14 20 C17 14 23 11 29 11"
        fill="none"
        stroke="#FFFBE8"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.65"
      />
    </svg>
  )
}
