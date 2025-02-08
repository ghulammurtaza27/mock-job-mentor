import { Card } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import type { WorkspaceMetrics } from '@/types/workspace'

interface MetricsDashboardProps {
  metrics: WorkspaceMetrics
  velocityData: Array<{ date: string; points: number }>
}

const MetricsDashboard = ({ metrics, velocityData }: MetricsDashboardProps) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  const statusData = Object.entries(metrics.ticketsByStatus).map(([key, value]) => ({
    name: key,
    value
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Completed Tickets</h3>
        <p className="text-2xl font-bold mt-2">{metrics.completedTickets}</p>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Story Points Completed</h3>
        <p className="text-2xl font-bold mt-2">
          {metrics.completedPoints} / {metrics.totalPoints}
        </p>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Avg. Time to Complete</h3>
        <p className="text-2xl font-bold mt-2">{metrics.avgTimeToComplete}h</p>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
        <p className="text-2xl font-bold mt-2">
          {Math.round((metrics.completedPoints / metrics.totalPoints) * 100)}%
        </p>
      </Card>

      <Card className="p-4 col-span-full lg:col-span-2">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Velocity Trend</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={velocityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="points" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4 col-span-full lg:col-span-2">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Tickets by Status</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

export default MetricsDashboard 