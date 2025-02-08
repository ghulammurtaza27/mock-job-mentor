import { FeatureGrid } from '@/components/dashboard/FeatureGrid'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AdvancedDashboard = () => {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Simple View
        </Button>
        <h1 className="text-3xl font-bold mt-4">Advanced Dashboard</h1>
        <p className="text-muted-foreground">
          Access all development tools and resources
        </p>
      </div>

      <FeatureGrid /> {/* This would contain all the original dashboard features */}
    </div>
  )
}

export default AdvancedDashboard 