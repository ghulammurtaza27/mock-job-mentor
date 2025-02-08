export interface Feature {
  id: string
  title: string
  description: string
  status: 'locked' | 'available' | 'completed'
  category: 'development' | 'devops' | 'collaboration' | 'career'
  level: 'junior' | 'mid' | 'senior'
  xp: number
}

export interface WorkSimulation {
  id: string
  title: string
  description: string
  type: 'feature' | 'bug' | 'incident' | 'design'
  difficulty: 'easy' | 'medium' | 'hard'
  status: 'todo' | 'in-progress' | 'review' | 'completed'
  aiReviews: AIReview[]
  githubPR?: string
  stackblitzId?: string
}

export interface AIReview {
  id: string
  type: 'code' | 'design' | 'performance'
  feedback: string
  suggestions: string[]
  rating: number
}

export interface DevOpsTask {
  id: string
  title: string
  description: string
  type: 'deployment' | 'monitoring' | 'infrastructure'
  status: 'pending' | 'active' | 'resolved'
  alerts: Alert[]
  logs: Log[]
}

export interface TeamInteraction {
  id: string
  type: 'standup' | 'review' | 'retro'
  participants: AITeamMember[]
  messages: Message[]
  decisions: Decision[]
}

export interface CareerProgress {
  userId: string
  level: string
  xp: number
  skills: Skill[]
  achievements: Achievement[]
  performanceReviews: PerformanceReview[]
} 