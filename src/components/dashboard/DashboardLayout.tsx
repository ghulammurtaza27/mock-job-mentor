import { Card } from "@/components/ui/card";
import { 
  Code2, 
  BookOpen, 
  Target, 
  GitPullRequest, 
  Trophy,
  Laptop,
  Terminal,
  Users,
  AlertTriangle,
  BarChart,
  Briefcase,
  GitBranch,
  Network,
  Boxes,
  Settings,
  Bot,
  Brain,
  FileCode,
  Workflow,
  Cloud,
  Database,
  ServerCog,
  Activity,
  Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NextSteps from './NextSteps'
import { ProgressBar } from '@/components/progress/ProgressBar'
import { useProgress } from '@/contexts/ProgressContext'
import { Badge } from '@/components/ui/badge'

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  category: keyof typeof categories;
}

const FeatureCard = ({ title, description, icon, href, badge }: FeatureCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center text-center relative"
      onClick={() => navigate(href)}
      tabIndex={0}
      role="button"
      aria-label={`Open ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(href);
        }
      }}
    >
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      {badge && (
        <span className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </Card>
  );
};

const DashboardLayout = () => {
  const { progress } = useProgress()
  
  const features: FeatureCardProps[] = [
    // Development Environment
    {
      title: "Workspace Hub",
      description: "Your development dashboard",
      icon: <Laptop className="h-6 w-6" />,
      href: "/workspace-hub",
      category: 'development'
    },
    {
      title: "Code Editor",
      description: "Write and test code in real-time",
      icon: <Code2 className="h-6 w-6" />,
      href: "/editor",
      category: 'development'
    },
    {
      title: "System Design",
      description: "Practice system design challenges",
      icon: <Boxes className="h-6 w-6" />,
      href: "/system-design",
      badge: "New",
      category: 'development'
    },
    {
      title: "Git Workflow",
      description: "Learn Git best practices",
      icon: <GitBranch className="h-6 w-6" />,
      href: "/git-workflow",
      category: 'development'
    },

    // DevOps & Infrastructure
    {
      title: "Cloud Console",
      description: "Manage cloud resources",
      icon: <Cloud className="h-6 w-6" />,
      href: "/cloud",
      badge: "New",
      category: 'infrastructure'
    },
    {
      title: "Deployments",
      description: "Monitor and manage deployments",
      icon: <ServerCog className="h-6 w-6" />,
      href: "/deployments",
      category: 'infrastructure'
    },
    {
      title: "Database",
      description: "Manage database instances",
      icon: <Database className="h-6 w-6" />,
      href: "/database",
      category: 'infrastructure'
    },
    {
      title: "Infrastructure",
      description: "Infrastructure as Code",
      icon: <Boxes className="h-6 w-6" />,
      href: "/infrastructure",
      category: 'infrastructure'
    },

    // Monitoring & Alerts
    {
      title: "Monitoring",
      description: "Resource metrics and logs",
      icon: <Activity className="h-6 w-6" />,
      href: "/monitoring",
      category: 'monitoring'
    },
    {
      title: "Incidents",
      description: "Handle production issues",
      icon: <AlertTriangle className="h-6 w-6" />,
      href: "/incidents",
      category: 'monitoring'
    },
    {
      title: "Alerts",
      description: "Configure alert rules",
      icon: <Bell className="h-6 w-6" />,
      href: "/alerts",
      category: 'monitoring'
    },

    // Learning & Growth
    {
      title: "Learning Path",
      description: "Structured curriculum and exercises",
      icon: <BookOpen className="h-6 w-6" />,
      href: "/learning",
      category: 'learning'
    },
    {
      title: "AI Mentor",
      description: "Get personalized guidance",
      icon: <Brain className="h-6 w-6" />,
      href: "/mentor",
      badge: "Beta",
      category: 'learning'
    },
    {
      title: "Practice Problems",
      description: "Solve coding challenges",
      icon: <FileCode className="h-6 w-6" />,
      href: "/practice",
      category: 'learning'
    },

    // Collaboration & Review
    {
      title: "Code Review",
      description: "Get AI feedback on your code",
      icon: <GitPullRequest className="h-6 w-6" />,
      href: "/code-review",
      category: 'collaboration'
    },
    {
      title: "Sprint Planning",
      description: "Plan and track your sprints",
      icon: <Target className="h-6 w-6" />,
      href: "/sprints",
      category: 'collaboration'
    },
    {
      title: "Team Hub",
      description: "Work with AI teammates",
      icon: <Users className="h-6 w-6" />,
      href: "/team",
      category: 'collaboration'
    },

    // Career & Progress
    {
      title: "Career Progress",
      description: "Track your journey",
      icon: <BarChart className="h-6 w-6" />,
      href: "/career",
      category: 'career'
    },
    {
      title: "Interview Prep",
      description: "Practice technical interviews",
      icon: <Bot className="h-6 w-6" />,
      href: "/interview-prep",
      badge: "New",
      category: 'career'
    },
    {
      title: "Network",
      description: "Connect with developers",
      icon: <Network className="h-6 w-6" />,
      href: "/network",
      badge: "Coming Soon",
      category: 'career'
    }
  ];

  const categories = {
    development: {
      title: "Development Environment",
      description: "Write, test, and design code"
    },
    infrastructure: {
      title: "DevOps & Infrastructure",
      description: "Manage cloud resources and deployments"
    },
    monitoring: {
      title: "Monitoring & Alerts",
      description: "Monitor performance and handle incidents"
    },
    learning: {
      title: "Learning & Growth",
      description: "Build your skills and knowledge"
    },
    collaboration: {
      title: "Collaboration & Review",
      description: "Work with teams and get feedback"
    },
    career: {
      title: "Career & Progress",
      description: "Advance your career"
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
        {progress && (
          <ProgressBar 
            level={progress.level}
            xp={progress.xp}
            nextLevelXp={progress.nextLevelXp}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <NextSteps />
        </div>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Daily Streak</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Current Streak</span>
              <Badge variant="secondary">
                {progress?.streakDays || 0} days
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Tasks Completed</span>
              <Badge variant="secondary">
                {progress?.completedTasks || 0}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Categories Grid */}
      {Object.entries(categories).map(([category, { title, description }]) => (
        <div key={category} className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-1">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features
              .filter(feature => feature.category === category)
              .map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardLayout; 