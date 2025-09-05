import { Target, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface IOverview {
  points: number;
  total_contributions: number;
}

export const OverviewCard = ({ points, total_contributions }: IOverview) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Card className="border-[1px] p-2 rounded-xl">
          <div className="flex items-center gap-2">
            <Target className="text-blue-600 mr-2" size={24} />
            <div>
              <p className="text-sm text-gray-600">POINTS EARNED</p>
              <p className="text-md font-bold">{points} / 100</p>
            </div>
          </div>
        </Card>
        <Card className="border-[1px] p-2 rounded-xl">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-green-600 mr-2" size={24} />
            <div>
              <p className="text-sm text-gray-600 mb-1">TOTAL CONTRIBUTIONS</p>
              <p className="text-md font-bold">{total_contributions}</p>
            </div>
          </div>
        </Card>
      </CardContent>
    </Card>
  )
}