import { LeaderboardEntry } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const getFullName = (firstname?: string, lastname?: string) => {
  return `${firstname || ""} ${lastname || ""}`.trim();
};

export const LeaderboardList = ({
  remainingUsers,
  isLoading,
}: {
  remainingUsers: LeaderboardEntry[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="bg-secondary w-full max-h-[400px] rounded-t-[50px] sm:rounded-[50px] sm:w-[70%] sm:max-h-[475px] p-8">
          <div className="space-y-4">
            {/* Generate 5 skeleton items */}
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="flex justify-between items-center py-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-[60px] h-[60px] rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-24 h-3" />
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Skeleton className="w-12 h-6" />
                  <Skeleton className="w-8 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="w-full h-full flex justify-center items-center text-secondary-foreground">
      <div className="bg-secondary w-full max-h-[400px] rounded-t-[50px] sm:rounded-[50px] sm:w-[70%] sm:max-h-[475px] p-8 overflow-auto">
        {remainingUsers.length > 0 ? (
          remainingUsers.map((user, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border-b border-border pb-4 mb-4 last:border-b-0 gap-4"
            >
              <div className="flex items-center flex-1 min-w-0">
                <div className="border-[3.5px] w-[60px] h-[60px] border-card flex justify-center items-center rounded-[50%] font-semibold text-xl text-secondary-foreground flex-shrink-0">
                  #{idx + 4}
                </div>
                <div className="mx-6 sm:mx-3 lg:mx-8 flex justify-center items-center text-md min-w-0 flex-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-secondary-foreground cursor-help text-center leading-tight truncate block max-w-full">
                        {getFullName(user.firstname, user.lastname)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getFullName(user.firstname, user.lastname)}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <div className="flex flex-col items-end justify-center flex-shrink-0">
                <div className="font-bold text-secondary-foreground">
                  {user.totalPoints}
                </div>
                <div className="text-xs  mt-1">
                  <TrendingUp />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-secondary-foreground">
            No additional leaderboard data available
          </div>
        )}
      </div>
    </div>
    </TooltipProvider>
  );
};
