// import { dummyActivity } from '@/lib/dummyData';
// import { Activity } from '@/types';

// const ActivityItem = ({ activity }: { activity: Activity }) => (
//     <div className="flex items-start justify-between py-3 border-b last:border-none">
//         <div>
//             <p className="font-semibold text-gray-800 text-sm">{activity.title}</p>
//             <p className="text-xs text-gray-500 mt-1">{activity.uid} • {activity.department} • {activity.date}</p>
//         </div>
//         <span className="bg-gray-800 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ml-4">
//             {activity.points}
//         </span>
//     </div>
// );

// const RecentActivity = () => {
//   return (
//     <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
//       <h3 className="font-bold text-gray-800 mb-2">Recent Activity / Notes</h3>
//       <div>
//         {dummyActivity.map(activity => (
//             <ActivityItem key={activity.id} activity={activity} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RecentActivity;