import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { 
  CodeIcon, 
  GitBranchIcon, 
  TicketIcon, 
  SprintIcon 
} from '@/components/icons'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const menuItems = [
    {
      title: 'Active Tickets',
      icon: <TicketIcon className="w-6 h-6" />,
      description: 'View and manage your current tasks',
      path: '/workspace'
    },
    {
      title: 'Code Editor',
      icon: <CodeIcon className="w-6 h-6" />,
      description: 'Write and test your code',
      path: '/editor'
    },
    {
      title: 'Sprint Planning',
      icon: <SprintIcon className="w-6 h-6" />,
      description: 'Plan and organize sprints',
      path: '/sprints'
    },
    {
      title: 'Code Reviews',
      icon: <GitBranchIcon className="w-6 h-6" />,
      description: 'Review and submit code changes',
      path: '/code-review'
    }
  ]

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Welcome back, {user?.name}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <Card 
            key={item.title}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleNavigate(item.path)}
            tabIndex={0}
            role="button"
            aria-label={`Navigate to ${item.title}`}
          >
            <div className="flex flex-col items-center text-center">
              {item.icon}
              <h2 className="text-xl font-semibold mt-4 mb-2">
                {item.title}
              </h2>
              <p className="text-gray-600 text-sm">
                {item.description}
              </p>
              <Button 
                variant="ghost" 
                className="mt-4"
                onClick={() => handleNavigate(item.path)}
              >
                Get Started
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Dashboard 