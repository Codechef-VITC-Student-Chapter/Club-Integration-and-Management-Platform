import React from "react";

function PointsWidget({ clubPoints, pendingPoints }) {
  const clubNames = Object.keys(clubPoints);

  return (
    <>
      <div className="p-6 rounded-lg shadow-md bg-blue-500 text-white">
        <h2 className="text-lg font-bold">Club Points Breakdown</h2>
        <div className="space-y-4">
          {clubNames.map((club) => {
            const totalPoints = clubPoints[club];
            const pendingPointsForClub = pendingPoints[club] || 0;
            const totalPointsWithPending = Math.min(
              totalPoints + pendingPointsForClub,
              100
            );
            const progress = Math.min((totalPoints / 100) * 100, 100);
            const totalProgress = Math.min(
              (totalPointsWithPending / 100) * 100,
              100
            );

            const isClubGreen = totalPoints >= 100;

            return (
              <div
                key={club}
                className={`relative p-4 rounded-lg ${
                  isClubGreen ? "bg-green-500" : "bg-red-800"
                } text-white`}
              >
                <h3 className="text-md font-semibold">{club}</h3>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden relative">
                  {/* Total Points with Pending (Background) */}
                  <div
                    className="absolute h-4 rounded-full bg-blue-300"
                    style={{ width: `${totalProgress}%` }}
                  ></div>
                  {/* Current Points (Overlay) */}
                  <div
                    className={`absolute h-4 rounded-full ${
                      isClubGreen ? "bg-yellow-300" : "bg-blue-700"
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm">
                  Total Points (Earned): {totalPoints} / 100
                </p>
                <p className="text-sm text-gray-200">
                  Pending Points: {pendingPointsForClub}
                </p>
                {totalPoints >= 100 && (
                  <div className="text-center mt-2 animate-bounce">
                    🎉 Congrats! You reached 100 points in {club}! 🎉
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="rounded-3xl w-full max-w-[409px] h-auto flex flex-col border border-black border-solid">
        {clubNames.map((club) => {
          const totalPoints = 50;
          const pendingPointsForClub = 10;
          const remainingPoints = 100 - (totalPoints + pendingPointsForClub);

          const radius = 50;
          const circumference = 2 * Math.PI * radius;
          const totalPointsDash = (totalPoints / 100) * circumference;
          const pendingPointsDash =
            (pendingPointsForClub / 100) * circumference;
          const remainingPointsDash = (remainingPoints / 100) * circumference;

          return (
            <>
              <div className="bg-[#2E3446] rounded-tr-3xl rounded-tl-3xl flex justify-center items-center w-full h-9">
                <h1 className="text-white text-center text-sm md:text-base">
                  Club Points Breakdown
                </h1>
              </div>
              <div className="flex  md:flex-row justify-center items-center pt-4">
                <div className="rounded-full h-28 w-28 md:h-36 md:w-36 relative flex justify-center items-center pb-2 transform scale-90 sm:scale-100">
                  <div className="flex">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 120 120"
                      className="rounded-full"
                    >
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
                        strokeDashoffset={
                          -(totalPointsDash + pendingPointsDash)
                        }
                      />
                    </svg>
                  </div>

                  <div className="bg-[#E9F1FE] h-[80%] w-[80%] rounded-full flex justify-center items-center absolute">
                    <h1 className="font-bold text-2xl md:text-3xl">
                      {totalPoints}
                    </h1>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center mt-4 md:mt-0 transform scale-90 sm:scale-100">
                  <h1 className="text-green-700 font-bold text-sm md:text-lg">
                    Total Points Earned
                  </h1>
                  <h1 className="text-green-700 text-sm md:text-base">
                    {totalPoints}/100
                  </h1>
                  <h1 className="text-yellow-400 font-bold text-sm md:text-lg">
                    Pending Points
                  </h1>
                  <h1 className="text-yellow-400 text-sm md:text-base">
                    {pendingPointsForClub}
                  </h1>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}

export default PointsWidget;
