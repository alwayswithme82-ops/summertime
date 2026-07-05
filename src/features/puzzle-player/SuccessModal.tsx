import type { Score } from '../../core'

interface SuccessModalProps {
  /** 이 문제에서 지나야 하는(=지난) 별 개수. */
  starCount: number
  score: Score | null
  /** 다음 문제로. 마지막 문제면 넘기지 않는다(버튼 숨김). */
  onNext?: () => void
  onWorldMap?: () => void
}

/** 픽셀 폭죽 조각. 각도/거리/색/지연을 미리 계산해 CSS 변수로 넘긴다. */
const FIREWORK_COLORS = ['#ffc42f', '#ff6a3d', '#0f766e', '#7c5cff', '#2f6fed']

const FIREWORK_BURSTS = [
  { x: '18%', y: '30%', delay: 0 },
  { x: '82%', y: '24%', delay: 220 },
  { x: '50%', y: '12%', delay: 440 },
]

const PARTICLES_PER_BURST = 10

function FireworkBurst({ x, y, delay }: { x: string; y: string; delay: number }) {
  return (
    <span className="sm-burst" style={{ left: x, top: y }} aria-hidden="true">
      {Array.from({ length: PARTICLES_PER_BURST }, (_, i) => {
        const angle = (i / PARTICLES_PER_BURST) * Math.PI * 2
        const dist = 34 + (i % 3) * 12
        const style = {
          '--tx': `${Math.cos(angle) * dist}px`,
          '--ty': `${Math.sin(angle) * dist}px`,
          '--pc': FIREWORK_COLORS[i % FIREWORK_COLORS.length],
          animationDelay: `${delay + (i % 4) * 45}ms`,
        } as React.CSSProperties
        return <i key={i} className="sm-particle" style={style} />
      })}
    </span>
  )
}

/** 성공 축하 모달. 실패는 배너(ResultPanel)로, 성공만 이 모달로 축하한다. */
export function SuccessModal({ starCount, score, onNext, onWorldMap }: SuccessModalProps) {
  return (
    <div className="success-backdrop" role="presentation">
      <div
        className="success-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-title"
      >
        {FIREWORK_BURSTS.map((burst) => (
          <FireworkBurst key={burst.x} {...burst} />
        ))}

        <h2 id="success-title" className="sm-title">
          성공!
        </h2>

        <div className="sm-stars" aria-label={`별 ${starCount}개 획득`}>
          {Array.from({ length: starCount }, (_, i) => (
            <span
              key={i}
              className="sm-star"
              style={{ animationDelay: `${300 + i * 180}ms` }}
              aria-hidden="true"
            >
              ★
            </span>
          ))}
        </div>

        <p className="sm-msg">빛이 별을 모두 지나 출구로 나갔어요!</p>
        {score && <p className="sm-score">점수 {score.total}점</p>}

        <div className="sm-actions">
          {onNext && (
            <button type="button" className="btn btn-primary sm-next" onClick={onNext}>
              다음 단계 ▶
            </button>
          )}
          <button type="button" className="btn btn-ghost" onClick={onWorldMap}>
            월드맵으로
          </button>
        </div>
      </div>
    </div>
  )
}
