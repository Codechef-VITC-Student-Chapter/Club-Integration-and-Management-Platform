import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts"
import { Contribution } from "@/types";

interface IPointsBreakdown {
  contributions: Contribution[];
  maxPoints?: number;
}

export const PointsBreakdownCard = ({ contributions, maxPoints = 100 }: IPointsBreakdown) => {
  const approvedContributions = contributions.filter(c => c.status.toLowerCase() === 'approved');
  const pendingContributions = contributions.filter(c => c.status.toLowerCase() === 'pending');
  const rejectedContributions = contributions.filter(c => c.status.toLowerCase() === 'rejected');

  // Calculate points for each status
  const approvedPoints = contributions
    .filter(c => c.status.toLowerCase() === 'approved')
    .reduce((sum, c) => sum + c.points, 0);
    
  const pendingPoints = contributions
    .filter(c => c.status.toLowerCase() === 'pending')
    .reduce((sum, c) => sum + c.points, 0);
    
  const rejectedPoints = contributions
    .filter(c => c.status.toLowerCase() === 'rejected')
    .reduce((sum, c) => sum + c.points, 0);
    
  const totalPoints = approvedPoints + pendingPoints + rejectedPoints;

  // Calculate percentages for the progress bar
  const approvedPercentage = totalPoints > 0 ? (approvedPoints / totalPoints) * 100 : 0;
  const pendingPercentage = totalPoints > 0 ? (pendingPoints / totalPoints) * 100 : 0;
  const rejectedPercentage = totalPoints > 0 ? (rejectedPoints / totalPoints) * 100 : 0;

  // Calculate circular progress
  const overallPercentage = (approvedPoints / maxPoints) * 100;

  // Data for radial chart
  const chartData = [
    {
      name: "points",
      value: overallPercentage,
      fill: "#3b82f6"
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-4">
        <div className="relative h-24 flex gap-10 items-center w-full">
          <div className="relative">
            <ResponsiveContainer width={96} height={96}>
              <RadialBarChart
                cx={48}
                cy={48}
                innerRadius="70%"
                outerRadius="90%"
                startAngle={0}
                endAngle={approvedPoints / maxPoints * 360}
                data={chartData}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill="#3b82f6"
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-blue-600">{approvedPoints}</span>
            </div>
          </div>
          <p className="font-bold text-xl w-full">Points Earned</p>
        </div>
        <div className="flex-1 w-full">          
          {/* Multi-colored Progress Bar */}
          <div className="mt-3">
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              {/* Approved section (Green) */}
              <div 
                className="absolute left-0 top-0 h-full bg-green-600 transition-all duration-300"
                style={{ width: `${approvedPercentage}%` }}
              />
              {/* Pending section (Yellow) */}
              <div 
                className="absolute top-0 h-full bg-yellow-500 transition-all duration-300"
                style={{ 
                  left: `${approvedPercentage}%`,
                  width: `${pendingPercentage}%` 
                }}
              />
              {/* Rejected section (Red) */}
              <div 
                className="absolute top-0 h-full bg-red-600 transition-all duration-300"
                style={{ 
                  left: `${approvedPercentage + pendingPercentage}%`,
                  width: `${rejectedPercentage}%` 
                }}
              />
            </div>
            
            {/* Legend */}
            <div className="flex justify-between items-center mt-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-gray-600">Approved: {approvedContributions.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Pending: {pendingContributions.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="text-gray-600">Rejected: {rejectedContributions.length}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-2">{overallPercentage.toFixed(1)}% of target reached</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}