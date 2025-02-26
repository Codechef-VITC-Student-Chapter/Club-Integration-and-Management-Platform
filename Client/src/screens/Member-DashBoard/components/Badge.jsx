import CCLogo from '../assets/dashboard_cclogo.png';

const Badge = ({ badges }) => {
    return (
      <div className="flex justify-center flex-wrap gap-2">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="w-14 md:w-20 text-center flex flex-col items-center"
            style={{ width: '50px' }} // <-- Adjusted for 300px
          >
            <img src={CCLogo} alt="Badge logo" className="w-full" />
            <span className="text-[10px] md:text-xs">{badge}</span> {/* <-- Adjusted for 300px */}
          </div>
        ))}
      </div>
    );
  };
  

export default Badge