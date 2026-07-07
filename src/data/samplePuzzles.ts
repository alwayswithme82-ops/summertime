import type { Puzzle } from '../core'

/**
 * 예제 문제 데이터.
 * 좌표는 CellKey(열 알파벳 + 행 번호, 1-기반). 예: A1 = row1,col1.
 * sampleAnswer는 예시일 뿐 정답 판정에 사용하지 않는다.
 */
export const samplePuzzles: Puzzle[] = [
  {
    id: 'p1',
    title: '첫 번째 반사',
    description: '빛나는 칸에 거울을 놓아 별 3개를 지나 출구로 보내요',
    level: 'NORMAL',
    rows: 5,
    cols: 5,
    entry: { side: 'TOP', index: 3, direction: 'DOWN' },
    exit: { side: 'RIGHT', index: 1, direction: 'RIGHT' },
    stars: ['A2', 'B3', 'D2'],
    forbiddenCells: ['E3', 'A5', 'E5'],
    allowedMirrorCells: ['A1', 'C1', 'D1', 'A3', 'C3', 'D3'],
    rule: {
      requiredStars: ['A2', 'B3', 'D2'],
      forbiddenCells: ['E3', 'A5', 'E5'],
      allowedMirrorCells: ['A1', 'C1', 'D1', 'A3', 'C3', 'D3'],
      mirrorPlacementMode: 'MARKED_ONLY',
      maxMirrors: 6,
    },
    sampleAnswer: { C1: '/', A1: '/', A3: '\\', D3: '/', D1: '/' },
  },
  {
    id: 'p2',
    title: '별 셋을 지나서',
    description: '빛나는 칸에 거울을 놓아 별 3개를 모두 지나요',
    level: 'NORMAL',
    rows: 5,
    cols: 5,
    entry: { side: 'LEFT', index: 4, direction: 'RIGHT' },
    exit: { side: 'TOP', index: 5, direction: 'UP' },
    stars: ['C1', 'B3', 'C4'],
    forbiddenCells: ['C2', 'A5', 'E5'],
    allowedMirrorCells: ['A1', 'E1', 'A3', 'D3', 'B4', 'D4'],
    rule: {
      requiredStars: ['C1', 'B3', 'C4'],
      forbiddenCells: ['C2', 'A5', 'E5'],
      allowedMirrorCells: ['A1', 'E1', 'A3', 'D3', 'B4', 'D4'],
      mirrorPlacementMode: 'MARKED_ONLY',
      maxMirrors: 6,
    },
    sampleAnswer: { D4: '/', D3: '\\', A3: '\\', A1: '/', E1: '/' },
  },
  {
    id: 'p3',
    title: '돌고 돌아',
    description: '빛나는 칸에 거울을 놓아 별 3개를 지나요',
    level: 'NORMAL',
    rows: 5,
    cols: 5,
    entry: { side: 'LEFT', index: 2, direction: 'RIGHT' },
    exit: { side: 'TOP', index: 3, direction: 'UP' },
    stars: ['D3', 'B4', 'C5'],
    forbiddenCells: ['E1', 'C3', 'A5'],
    allowedMirrorCells: ['B2', 'C2', 'D2', 'D4', 'B5', 'D5'],
    rule: {
      requiredStars: ['D3', 'B4', 'C5'],
      forbiddenCells: ['E1', 'C3', 'A5'],
      allowedMirrorCells: ['B2', 'C2', 'D2', 'D4', 'B5', 'D5'],
      mirrorPlacementMode: 'MARKED_ONLY',
      maxMirrors: 6,
    },
    sampleAnswer: { B2: '\\', B5: '\\', D5: '/', D2: '\\', C2: '\\' },
  },
  {
    id: 'p4',
    title: '작은 미로',
    description: '빛나는 칸에 거울을 놓아 별 2개를 지나요',
    level: 'BASIC',
    rows: 4,
    cols: 4,
    entry: { side: 'LEFT', index: 4, direction: 'RIGHT' },
    exit: { side: 'RIGHT', index: 2, direction: 'RIGHT' },
    stars: ['B4', 'C2'],
    forbiddenCells: [],
    allowedMirrorCells: ['A2', 'A3', 'D3', 'D4'],
    rule: {
      requiredStars: ['B4', 'C2'],
      forbiddenCells: [],
      allowedMirrorCells: ['A2', 'A3', 'D3', 'D4'],
      mirrorPlacementMode: 'MARKED_ONLY',
      maxMirrors: 4,
    },
    sampleAnswer: { D4: '/', D3: '\\', A3: '\\', A2: '/' },
  },
  {
    id: 'p5',
    title: '큰 미로',
    description: '거울은 딱 5개! ／3개, ＼2개로 별 5개를 모두 지나요',
    level: 'LARGE',
    rows: 7,
    cols: 7,
    entry: { side: 'LEFT', index: 2, direction: 'RIGHT' },
    exit: { side: 'TOP', index: 7, direction: 'UP' },
    stars: ['B2', 'C4', 'D5', 'E4', 'F3'],
    forbiddenCells: ['D2', 'D3', 'B5', 'G4'],
    rule: {
      requiredStars: ['B2', 'C4', 'D5', 'E4', 'F3'],
      forbiddenCells: ['D2', 'D3', 'B5', 'G4'],
      mirrorPlacementMode: 'ANY_EMPTY',
      maxMirrors: 5,
      exactMirrorCount: 5,
      requiredMirrorCounts: { slash: 3, backslash: 2 },
    },
    sampleAnswer: { C2: '\\', E3: '/', G3: '/', C5: '\\', E5: '/' },
  },
]

export function getPuzzle(id: string): Puzzle | undefined {
  return samplePuzzles.find((p) => p.id === id)
}
