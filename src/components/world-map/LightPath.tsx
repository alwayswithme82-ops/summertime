export default function LightPath() {
  return (
    <svg
      className="world-map-light-path"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="world-map-light-path__halo"
        d="M 13 63 C 22 55, 26 52, 31 50 S 42 38, 50 40 S 60 60, 68 58 S 78 44, 85 47"
      />
      <path
        className="world-map-light-path__beam"
        d="M 13 63 C 22 55, 26 52, 31 50 S 42 38, 50 40 S 60 60, 68 58 S 78 44, 85 47"
      />
    </svg>
  )
}
