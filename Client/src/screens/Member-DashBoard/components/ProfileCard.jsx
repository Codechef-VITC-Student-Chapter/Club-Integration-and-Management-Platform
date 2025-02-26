import Profile from '../assets/dashboard_Profile.png';
import Badge from './Badge';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({
  isAdmin = false,
  first_name = 'first_name',
  last_name = 'last_name',
  reg_number,
  badges = [],
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full rounded-3xl flex flex-col p-2 md:p-4 gap-2 items-center text-white"> {/* <-- Adjusted for 300px */}
      {isAdmin && (
        <button
          className="bg-[#4079DA] p-1 md:p-2 rounded-xl text-xs md:text-md"> {/* <-- Adjusted for 300px */}
          Admin View
        </button>
      )}
      <div className="bg-[#2E3446] w-full rounded-3xl flex flex-col p-2 md:p-4 gap-2 items-center text-center"> {/* <-- Adjusted for 300px */}
        <img
          src={Profile}
          alt="Profile"
          className="aspect-square w-16 md:w-32 mt-2 md:mt-4" /> {/* <-- Adjusted for 300px */}
        
        <div className="flex flex-col gap-1 items-center"> {/* <-- Adjusted for 300px */}
          <span className="text-xs md:text-lg font-semibold">{first_name} {last_name}</span> {/* <-- Adjusted for 300px */}
          <span className="text-xs">{reg_number}</span>
          <div className="hidden md:flex justify-center w-full flex-wrap gap-2">
            <Badge badges={badges} />
          </div>
        </div>
      </div>
    </div>
  );
};



export default ProfileCard;
