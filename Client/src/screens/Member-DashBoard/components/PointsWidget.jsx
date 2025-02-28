const CircleProgress = ({ totalPoints, pendingPoints }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const completedDash = (totalPoints / 100) * circumference;
  const pendingDash = (pendingPoints / 100) * circumference;

  return (
    <div className="relative flex justify-center items-center">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 120 120"
        className="rounded-full -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          className="stroke-gray-800"
          fill="none"
          strokeWidth="10"
          strokeDasharray={`${circumference} ${circumference}`}
        />
        {/* Pending points */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          className="stroke-acc-secondary"
          fill="none"
          strokeWidth="10"
          strokeDasharray={`${pendingDash} ${circumference}`}
          strokeDashoffset={-completedDash}
        />
        {/* Completed points */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          className="stroke-positive"
          fill="none"
          strokeWidth="10"
          strokeDasharray={`${completedDash} ${circumference}`}
          strokeDashoffset="0"
        />
      </svg>
      <div className="absolute">
        <span className="font-bold text-2xl md:text-3xl truncate">
          {totalPoints}
        </span>
      </div>
    </div>
  );
};

// Separate PointsInfo component
const PointsInfo = ({ totalPoints, pendingPoints }) => (
  <div className="flex flex-col gap-1 text-center">
    <div>
      <h2 className="text-positive font-bold text-base ">Points Earned</h2>
      <p className="text-positive text-sm md:text-base font-semibold">
        <span className="font-bold text-xl">{totalPoints}</span>/100
      </p>
    </div>
    <div>
      <h2 className="text-acc-secondary font-bold text-base">Pending Points</h2>
      <p className="text-acc-secondary text-sm md:text-base font-bold">
        {pendingPoints}
      </p>
    </div>
  </div>
);

const PointsWidget = ({ clubPoints, pendingPoints }) => {
  const clubNames = Object.keys(clubPoints);

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-black">
      {clubNames.map((club) => {
        const totalPoints = clubPoints[club] || 0;
        const pendingPointsForClub = pendingPoints[club] || 0;

        return (
          <div key={club} className="flex flex-col">
            <div className="bg-gray-800 rounded-t-3xl py-2">
              <h1 className="text-white text-center text-md md:text-base font-semibold">
                Points Breakdown
              </h1>
            </div>

            <div className="p-2 flex flex-row md:flex-row items-center justify-center gap-2">
              <div className="w-28 md:w-30">
                <CircleProgress
                  totalPoints={totalPoints}
                  pendingPoints={pendingPointsForClub}
                />
              </div>

              <PointsInfo
                totalPoints={totalPoints}
                pendingPoints={pendingPointsForClub}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PointsWidget;
