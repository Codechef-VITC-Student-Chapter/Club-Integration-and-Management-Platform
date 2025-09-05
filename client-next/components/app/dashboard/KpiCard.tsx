import { KpiCardProps } from '@/types';

const KpiCard = ({ title, value, icon }: KpiCardProps) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
      <div className="bg-gray-100 p-1 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-[0.6rem] text-gray-500 font-medium uppercase">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default KpiCard;