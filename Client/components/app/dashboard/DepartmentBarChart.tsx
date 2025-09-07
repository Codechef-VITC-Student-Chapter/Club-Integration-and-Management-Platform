"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { departmentMap } from "@/lib/keys";
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

interface DepartmentBarChartProps {
  departmentStats: Record<
    string,
    { total: number; approved: number; pending: number; points: number }
  >;
}

const chartConfig = {
  contributions: {
    label: "Contributions",
    color: "hsl(var(--chart-1))",
  },
  points: {
    label: "Points",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function DepartmentBarChart({
  departmentStats,
}: DepartmentBarChartProps) {
  // Transform department stats into chart data
  const chartData = Object.entries(departmentStats).map(([dept, stats]) => ({
    department: departmentMap[dept as keyof typeof departmentMap] || dept,
    shortName: dept,
    contributions: stats.total,
    points: stats.points,
    approved: stats.approved,
  }));

  // Calculate total metrics for trending
  const totalContributions = chartData.reduce(
    (sum, dept) => sum + dept.contributions,
    0
  );
  const totalApproved = chartData.reduce((sum, dept) => sum + dept.approved, 0);
  const approvalRate =
    totalContributions > 0
      ? Math.round((totalApproved / totalContributions) * 100)
      : 0;

  // Find most active department
  const mostActiveDept = chartData.reduce(
    (max, dept) => (dept.contributions > max.contributions ? dept : max),
    chartData[0] || { department: "None", contributions: 0 }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Contributions</CardTitle>
        <CardDescription>
          Contribution distribution across all departments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="shortName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 5)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const dept = chartData.find((d) => d.shortName === value);
                    return dept?.department || value;
                  }}
                  formatter={(value, name) => [
                    value,
                    name === "contributions" ? " Contributions" : " Points",
                  ]}
                />
              }
            />
            <Bar
              dataKey="contributions"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {approvalRate}% approval rate overall{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Most active: {mostActiveDept.department} (
          {mostActiveDept.contributions} contributions)
        </div>
      </CardFooter>
    </Card>
  );
}

// Export with both names for backward compatibility
export { DepartmentBarChart as DepartmentRadarChart };
