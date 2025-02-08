import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Trophy,
  Star,
  TrendingUp,
  Award,
  BookOpen,
  GitPullRequest,
  Terminal
} from 'lucide-react'

interface Skill {
  name: string
  level: number
  category: 'frontend' | 'backend' | 'devops' | 'soft'
}

interface Achievement {
  id: string
  title: string
  description: string
  date: string
  type: 'technical' | 'collaboration' | 'learning'
  xp: number
}

const CareerHub = () => {
  const [skills] = useState<Skill[]>([
    {
      name: 'React',
      level: 75,
      category: 'frontend'
    },
    {
      name: 'Node.js',
      level: 60,
      category: 'backend'
    },
    // Add more skills
  ])

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Code Review Master',
      description: 'Completed 50 code reviews with high-quality feedback',
      date: '2024-02-07',
      type: 'technical',
      xp: 500
    },
    // Add more achievements
  ])

  const totalXP = achievements.reduce((sum, achievement) => sum + achievement.xp, 0)
  const level = Math.floor(totalXP / 1000) + 1
  const progress = (totalXP % 1000) / 10

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Career Progress</h1>
        <p className="text-muted-foreground">
          Track your growth and achievements
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <Card className="p-6 col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Level {level}</h2>
              <p className="text-sm text-muted-foreground">
                Software Engineer
              </p>
            </div>
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {totalXP} XP - Next level in {1000 - (totalXP % 1000)} XP
          </p>
        </Card>

        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Skills Progress</h3>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Recent Achievements</h3>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start space-x-3">
                  <Award className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <Badge>+{achievement.xp} XP</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Next Goals</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <GitPullRequest className="h-5 w-5 text-primary" />
                <span>Complete 10 more code reviews</span>
              </div>
              <div className="flex items-center space-x-3">
                <Terminal className="h-5 w-5 text-primary" />
                <span>Deploy 3 applications</span>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>Finish the React advanced course</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Code Reviews</span>
                <span className="font-medium">50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Deployments</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Courses Completed</span>
                <span className="font-medium">8</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CareerHub 