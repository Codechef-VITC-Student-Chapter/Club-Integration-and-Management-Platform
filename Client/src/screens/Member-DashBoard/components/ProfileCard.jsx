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
    <div
      className={`h-full w-full rounded-3xl flex flex-col p-2 gap-6 justify-center items-center text-white`}
    >
      <div className="w-full h-full flex-col gap-8 items-center text-center md:block hidden">
        {isAdmin && (
          <button
            className=" bg-[#4079DA] p-3 rounded-xl text-center text-md"
            onClick={() => navigate('/adminview')}
          >
            Admin View
          </button>
        )}
      </div>
      <div className="bg-[#2E3446] h-full w-full rounded-3xl flex flex-col p-4 gap-3 justify-center items-center text-white">
        <img src={Profile} alt="Profile" className="aspect-square mx-8 mt-8" />
        <div className="flex flex-col gap-5 h-full w-full justify-between items-center text-center">
          <div className="lg:text-xl text-md">
            <div className="flex sm:gap-3 gap-0 sm:flex-row flex-col justify-center items-center">
              <span>{first_name}</span>
              <span>{last_name}</span>
            </div>
            <span className="font-semibold">{reg_number}</span>
          </div>
          <div className="md:flex hidden w-full justify-star">
            <Badge badges={badges} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
