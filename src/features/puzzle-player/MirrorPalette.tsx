import type { MirrorType } from '../../core'
import { MirrorIcon } from '../../components/MirrorIcon'

interface MirrorPaletteProps {
  selected: MirrorType
  onSelect: (mirror: MirrorType) => void
}

const OPTIONS: { type: MirrorType; name: string; hint: string }[] = [
  { type: '/', name: '오른쪽 위', hint: '빛을 반대 방향으로 꺾어요' },
  { type: '\\', name: '오른쪽 아래', hint: '빛을 반대 방향으로 꺾어요' },
]

export function MirrorPalette({ selected, onSelect }: MirrorPaletteProps) {
  return (
    <div className="mirror-palette">
      <h3>거울 방향을 골라요</h3>
      <div className="mp-options">
        {OPTIONS.map(({ type, name, hint }) => (
          <button
            key={type}
            type="button"
            className={`mp-btn${selected === type ? ' is-selected' : ''}`}
            onClick={() => onSelect(type)}
            title={hint}
            aria-label={type === '/' ? '/ 거울 선택' : '\\ 거울 선택'}
            aria-pressed={selected === type}
          >
            <MirrorIcon type={type} size={34} />
            <span className="mp-copy">
              <span className="mp-name">{name}</span>
              <span className="mp-hint">{type} 거울</span>
            </span>
          </button>
        ))}
      </div>
      <p className="mp-tip">
        빈 칸을 누르면 거울이 놓이고, 같은 거울을 한 번 더 누르면 사라져요.
      </p>
    </div>
  )
}
