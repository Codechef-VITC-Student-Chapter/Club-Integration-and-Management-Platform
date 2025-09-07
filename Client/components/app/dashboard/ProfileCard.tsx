"use client";

import Image from "next/image";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui";
import { KpiCardProps } from "@/types";

interface ProfileCardProps {
  name: string | "Loading....";
  isLead: boolean;
  Regno: string;
  avatarUrl?: string;
  kpis: KpiCardProps[]; // List of KPI metrics
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  isLead,
  Regno,
  avatarUrl,
  kpis,
}) => {
  return (
    <Card className="rounded-xl shadow-sm">
      {/* Profile Section */}
      <CardHeader className="flex flex-row items-center space-y-0 pb-4 gap-4">
        <div className="flex items-center gap-4">
          <Image
            src={avatarUrl ?? "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
            alt={name}
            width={56}
            height={56}
            className="rounded-full"
          />
          <div>
            <CardTitle className="text-lg font-bold text-gray-800">
              {name}
            </CardTitle>
            <p className="text-sm text-gray-500">{Regno}</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {isLead ? "Lead" : "Member"}
        </Badge>
      </CardHeader>

      {/* KPI Section */}
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {kpis.map((kpi, idx) => (
            <TooltipProvider key={idx}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition">
                    <div className="bg-gray-100 p-2 rounded-lg">{kpi.icon}</div>
                    <div>
                      <p className="text-[0.65rem] text-gray-500 font-medium uppercase">
                        {kpi.title}
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        {kpi.value}
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{kpi.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
