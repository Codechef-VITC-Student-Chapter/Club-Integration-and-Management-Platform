import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface IPointsBreakdown {
  points: number;
  maxPoints?: number;
}

export const PointsBreakdownCard = ({ points, maxPoints = 100 }: IPointsBreakdown) => {
  const percentage = Math.min((points / maxPoints) * 100, 100);
  const circumference = 2 * Math.PI * 15.9155;
  const strokeDasharray = `${(percentage / 100) * circumference}, ${circumference}`;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Points Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            {/* Progress circle */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dasharray 0.3s ease-in-out'
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-blue-600">{points}</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="font-bold text-xl">Points Earned</p>
          <p className="text-lg text-gray-600">{points} / {maxPoints}</p>
          <div className="mt-2">
            <Progress 
              value={percentage} 
              className="h-2"
            />
            <p className="text-sm text-gray-500 mt-1">{percentage.toFixed(1)}% Complete</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}