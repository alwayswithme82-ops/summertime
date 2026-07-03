import type { MirrorType } from '../../core'
import { MirrorIcon } from '../../components/MirrorIcon'

interface MirrorPaletteProps {
  selected: MirrorType
  onSelect: (mirror: MirrorType) => void
}

const OPTIONS: { type: MirrorType; hint: string }[] = [
  { type: '/', hint: '오른쪽↔위, 왼쪽↔아래' },
  { type: '\\', hint: '오른쪽↔아래, 왼쪽↔위' },
]

/** 놓을 거울 선택 팔레트. 거울은 문자 대신 SVG 대각선으로 보여준다. */
export function MirrorPalette({ selected, onSelect }: MirrorPaletteProps) {
  return (
    <div className="mirror-palette">
      <h3>거울 고르기</h3>
      <div className="mp-options">
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
      <p className="mp-tip">칸을 클릭하면 거울이 놓여요. 같은 거울을 다시 누르면 지워져요.</p>
    </div>
  )
}
