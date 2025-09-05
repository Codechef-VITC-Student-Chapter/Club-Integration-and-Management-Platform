import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
interface ProfileCardProps {
  name: string|"Loading....";
  isLead: boolean;
  Regno: string;
  avatarUrl?: string;
}
const ProfileCard: React.FC<ProfileCardProps> = ({ name, isLead,Regno ,avatarUrl}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image src={avatarUrl??"https://i.pravatar.cc/150?u=a042581f4e29026704d"} alt={name} width={56} height={56} className="rounded-full" />
        <div>
          <h2 className="font-bold text-lg text-gray-800">{name}</h2>
          <p className="text-sm text-gray-500">{Regno}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
         <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{isLead?"Lead":"Member"}</span>
         <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal size={20} />
         </button>
      </div>
    </div>
  );
};

export default ProfileCard;