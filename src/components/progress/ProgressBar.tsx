import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Trophy, Star, Zap } from 'lucide-react'

interface ProgressBarProps {
  level: number
  xp: number
  nextLevelXp: number
  showDetails?: boolean
}

export const ProgressBar = ({ level, xp, nextLevelXp, showDetails = true }: ProgressBarProps) => {
  const progress = (xp / nextLevelXp) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="font-semibold">Level {level}</span>
        </div>
        {showDetails && (
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              <Zap className="h-4 w-4 mr-1" />
              {xp} XP
            </Badge>
            <span className="text-sm text-muted-foreground">
              Next Level: {nextLevelXp - xp} XP
            </span>
          </div>
        )}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
} 