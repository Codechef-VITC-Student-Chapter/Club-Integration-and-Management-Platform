"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const COLORS = ["#4079DA", "#E5E7EB"]; // acc-primary for completed, gray for pending

interface PointsBreakDownProps {
  pointsData: number;
}

export const PointsBreakDown: React.FC<PointsBreakDownProps> = ({
  pointsData,
}) => {
  const data = [
    { name: "Completed", value: pointsData },
    { name: "Pending", value: 100 - pointsData },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm w-full max-w-sm mx-auto">
      <h3 className="font-bold text-secondary mb-4 text-center">
        Points Breakdown
      </h3>

      <div className="relative w-full h-36">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              startAngle={90}
              endAngle={450}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  cursor="pointer"
                  fill={COLORS[index]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-secondary">{pointsData}</span>
          <span className="text-sm text-black">Points</span>
        </div>
      </div>

      {/* Legend with Tooltips */}
      <div className="flex justify-around mt-4 text-sm font-medium text-black">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>Completed</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{pointsData} points completed</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <span>Pending</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{100 - pointsData} points remaining</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
