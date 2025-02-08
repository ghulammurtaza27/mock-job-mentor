import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import confetti from 'canvas-confetti'

interface AchievementNotificationProps {
  achievement: {
    title: string
    description: string
    icon: string
    xp: number
  }
  onClose: () => void
}

export const AchievementNotification = ({ 
  achievement, 
  onClose 
}: AchievementNotificationProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (isVisible) {
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Card className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-yellow-500" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-lg">Achievement Unlocked!</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsVisible(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="font-medium text-yellow-500">{achievement.title}</p>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                
                <div className="mt-2 flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">+{achievement.xp} XP</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 