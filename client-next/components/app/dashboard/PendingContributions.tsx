'use client';
import { DashboardContribution } from '@/types';
import { useRouter } from "next/navigation";
const ContributionItem = ({ contribution }: { contribution: DashboardContribution }) => {
  if (contribution.contribution.status !== "pending") return null; // Skip non-pending

  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-2 px-1 text-sm">
      {/* Left Side */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-semibold text-gray-800 truncate">
          {contribution.contribution.title}
        </span>
        <span className="text-gray-600 truncate">
          {contribution.contribution.description}
        </span>
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
          <span>{contribution.contribution.user_id}</span>
          <span>•</span>
          <span>{contribution.contribution.department}</span>
          <span>•</span>
          <span>{new Date(contribution.contribution.created_at).toLocaleDateString()}</span>
          <span>•</span>
          <span className="font-semibold text-gray-600 break-all">
            {contribution.contribution.id}
          </span>
        </div>
      </div>

      {/* Points Badge */}
      <span
        className="ml-3 flex-shrink-0 text-white text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500"
      >
        {contribution.contribution.points}
      </span>
    </div>
  );
};

interface ContributionsListProps {
  contributions: DashboardContribution[];
}

const PendingContributions: React.FC<ContributionsListProps> = ({ contributions }) => {
  const router = useRouter();  
  const pending = (contributions ?? []).filter(
    (c) => c.contribution.status === "pending"
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">Pending Contributions</h3>
        <button className="bg-blue-600 text-white text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700"
        onClick={() => router.push("/dashboard/requests/new")}>
          Create request
        </button>
      </div>

      {/* List */}
      <div className="bg-gray-50 p-4 rounded-lg text-sm border-2 border-yellow-200">
        {pending.length > 0 ? (
          pending.map((contribution) => (
            <ContributionItem
              key={contribution.contribution.id}
              contribution={contribution}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center py-6">
            No pending contributions. You're all caught up.
          </p>
        )}
      </div>
    </div>
  );
};

export default PendingContributions;
