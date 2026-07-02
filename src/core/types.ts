/**
 * 빛 반사 설계 활동 — 핵심 도메인 타입.
 *
 * UI/테스트와 무관한 순수 데이터 정의만 둔다.
 * 여기의 타입은 시뮬레이션 엔진(core)과 화면(features), 테스트가 공유한다.
 */

/* ------------------------------------------------------------------ *
 * 방향 / 거울
 * ------------------------------------------------------------------ */

/** 빛이 진행하는 방향. 화면 기준 y(행)는 아래로 갈수록 커진다. */
export type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'

/**
 * 거울 종류.
 * 반사는 들어오는 방향에 따라 달라진다(mirror.ts 참고).
 * '/'를 "위 거울", '\\'를 "아래 거울"이라고 부르지 않는다.
 */
export type MirrorType = '/' | '\\'

/* ------------------------------------------------------------------ *
 * 좌표
 * ------------------------------------------------------------------ */

/**
 * 사람이 읽는 칸 이름. 열 알파벳 + 행 번호(1-기반) 형식.
 * 예: "A1"(열 A=0, 행 0), "B3", "G7".
 * (실제 계산은 Position으로 하고, 화면 표시/문제 정의는 CellKey로 한다.)
 */
export type CellKey = string

/** 격자 위 한 칸의 위치. row=행 인덱스(0-기반), col=열 인덱스(0-기반). */
export interface Position {
  row: number
  col: number
}

/* ------------------------------------------------------------------ *
 * 입구 / 출구 (격자 가장자리의 점)
 * ------------------------------------------------------------------ */

/** 격자의 네 변. */
export type EdgeSide = 'TOP' | 'RIGHT' | 'BOTTOM' | 'LEFT'

/**
 * 격자 가장자리의 한 점(입구/출구).
 * - side: 어느 변에 붙어 있는지
 * - index: 그 변을 따라가는 위치. TOP/BOTTOM이면 열 인덱스, LEFT/RIGHT면 행 인덱스.
 * - direction: 빛이 진행하는 방향(입구는 격자 안쪽으로, 출구는 바깥쪽으로).
 */
export interface EdgePoint {
  side: EdgeSide
  index: number
  direction: Direction
}

/* ------------------------------------------------------------------ *
 * 문제 정의
 * ------------------------------------------------------------------ */

/** 문제 난이도 단계. */
export type PuzzleLevel = 'BASIC' | 'NORMAL' | 'HARD' | 'LARGE'

/**
 * 거울을 놓을 수 있는 칸 규칙.
 * - MARKED_ONLY: allowedMirrorCells에 표시된 칸에만 놓을 수 있다.
 * - ANY_EMPTY: 비어 있는(별/금지/입출구가 아닌) 어떤 칸에도 놓을 수 있다.
 */
export type MirrorPlacementMode = 'MARKED_ONLY' | 'ANY_EMPTY'

/** 거울 종류별로 정확히 몇 개를 써야 하는지(선택). */
export interface RequiredMirrorCounts {
  slash?: number
  backslash?: number
}

/**
 * 정답 판정 규칙. "무엇을 만족해야 정답인가"의 명세.
 * 정답 좌표를 고정하지 않으며, 시뮬레이션 결과가 이 규칙을 만족하면 정답이다.
 */
export interface PuzzleRule {
  /** 반드시 지나야 하는 별 칸들. */
  requiredStars: CellKey[]
  /** 지나면 안 되는 금지 칸들. */
  forbiddenCells: CellKey[]
  /** 거울을 놓을 수 있는 칸(MARKED_ONLY 모드에서 사용). */
  allowedMirrorCells?: CellKey[]
  /** 거울 배치 허용 방식. */
  mirrorPlacementMode: MirrorPlacementMode
  /** 사용할 수 있는 거울의 최대 개수. */
  maxMirrors: number
  /** 정확히 이 개수만 써야 할 때(선택). */
  exactMirrorCount?: number
  /** 거울 종류별 정확한 개수 제약(선택). */
  requiredMirrorCounts?: RequiredMirrorCounts
}

/**
 * 한 문제(퍼즐)의 전체 정의.
 * 판정 기준은 rule이며, sampleAnswer는 힌트용 예시일 뿐 판정 기준이 아니다.
 */
export interface Puzzle {
  id: string
  title: string
  description?: string
  level: PuzzleLevel
  /** 격자 행 수. */
  rows: number
  /** 격자 열 수. */
  cols: number
  /** 빛이 들어오는 가장자리 점. */
  entry: EdgePoint
  /** 빛이 나가야 하는 가장자리 점. */
  exit: EdgePoint
  /** 별 칸들(렌더링용). 판정 조건은 rule.requiredStars. */
  stars: CellKey[]
  /** 금지 칸들(렌더링용). 판정 조건은 rule.forbiddenCells. */
  forbiddenCells: CellKey[]
  /** 거울을 놓을 수 있는 칸들(MARKED_ONLY일 때 렌더링/제약용). */
  allowedMirrorCells?: CellKey[]
  /** 정답 판정 규칙. */
  rule: PuzzleRule
  /** 예시 정답. 힌트로만 쓰이며 판정 기준이 아니다. */
  sampleAnswer?: PlacedMirrors
}

/* ------------------------------------------------------------------ *
 * 학생의 거울 배치
 * ------------------------------------------------------------------ */

/** 학생이 놓은 거울들. 칸 이름 → 거울 종류. */
export type PlacedMirrors = Record<CellKey, MirrorType>

/* ------------------------------------------------------------------ *
 * 시뮬레이션 결과
 * ------------------------------------------------------------------ */

/** 빛 경로 한 스텝에서 일어난 사건. */
export type PathEvent =
  /** 입구에서 격자로 들어옴 */
  | 'ENTER'
  /** 거울에서 반사됨 */
  | 'REFLECT'
  /** 별 칸을 지남 */
  | 'STAR'
  /** 금지 칸을 지남 */
  | 'FORBIDDEN'
  /** 지정된 출구로 나감 */
  | 'EXIT'
  /** 출구가 아닌 가장자리로 나감 */
  | 'WRONG_EXIT'
  /** 격자 밖으로 벗어남 */
  | 'OUT_OF_BOUNDS'
  /** 같은 상태를 다시 만나 무한 루프 감지 */
  | 'LOOP'

/** 빛이 지나간 한 칸의 상태. */
export interface PathStep {
  cell: CellKey
  position: Position
  direction: Direction
  /** 이 칸에 거울이 있었다면 그 종류. */
  mirror?: MirrorType
  /** 이 칸에서 일어난 사건(있으면). */
  event?: PathEvent
}

/**
 * 빛 추적 결과. 좌표 정답과 비교하지 않고, 실제로 추적한 결과만 담는다.
 * 판정(ValidationResult)은 이 결과를 근거로 계산된다.
 */
export interface SimulationResult {
  /** 빛이 지나간 (칸+방향) 순서. */
  path: PathStep[]
  /** 지나간 칸들(중복 제거). */
  visitedCells: CellKey[]
  /** 지나간 별 칸들. */
  visitedStars: CellKey[]
  /** 지나간 금지 칸들. */
  hitForbidden: CellKey[]
  /** 빛이 격자 밖으로 나갔는지. */
  exited: boolean
  /** 지정된 출구(변+위치+방향)로 정확히 나갔는지. */
  exitedAtCorrectExit: boolean
  /** 격자 밖으로 나갔지만 지정 출구가 아니었는지. */
  wrongExit: boolean
  /** 출구가 아닌 곳에서 격자를 벗어났는지. */
  outOfBounds: boolean
  /** 무한 루프가 감지됐는지. */
  loopDetected: boolean
  /** 마지막으로 머문 칸(있으면). */
  finalCell?: CellKey
  /** 마지막 진행 방향(있으면). */
  finalDirection?: Direction
}

/* ------------------------------------------------------------------ *
 * 판정 결과
 * ------------------------------------------------------------------ */

/**
 * 조건 기반 정답 판정 결과.
 * - success: 모든 조건을 만족하면 true.
 * - messages: 학생에게 보여줄 안내/칭찬 메시지.
 * - errors: 실패 이유 메시지.
 * - simulation: 판정 근거가 된 시뮬레이션 결과(경로 시각화에 재사용).
 */
export interface ValidationResult {
  success: boolean
  messages: string[]
  errors: string[]
  simulation: SimulationResult
}
