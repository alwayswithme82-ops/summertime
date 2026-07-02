import type { Puzzle } from '../core'

/**
 * 샘플 문제 모음.
 * sampleAnswer는 "예시" 정답일 뿐 판정 기준이 아니다.
 * (tests/validateSolution.test.ts 가 모든 sampleAnswer가 실제로 통과하는지 검증한다.)
 *
 * 좌표는 CellKey(열 알파벳 + 행 번호). 예: A1 = row0,col0.
 */
export const samplePuzzles: Puzzle[] = [
  {
    id: 'p1-center',
    title: '중앙 별 지나기',
    description: '빛을 꺾어 가운데 별을 지나 아래 출구로 내보내요.',
    level: 'BASIC',
    rows: 3,
    cols: 3,
    entry: { side: 'TOP', index: 1, direction: 'DOWN' },
    exit: { side: 'BOTTOM', index: 3, direction: 'DOWN' },
    stars: ['B2'],
    forbiddenCells: [],
    rule: {
      requiredStars: ['B2'],
      forbiddenCells: [],
      mirrorPlacementMode: 'ANY_EMPTY',
      maxMirrors: 4,
    },
    sampleAnswer: { A2: '\\', C2: '\\' },
  },
  {
    id: 'p2-corner',
    title: '모퉁이 돌아 내려가기',
    description: '왼쪽에서 들어온 빛을 오른쪽 별들을 지나 아래로 내보내요.',
    level: 'NORMAL',
    rows: 3,
    cols: 3,
    entry: { side: 'LEFT', index: 1, direction: 'RIGHT' },
    exit: { side: 'BOTTOM', index: 3, direction: 'DOWN' },
    stars: ['C1', 'C2'],
    forbiddenCells: ['B3'],
    rule: {
      requiredStars: ['C1', 'C2'],
      forbiddenCells: ['B3'],
      mirrorPlacementMode: 'ANY_EMPTY',
      maxMirrors: 3,
    },
    sampleAnswer: { C1: '\\' },
  },
  {
    id: 'p3-zigzag',
    title: '지그재그 미로',
    description: '두 거울로 빛을 지그재그로 꺾어 별 두 개를 지나 왼쪽으로 내보내요.',
    level: 'HARD',
    rows: 5,
    cols: 5,
    entry: { side: 'LEFT', index: 1, direction: 'RIGHT' },
    exit: { side: 'LEFT', index: 3, direction: 'LEFT' },
    stars: ['E2', 'C3'],
    forbiddenCells: ['A5'],
    rule: {
      requiredStars: ['E2', 'C3'],
      forbiddenCells: ['A5'],
      mirrorPlacementMode: 'ANY_EMPTY',
      maxMirrors: 4,
    },
    sampleAnswer: { E1: '\\', E3: '/' },
  },
]

export function getPuzzle(id: string): Puzzle | undefined {
  return samplePuzzles.find((p) => p.id === id)
}
