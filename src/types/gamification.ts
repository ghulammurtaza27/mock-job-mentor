export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type SkillCategory = 'frontend' | 'backend' | 'devops' | 'softskills'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: string
  xp: number
  unlockedAt?: string
}

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  level: SkillLevel
  progress: number
  maxProgress: number
}

export interface UserProgress {
  level: number
  xp: number
  nextLevelXp: number
  skills: Skill[]
  achievements: Achievement[]
  streakDays: number
  completedTasks: number
}

export interface LearningPath {
  id: string
  title: string
  description: string
  steps: LearningStep[]
  requiredSkills: Skill[]
  unlockRequirements?: {
    level?: number
    achievements?: string[]
  }
}

export interface LearningStep {
  id: string
  title: string
  description: string
  type: 'lesson' | 'practice' | 'project'
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  xpReward: number
  duration: string
  prerequisites?: string[]
} 