import Profile from "../assets/dashboard_Profile.png";
import Badge from "./Badge";

const ProfileCard = ({
  first_name = "first_name",
  last_name = "last_name",
  reg_number,
  badges = [],
}) => {
  return (
    <div className="bg-secondary h-full w-full rounded-3xl flex p-6 gap-3 text-white items-center justify-center">
      <div className="flex flex-row xs:flex-col items-center justify-between w-full xs:gap-5">
        <img src={Profile} alt="Profile" className="size-28 xs:size-36" />
        <div className="flex flex-col gap-5 h-full w-full justify-between items-center text-center">
          <div className="lg:text-xl w-full">
            <p className="flex justify-center items-center break-words">
              {first_name + " " + last_name}
            </p>
            <p className="font-semibold">{reg_number}</p>
          </div>
        </div>
        <div className="md:flex hidden w-full">
          <Badge badges={badges} />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
