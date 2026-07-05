import type { Puzzle } from '../core'

/**
 * 튜토리얼 전용 보드. samplePuzzles 와 완전히 분리된 별도 상수다.
 *
 * 아주 쉬운 4×4: 거울 하나(B3에 '/')만 놓으면
 *   A3(입구) → B3(거울에서 위로 꺾임) → B2(별) → B1(위쪽 출구)
 * 로 빛이 별을 지나 출구로 나간다. 스텝별로 짚어주기 좋게 단순하게 구성.
 */
export const tutorialPuzzle: Puzzle = {
  id: 'tutorial',
  title: '튜토리얼',
  description: '거울 하나로 빛을 별에 통과시켜 출구로 보내요.',
  level: 'BASIC',
  rows: 4,
  cols: 4,
  entry: { side: 'LEFT', index: 3, direction: 'RIGHT' },
  exit: { side: 'TOP', index: 2, direction: 'UP' },
  stars: ['B2'],
  forbiddenCells: [],
  allowedMirrorCells: ['B3'],
  rule: {
    requiredStars: ['B2'],
    forbiddenCells: [],
    allowedMirrorCells: ['B3'],
    mirrorPlacementMode: 'MARKED_ONLY',
    maxMirrors: 1,
  },
  sampleAnswer: { B3: '/' },
}

/** 튜토리얼에서 학생이 놓아야 하는 칸과 거울 종류(안내·판정 기준). */
export const TUTORIAL_TARGET_CELL = 'B3'
export const TUTORIAL_TARGET_MIRROR = '/' as const
