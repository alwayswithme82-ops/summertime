import type { MirrorType } from '../../core'

interface MirrorPaletteProps {
  selected: MirrorType
  onSelect: (mirror: MirrorType) => void
}

/**
 * 거울 버튼용 미니 다이어그램.
 * 굵은 거울 대각선 + 왼쪽에서 들어온 노란 빛이 꺾여 나가는 화살표를 함께 그려서
 * "이 거울을 놓으면 빛이 이렇게 꺾인다"가 한눈에 보이게 한다.
 * ('/'는 오른쪽으로 가던 빛을 위로, '\'는 아래로 꺾는다 — core/mirror.ts 규칙과 동일)
 */
function MirrorDiagram({ type }: { type: MirrorType }) {
  const isSlash = type === '/'
  return (
    <svg
      className="mp-diagram"
      viewBox="0 0 44 44"
      role="img"
      aria-label={
        isSlash ? '/ 거울: 오른쪽으로 가던 빛을 위로 꺾어요' : '\\ 거울: 오른쪽으로 가던 빛을 아래로 꺾어요'
      }
    >
      {/* 들어오는 빛 + 꺾여 나가는 빛 (한 줄로 이어 그림) */}
      <path
        className="mp-beam"
        d={isSlash ? 'M3 22 H22 V7' : 'M3 22 H22 V37'}
        fill="none"
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 나가는 방향 화살촉 */}
      <path
        className="mp-beam"
        d={isSlash ? 'M17 11 L22 5 L27 11' : 'M17 33 L22 39 L27 33'}
        fill="none"
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 거울 대각선 */}
      <line
        className="mp-mirror-line"
        x1={isSlash ? 14 : 14}
        y1={isSlash ? 30 : 14}
        x2={isSlash ? 30 : 30}
        y2={isSlash ? 14 : 30}
        strokeWidth={5}
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * 하단 조작 바의 거울 선택기.
 * "거울 놓기" 라벨과 사용법 한 줄을 함께 보여 처음 봐도 조작법을 알 수 있게 한다.
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
            aria-label={type === '/' ? '위로 꺾는 거울 선택' : '아래로 꺾는 거울 선택'}
            aria-pressed={selected === type}
          >
            <MirrorDiagram type={type} />
          </button>
        ))}
      </div>
      <span className="mp-hint">거울을 고르고 빈 칸을 콕! 계속 누르면 거울이 바뀌어요</span>
    </div>
  )
}
