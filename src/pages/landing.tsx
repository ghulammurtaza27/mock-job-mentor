import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Code2, 
  Braces, 
  GitBranch, 
  Users, 
  CheckCircle, 
  ArrowRight 
} from 'lucide-react'

const Landing = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const features = [
    {
      icon: <Code2 className="w-12 h-12 text-primary" />,
      title: 'Real Development Environment',
      description: 'Work in a fully-featured IDE with real-time code execution and debugging'
    },
    {
      icon: <Braces className="w-12 h-12 text-primary" />,
      title: 'Automated Code Reviews',
      description: 'Get instant feedback on your code quality, style, and best practices'
    },
    {
      icon: <GitBranch className="w-12 h-12 text-primary" />,
      title: 'Version Control',
      description: 'Learn Git workflows with integrated version control features'
    },
    {
      icon: <Users className="w-12 h-12 text-primary" />,
      title: 'Collaborative Learning',
      description: 'Work on projects with other developers in real-time'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Junior Developer',
      content: 'This platform helped me transition from learning to actually working like a professional developer.'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Career Switcher',
      content: 'The realistic environment and automated feedback accelerated my learning significantly.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Learn Software Engineering
          <span className="text-primary"> by Doing</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Experience what it's like to be a real software engineer. Work on realistic projects, 
          get automated code reviews, and learn best practices in a professional environment.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            size="lg"
            onClick={() => navigate('/signup')}
            className="gap-2"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Become a Better Developer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-background p-6 rounded-lg shadow-sm"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {[
              'Get assigned realistic engineering tasks',
              'Write and test your code in a professional IDE',
              'Receive instant feedback and code reviews',
              'Collaborate with other developers',
              'Build your portfolio with real projects'
            ].map((step, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 bg-muted rounded-lg"
              >
                <CheckCircle className="w-6 h-6 text-primary" />
                <span className="text-lg">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-background p-6 rounded-lg shadow-sm"
              >
                <p className="text-lg mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are improving their skills through hands-on practice.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/signup')}
            className="gap-2"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}

export default Landing