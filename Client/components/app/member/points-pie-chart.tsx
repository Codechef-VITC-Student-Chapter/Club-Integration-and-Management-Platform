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
import { PieChartIcon, TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

interface PointsPieCharProps {
  chartConfig: ChartConfig;
  memberPointsData: {
    name: string;
    points: number;
    fill: string;
  }[];
  membersLength: number;
}
export function PointsPieChart({
  chartConfig,
  memberPointsData,
  membersLength,
}: PointsPieCharProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Top Members by Points
          </CardTitle>
          <CardDescription>
            Points distribution among top performing members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      `${value} points `,
                      String(name),
                    ]}
                    hideLabel
                  />
                }
              />
              <Pie
                data={memberPointsData}
                dataKey="points"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            Top {Math.min(8, membersLength)} contributors{" "}
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Showing individual points distribution among highest performers
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
