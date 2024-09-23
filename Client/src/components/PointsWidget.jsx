import React from 'react';

function PointsWidget({ clubPoints, pendingPoints }) {
  const clubNames = Object.keys(clubPoints);

  return (
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
                isClubGreen ? 'bg-green-500' : 'bg-red-800'
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
                    isClubGreen ? 'bg-yellow-300' : 'bg-blue-700'
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
  );
}

export default PointsWidget;
