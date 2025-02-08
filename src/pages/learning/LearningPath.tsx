import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Code2, 
  GitBranch,
  Database, 
  Layout, 
  Terminal,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  lessons: number;
  completed: number;
  locked?: boolean;
}

const LearningPath = () => {
  const navigate = useNavigate();

  const modules: Module[] = [
    {
      id: 'html-css',
      title: 'HTML & CSS Fundamentals',
      description: 'Learn the building blocks of web development',
      icon: <Layout className="h-6 w-6" />,
      progress: 100,
      lessons: 10,
      completed: 10,
    },
    {
      id: 'javascript',
      title: 'JavaScript Essentials',
      description: 'Master modern JavaScript programming',
      icon: <Code2 className="h-6 w-6" />,
      progress: 60,
      lessons: 15,
      completed: 9,
    },
    {
      id: 'git',
      title: 'Git & Version Control',
      description: 'Learn professional version control workflows',
      icon: <GitBranch className="h-6 w-6" />,
      progress: 30,
      lessons: 8,
      completed: 3,
    },
    {
      id: 'react',
      title: 'React Development',
      description: 'Build modern web applications with React',
      icon: <Code2 className="h-6 w-6" />,
      progress: 0,
      lessons: 12,
      completed: 0,
      locked: true,
    },
    // Add more modules
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Learning Path</h1>
        <p className="text-muted-foreground">
          Follow our structured curriculum to become a full-stack developer
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => (
          <Card 
            key={module.id}
            className={`p-6 ${module.locked ? 'opacity-75' : 'hover:shadow-lg'} transition-shadow`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {module.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{module.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </div>
              </div>
              {module.locked ? (
                <Lock className="h-5 w-5 text-muted-foreground" />
              ) : module.progress === 100 ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{module.completed}/{module.lessons} lessons</span>
                  <span>{module.progress}%</span>
                </div>
                <Progress value={module.progress} />
              </div>

              <Button 
                className="w-full"
                disabled={module.locked}
                onClick={() => navigate(`/learning/${module.id}`)}
              >
                {module.progress === 0 ? 'Start' : module.progress === 100 ? 'Review' : 'Continue'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LearningPath; 