export type StageDifficulty = 'basic' | 'normal' | 'large'

export interface StageDefinition {
  number: number
  puzzleId: string
  x: number
  y: number
  difficulty: StageDifficulty
  difficultyLabel: string
}

export const stages: StageDefinition[] = [
  { number: 1, puzzleId: 'p4', x: 13, y: 63, difficulty: 'basic', difficultyLabel: '기초' },
  { number: 2, puzzleId: 'p1', x: 31, y: 50, difficulty: 'normal', difficultyLabel: '보통' },
  { number: 3, puzzleId: 'p2', x: 50, y: 40, difficulty: 'normal', difficultyLabel: '보통' },
  { number: 4, puzzleId: 'p3', x: 68, y: 58, difficulty: 'normal', difficultyLabel: '보통' },
  { number: 5, puzzleId: 'p5', x: 85, y: 47, difficulty: 'large', difficultyLabel: '대형' },
]
