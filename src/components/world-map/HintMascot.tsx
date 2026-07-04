interface HintMascotProps {
  size?: number
  className?: string
}

export default function HintMascot({ size = 88, className }: HintMascotProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 96 112"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="48" cy="63" r="36" fill="#FFD65C" opacity="0.3" />
      <path
        d="M48 13 C43 27 19 39 19 67 C19 88 32 101 50 101 C69 101 81 88 81 68 C81 42 58 28 48 13 Z"
        fill="#FFD968"
        stroke="#8A5726"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 29 C29 35 25 44 24 53"
        fill="none"
        stroke="#FFF5B6"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.8"
      />

      <circle className="hint-mascot__eye" cx="38" cy="63" r="4" fill="#64401F" />
      <circle className="hint-mascot__eye" cx="61" cy="63" r="4" fill="#64401F" />
      <circle cx="37" cy="62" r="1.2" fill="#FFFCE8" />
      <circle cx="60" cy="62" r="1.2" fill="#FFFCE8" />

      <circle cx="31" cy="75" r="6" fill="#F28B72" opacity="0.58" />
      <circle cx="68" cy="75" r="6" fill="#F28B72" opacity="0.58" />
      <path
        d="M39 74 C43 81 55 81 60 74"
        fill="none"
        stroke="#64401F"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M77 69 C85 66 90 61 92 56"
        fill="none"
        stroke="#8A5726"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="92" cy="54" r="3" fill="#FFD968" stroke="#8A5726" strokeWidth="2" />

      <path
        d="M70 8 C71 15 75 19 82 21 C75 23 71 27 70 34 C69 27 65 23 58 21 C65 19 69 15 70 8 Z"
        fill="#FFF4A8"
        stroke="#8A5726"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
