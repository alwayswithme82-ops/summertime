import HintMascot from './HintMascot'

interface HintBubbleProps {
  text?: string
}

export default function HintBubble({
  text = '힌트 : 거울은 90도 방향으로 빛을 반사해요!',
}: HintBubbleProps) {
  return (
    <aside className="world-map-hint" aria-label="빛방울의 힌트">
      <HintMascot className="world-map-hint__mascot" />
      <p className="world-map-hint__bubble">{text}</p>
    </aside>
  )
}
