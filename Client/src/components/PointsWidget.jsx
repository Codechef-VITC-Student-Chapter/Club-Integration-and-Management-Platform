import React from "react";

function PointsWidget({ clubPoints, pendingPoints }) {
  const clubNames = Object.keys(clubPoints);

  return (
    <div className="rounded-3xl h-[166px] md:h-[203px] w-full max-w-[409px] flex flex-col border border-black border-solid">
      {clubNames.map((club) => {
        const totalPoints = clubPoints[club]?.total || 45; // Extract total points from clubPoints
        const pendingPointsForClub = pendingPoints[club] || 10; // Extract pending points
        const remainingPoints = 100 - (totalPoints + pendingPointsForClub);

        const radius = 50;
        const circumference = 2 * Math.PI * radius;
        const totalPointsDash = (totalPoints / 100) * circumference;
        const pendingPointsDash = (pendingPointsForClub / 100) * circumference;
        const remainingPointsDash = (remainingPoints / 100) * circumference;

        return (
          <div key={club} className="flex flex-col">
            <div className="bg-[#2E3446] rounded-tr-3xl rounded-tl-3xl flex justify-center items-center w-full h-9">
              <h1 className="text-white text-center text-sm md:text-base md:block hidden">
                Club Points Breakdown
              </h1>
              <h1 className="text-white text-center text-sm md:text-base md:hidden block">
                Points Breakdown
              </h1>
            </div>
            <div className="flex md:flex-row justify-center items-center pt-4">
              <div className="rounded-full h-28 w-28 md:h-36 md:w-36 relative flex justify-center items-center pb-2 transform scale-90 sm:scale-100">
                <div className="flex">
                  <svg width="100%" height="100%" viewBox="0 0 120 120" className="rounded-full">
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke="green"
                      strokeWidth="10"
                      strokeDasharray={`${totalPointsDash} ${circumference}`}
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke="yellow"
                      strokeWidth="10"
                      strokeDasharray={`${pendingPointsDash} ${circumference}`}
                      strokeDashoffset={-totalPointsDash}
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="none"
                      stroke="black"
                      strokeWidth="10"
                      strokeDasharray={`${remainingPointsDash} ${circumference}`}
                      strokeDashoffset={-(totalPointsDash + pendingPointsDash)}
                    />
                  </svg>
                </div>

                <div className="bg-[#E9F1FE] h-[80%] w-[80%] rounded-full flex justify-center items-center absolute">
                  <h1 className="font-bold text-2xl md:text-3xl text-black">
                    {totalPoints}
                  </h1>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center mt-4 md:mt-0 transform scale-90 sm:scale-100">
                <h1 className="text-green-700 font-bold text-sm md:text-lg md:block hidden">
                  Total Points Earned
                </h1>
                <h1 className="text-green-700 font-bold text-sm md:text-lg md:hidden block">
                  Earned
                </h1>
                <h1 className="text-green-700 text-sm md:text-base">
                  {totalPoints}/100
                </h1>
                <h1 className="text-yellow-400 font-bold text-sm md:text-lg md:block hidden">
                  Pending Points
                </h1>
                <h1 className="text-yellow-400 font-bold text-sm md:text-lg md:hidden block">
                  Pending
                </h1>
                <h1 className="text-yellow-400 text-sm md:text-base">
                  {pendingPointsForClub}
                </h1>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PointsWidget;