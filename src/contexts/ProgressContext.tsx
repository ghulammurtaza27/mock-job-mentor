import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { UserProgress, Achievement, Skill } from '@/types/gamification'

interface ProgressContextType {
  progress: UserProgress | null
  addXP: (amount: number) => Promise<void>
  unlockAchievement: (achievementId: string) => Promise<void>
  updateSkill: (skillId: string, progress: number) => Promise<void>
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    loadUserProgress()
  }, [])

  const loadUserProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setProgress(data as UserProgress)
      } else {
        // Create initial progress for new users
        const initialProgress: Partial<UserProgress> = {
          level: 1,
          xp: 0,
          nextLevelXp: 1000,
          streakDays: 0,
          completedTasks: 0,
          skills: [],
          achievements: []
        }

        const { data: newProgress } = await supabase
          .from('user_progress')
          .insert([{ ...initialProgress, user_id: user.id }])
          .select()
          .single()

        if (newProgress) {
          setProgress(newProgress as UserProgress)
        }
      }
    } catch (error) {
      console.error('Error loading user progress:', error)
    }
  }

  const addXP = async (amount: number) => {
    if (!progress) return

    const newXP = progress.xp + amount
    const newLevel = Math.floor(newXP / 1000) + 1 // Simple leveling formula

    const updatedProgress = {
      ...progress,
      xp: newXP,
      level: newLevel,
      nextLevelXp: newLevel * 1000
    }

    setProgress(updatedProgress)

    // Update in database
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('user_progress')
        .update(updatedProgress)
        .eq('user_id', user.id)
    }
  }

  const unlockAchievement = async (achievementId: string) => {
    if (!progress) return

    const achievement = {
      ...progress.achievements.find(a => a.id === achievementId),
      unlockedAt: new Date().toISOString()
    }

    const updatedProgress = {
      ...progress,
      achievements: [
        ...progress.achievements.filter(a => a.id !== achievementId),
        achievement
      ]
    }

    setProgress(updatedProgress)

    // Update in database
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('user_progress')
        .update(updatedProgress)
        .eq('user_id', user.id)
    }
  }

  const updateSkill = async (skillId: string, newProgress: number) => {
    if (!progress) return

    const updatedSkills = progress.skills.map(skill => 
      skill.id === skillId 
        ? { ...skill, progress: Math.min(newProgress, skill.maxProgress) }
        : skill
    )

    const updatedProgress = {
      ...progress,
      skills: updatedSkills
    }

    setProgress(updatedProgress)

    // Update in database
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('user_progress')
        .update(updatedProgress)
        .eq('user_id', user.id)
    }
  }

  return (
    <ProgressContext.Provider value={{
      progress,
      addXP,
      unlockAchievement,
      updateSkill
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export const useProgress = () => {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
} 