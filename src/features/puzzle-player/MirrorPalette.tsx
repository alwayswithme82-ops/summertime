import type { MirrorType } from '../../core'
import { MirrorIcon } from '../../components/MirrorIcon'

/** 팔레트에서 고를 수 있는 도구: 거울 두 방향 + 지우개. */
export type PaletteTool = MirrorType | 'ERASER'

interface MirrorPaletteProps {
  selected: PaletteTool
  onSelect: (tool: PaletteTool) => void
}

/** 지우개 아이콘 — 기울어진 몸통 + 띠 + 지운 자국. */
function EraserIcon() {
  return (
    <svg className="mp-icon mp-icon--erase" width={40} height={40} viewBox="0 0 40 40" aria-hidden="true">
      <g transform="rotate(-35 20 20)">
        <rect x="9" y="14" width="22" height="13" rx="3" fill="currentColor" />
        <rect x="9" y="14" width="9" height="13" rx="3" fill="#ffffff" opacity="0.45" />
      </g>
      {/* 지운 자국 */}
      <path
        d="M8 33 H17 M20 33 H24"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}

/**
 * 하단 조작 바의 도구 선택기.
 * 빛이 꺾이는 방향은 들어오는 방향에 따라 달라지므로 화살표 없이
 * 거울 모양(/, \)만 크고 또렷하게 보여준다. 지우개는 놓은 거울을 지운다.
 */
export function MirrorPalette({ selected, onSelect }: MirrorPaletteProps) {
  return (
    <div className="mp-wrap">
      <span className="mp-title" id="mp-title">
        거울 놓기
      </span>
      <div className="mirror-palette" role="group" aria-labelledby="mp-title">
        {(['/', '\\'] as MirrorType[]).map((type) => (
          <button
            key={type}
            type="button"
            className={`mp-btn${selected === type ? ' is-selected' : ''}`}
            onClick={() => onSelect(type)}
            aria-label={type === '/' ? '/ 모양 거울 선택' : '\\ 모양 거울 선택'}
            aria-pressed={selected === type}
          >
            <MirrorIcon type={type} size={40} className="mp-icon" />
          </button>
        ))}
        <button
          type="button"
          className={`mp-btn mp-btn--erase${selected === 'ERASER' ? ' is-selected' : ''}`}
          onClick={() => onSelect('ERASER')}
          aria-label="지우개 선택 — 놓은 거울을 지워요"
          aria-pressed={selected === 'ERASER'}
        >
          <EraserIcon />
          <span className="mp-btn-caption">지우개</span>
        </button>
      </div>
      <span className="mp-hint">
        {selected === 'ERASER'
          ? '지우고 싶은 거울을 콕 누르면 지워져요'
          : '거울을 고르고 빈 칸을 콕! 계속 누르면 방향이 바뀌어요'}
      </span>
    </div>
  )
}
