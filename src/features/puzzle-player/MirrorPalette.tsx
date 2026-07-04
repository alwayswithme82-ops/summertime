import type { MirrorType } from '../../core'
import { MirrorIcon } from '../../components/MirrorIcon'

interface MirrorPaletteProps {
  selected: MirrorType
  onSelect: (mirror: MirrorType) => void
}

const OPTIONS: { type: MirrorType; hint: string }[] = [
  { type: '/', hint: '/ 거울 · 빛을 반대 방향으로 꺾어요' },
  { type: '\\', hint: '\\ 거울 · 빛을 반대 방향으로 꺾어요' },
]

/** 하단 조작 바에서 쓰는 컴팩트 거울 선택기. 선택된 거울이 강조된다. */
export function MirrorPalette({ selected, onSelect }: MirrorPaletteProps) {
  return (
    <div className="mirror-palette" role="group" aria-label="거울 방향 선택">
      {OPTIONS.map(({ type, hint }) => (
        <button
          key={type}
          type="button"
          className={`mp-btn${selected === type ? ' is-selected' : ''}`}
          onClick={() => onSelect(type)}
          title={hint}
          aria-label={type === '/' ? '/ 거울 선택' : '\\ 거울 선택'}
          aria-pressed={selected === type}
        >
          <MirrorIcon type={type} size={30} />
        </button>
      ))}
    </div>
  )
}
