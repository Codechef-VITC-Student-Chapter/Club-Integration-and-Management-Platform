'use client';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';


const COLORS = ['#e5e7eb', '#3b82f6']; // Gray for pending, Blue for filled
interface PointsBreakDownProps {
  pointsData:number;
}
const PointsBreakDown: React.FC<PointsBreakDownProps> = ({ pointsData})  => {
    const pointsObj=[{ name: 'Pending', value: 100-pointsData },
  { name: 'Available', value: pointsData },]
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4">Points Breakdown</h3>
      <div className="relative w-full h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pointsObj}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              startAngle={90}
              endAngle={450}
              dataKey="value"
              stroke="none"
            >
              {pointsObj.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-gray-800">{100-pointsData}</span>
            <span className="text-[0.7rem] text-gray-500 max-w-[2rem]">Pending Points</span>
        </div>
      </div>
    </div>
  );
};

export default PointsBreakDown;