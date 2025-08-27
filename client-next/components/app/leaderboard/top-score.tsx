import { LeaderboardEntry } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const getAvatarUrl = (firstname?: string, lastname?: string) => {
  if (!firstname && !lastname) return "";
  const fullName = `${firstname || ""}+${lastname || ""}`.trim();
  return `https://avatar.iran.liara.run/username?username=${fullName}`;
};

const truncateName = (firstname?: string, lastname?: string, maxLength: number = 10) => {
  const fullName = `${firstname || ""} ${lastname || ""}`.trim();
  if (fullName.length <= maxLength) return fullName;
  return fullName.slice(0, maxLength) + "...";
};

const getFullName = (firstname?: string, lastname?: string) => {
  return `${firstname || ""} ${lastname || ""}`.trim() || "TBD";
};

export const TopScore = ({
  topThree,
  isLoading,
}: {
  topThree: LeaderboardEntry[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-center w-full h-full p-[10%] md:pb-[20%] mt-8 sm:mt-4">
        <div className="w-full h-[75%] lg:h-[90%] flex items-end justify-center">
          {/* Second Place Skeleton */}
          <div className="relative w-[30%] h-[150px] md:h-[200px] rounded-l-xl bg-secondary flex flex-col p-4">
            <div className="flex w-full flex-col items-center space-y-2">
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-12 h-6" />
            </div>
          </div>

          {/* First Place Skeleton */}
          <div className="w-[30%] h-[220px] md:h-[260px] mx-[1.5px] rounded-t-[45px] bg-secondary py-2">
            <div className="flex w-full flex-col items-center space-y-2 p-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-16 h-6" />
            </div>
          </div>

          {/* Third Place Skeleton */}
          <div className="w-[30%] h-[125px] md:h-[175px] rounded-r-xl bg-secondary flex flex-col p-4">
            <div className="flex w-full flex-col items-center space-y-2">
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-12 h-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [first, second, third] = topThree;

  return (
    <TooltipProvider>
      <div className="flex items-center justify-center text-center text-card-foreground w-full h-full p-[10%] md:pb-[20%] mt-8 sm:mt-4">
      <div className="w-full h-[75%] lg:h-[90%] flex items-end justify-center">
        {/* Second Place */}
        <div className="relative w-[30%] h-[150px] md:h-[200px] rounded-l-xl bg-secondary flex flex-col">
          <div className="flex w-full flex-col items-center translate-y-[-25%] lg:scale-[120%] p-1">
            <Avatar className="w-12 h-12 mb-2 border-2 border-muted">
              <AvatarImage
                src={getAvatarUrl(second?.firstname, second?.lastname)}
                alt={`${second?.firstname || ""} ${second?.lastname || ""}`}
              />
              <AvatarFallback className="bg-muted text-muted-foreground font-bold">
                {second?.firstname?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center justify-center w-[18px] translate-y-[-60%]">
              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                <p className="text-[10px] text-secondary font-semibold">2</p>
              </div>
            </div>
            <div className="text-center flex flex-col content-between w-full">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="mb-1 text-md text-secondary-foreground truncate cursor-help">
                    {truncateName(second?.firstname, second?.lastname)}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getFullName(second?.firstname, second?.lastname)}</p>
                </TooltipContent>
              </Tooltip>
              <p className="font-bold text-lg text-secondary-foreground">
                {second?.totalPoints || 0}
              </p>
            </div>
          </div>
        </div>

        {/* First Place */}
        <div className="w-[30%] h-[220px] md:h-[260px] mx-[1.5px] rounded-t-[45px] bg-secondary py-2">
          <div className="flex w-full flex-col items-center translate-y-[-40%] md:translate-y-[-45%] lg:scale-[120%] p-1">
            <div className="flex flex-col items-center justify-center">
              <div className="text-2xl mb-1">👑</div>
              <Avatar className="w-12 h-12 mb-2 border-2 border-accent">
                <AvatarImage
                  src={getAvatarUrl(first?.firstname, first?.lastname)}
                  alt={`${first?.firstname || ""} ${first?.lastname || ""}`}
                />
                <AvatarFallback className="bg-accent text-accent-foreground font-bold">
                  {first?.firstname?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col items-center justify-center w-[18px] translate-y-[-60%]">
              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <p className="text-[10px] text-primary-foreground font-semibold">
                  1
                </p>
              </div>
            </div>
            <div className="text-center w-full">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="mb-1 text-md text-secondary-foreground truncate cursor-help">
                    {truncateName(first?.firstname, first?.lastname)}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getFullName(first?.firstname, first?.lastname)}</p>
                </TooltipContent>
              </Tooltip>
              <p className="font-bold text-lg text-secondary-foreground">
                {first?.totalPoints || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Third Place */}
        <div className="w-[30%] h-[125px] md:h-[175px] rounded-r-xl bg-secondary">
          <div className="flex w-full flex-col items-center justify-start translate-y-[-25%] p-1 lg:scale-[120%]">
            <Avatar className="w-12 h-12 mb-2 border-2 border-chart-6">
              <AvatarImage
                src={getAvatarUrl(third?.firstname, third?.lastname)}
                alt={`${third?.firstname || ""} ${third?.lastname || ""}`}
              />
              <AvatarFallback className="bg-accent text-accent-foreground font-bold">
                {third?.firstname?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center justify-center w-[18px] translate-y-[-60%]">
              <div className="w-6 h-6 bg-chart-6 rounded-full flex items-center justify-center">
                <p className="text-[10px] text-card font-semibold">3</p>
              </div>
            </div>
            <div className="text-center w-full">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="mb-1 text-md text-secondary-foreground truncate cursor-help">
                    {truncateName(third?.firstname, third?.lastname)}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getFullName(third?.firstname, third?.lastname)}</p>
                </TooltipContent>
              </Tooltip>
              <p className="font-bold text-lg text-secondary-foreground">
                {third?.totalPoints || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
};
