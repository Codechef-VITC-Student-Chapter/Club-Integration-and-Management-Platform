import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui";
import { BarChart3, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

interface PointsBarCharProps {
  chartConfig: ChartConfig;
  pointsAnalytics: {
    chartData: {
      range: string;
      count: number;
    }[];
    totalMembers: number;
    averagePoints: number;
    highPerformers: number;
    performanceRate: number;
  };
}
export function PointsBarChart({
  chartConfig,
  pointsAnalytics,
}: PointsBarCharProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Points Distribution Analytics
          </CardTitle>
          <CardDescription>
            Member distribution across different point ranges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={pointsAnalytics.chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="range"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => [value, " Members"]}
                  />
                }
              />
              <Bar
                dataKey="count"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            {pointsAnalytics.performanceRate}% high performers (75+ points){" "}
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Average points: {pointsAnalytics.averagePoints} • High performers:{" "}
            {pointsAnalytics.highPerformers}/{pointsAnalytics.totalMembers}{" "}
            members
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
