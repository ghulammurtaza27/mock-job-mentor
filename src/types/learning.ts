export interface Module {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  progress: number
  lessons: number
  completed: number
  locked?: boolean
}

export interface Lesson {
  id: string
  title: string
  description: string
  type: 'video' | 'reading' | 'exercise'
  duration: number
  completed: boolean
  content: string
  exercise?: {
    instructions: string
    starterCode: string
    solution: string
    tests: string[]
  }
} 