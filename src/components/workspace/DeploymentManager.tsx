import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Cloud,
  Server,
  GitBranch,
  RefreshCw,
  CheckCircle2,
  XCircle 
} from 'lucide-react'
import { GitHubService } from '@/services/github'
import { CloudService } from '@/services/cloud'

interface DeploymentManagerProps {
  projectId: string
  repoName: string
}

export const DeploymentManager = ({ projectId, repoName }: DeploymentManagerProps) => {
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleDeploy = async () => {
    setIsDeploying(true)
    setDeploymentStatus('idle')

    try {
      // Deploy to cloud services
      const cloudService = new CloudService({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        region: process.env.AWS_REGION!
      })

      await cloudService.deployToLambda(projectId, Buffer.from('code'))
      setDeploymentStatus('success')
    } catch (error) {
      console.error('Deployment failed:', error)
      setDeploymentStatus('error')
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Deployment Manager</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GitBranch className="h-5 w-5" />
            <span>Repository: {repoName}</span>
          </div>
          <Button
            onClick={handleDeploy}
            disabled={isDeploying}
          >
            {isDeploying ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Cloud className="h-4 w-4 mr-2" />
            )}
            Deploy
          </Button>
        </div>

        {deploymentStatus !== 'idle' && (
          <div className={`flex items-center space-x-2 ${
            deploymentStatus === 'success' ? 'text-green-500' : 'text-red-500'
          }`}>
            {deploymentStatus === 'success' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <span>
              {deploymentStatus === 'success' 
                ? 'Deployment successful' 
                : 'Deployment failed'}
            </span>
          </div>
        )}
      </div>
    </Card>
  )
} 