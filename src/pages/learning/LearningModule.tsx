import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import { CheckCircle2, Lock, PlayCircle, FileText, Code } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description: string
  type: 'video' | 'reading' | 'exercise'
  duration: number
  completed: boolean
}

interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

const modules: Record<string, Module> = {
  'html-css': {
    id: 'html-css',
    title: 'HTML & CSS Fundamentals',
    description: 'Learn the building blocks of web development',
    lessons: [
      {
        id: '1',
        title: 'Introduction to HTML',
        description: 'Learn the basics of HTML structure and elements',
        type: 'video',
        duration: 15,
        completed: true,
      },
      {
        id: '2',
        title: 'HTML Forms and Inputs',
        description: 'Create interactive forms using HTML',
        type: 'reading',
        duration: 20,
        completed: true,
      },
      {
        id: '3',
        title: 'CSS Selectors',
        description: 'Master CSS selectors and specificity',
        type: 'exercise',
        duration: 30,
        completed: false,
      },
    ],
  },
  'javascript': {
    id: 'javascript',
    title: 'JavaScript Essentials',
    description: 'Master modern JavaScript programming',
    lessons: [
      {
        id: '1',
        title: 'Variables and Data Types',
        description: 'Understanding JavaScript fundamentals',
        type: 'video',
        duration: 20,
        completed: false,
      },
      // Add more lessons
    ],
  },
}

const LessonCard = ({ lesson }: { lesson: Lesson }) => {
  const navigate = useNavigate()

  const getIcon = () => {
    switch (lesson.type) {
      case 'video':
        return <PlayCircle className="h-5 w-5 text-primary" />
      case 'reading':
        return <FileText className="h-5 w-5 text-primary" />
      case 'exercise':
        return <Code className="h-5 w-5 text-primary" />
    }
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="mt-1">{getIcon()}</div>
          <div>
            <h3 className="font-medium">{lesson.title}</h3>
            <p className="text-sm text-muted-foreground">{lesson.description}</p>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <span>{lesson.duration} min</span>
              <span className="mx-2">•</span>
              <span className="capitalize">{lesson.type}</span>
            </div>
          </div>
        </div>
        {lesson.completed ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Button variant="outline" size="sm" onClick={() => navigate(`lesson/${lesson.id}`)}>
            Start
          </Button>
        )}
      </div>
    </Card>
  )
}

const LearningModule = () => {
  const { moduleId } = useParams<{ moduleId: string }>()
  const module = moduleId ? modules[moduleId] : null

  if (!module) {
    return <div>Module not found</div>
  }

  const completedLessons = module.lessons.filter(l => l.completed).length
  const progress = (completedLessons / module.lessons.length) * 100

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
        <p className="text-muted-foreground mb-4">{module.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{completedLessons} of {module.lessons.length} lessons completed</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      </div>

      <div className="space-y-4">
        {module.lessons.map((lesson, index) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  )
}

export default LearningModule 