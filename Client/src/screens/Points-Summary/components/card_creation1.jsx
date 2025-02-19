import { React } from "react";
import Plus from "./plus";
import Cross from "./Cross";
import { useRunningContext } from "../../../contexts/RunningContext";

const CardCreation = (props) => {
  const { isAdmin } = useRunningContext();

  console.log(isAdmin);

  return (
    <div className="w-[230px] h-[260px] max-md:w-[120px] max-md:h-[150px] bg-white border-[#2E3446] border-[6px] max-md:border-[3px] rounded-xl overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex justify-end">
          <button>{isAdmin === true ? <Cross /> : <Plus />}</button>
        </div>

        <div className="flex flex-col items-center">
          <img
            src={props.img1}
            className={`object-contain ${props.text === 'Marketing & Sponsorship' || props.text === 'Club Leads'
              ? "h-[70px] w-[85px] max-md:h-[45px] max-md:w-[60px]"
              : "h-[70px] w-[75px] max-md:h-[40px] max-md:w-[45px]"
              }`}
            alt={props.text}
          />
          <p
            className={`text-[#333333] font-lato font-extrabold text-[11px] md:text-xl text-center w-full px-2 
              ${props.text === 'Design' || props.text === 'Web Development' || props.text === 'Finance' || props.text === 'Event Management'
                ? "pt-5 max-md:pt-2"
                : props.text === 'Competetive Programming' || props.text === 'Club Leads'
                  ? "max-md:pt-1"
                  : ""
              }`}
          >
            {props.text}
          </p>
        </div>

        <div className={`flex justify-center gap-2 p-2 
            ${props.text === 'Competetive Programming' || props.text === 'Marketing & Sponsorship'
            ? "pt-2 max-md:pt-2 "
            : props.text1 === 'Social'
              ? "pt-2 max-md:pt-3"
              : "pt-9 max-md:pt-5"
          } 
            ${props.text === 'Web Development' || props.text === 'Design' || props.text === 'Event Management' || props.text === 'Finance'
            ? "md:pt-4"
            : ""
          }`}
        >
          <div className="flex-1 max-w-[125px] max-md:max-w-[105px]">
            <div className="bg-[#4079DA] text-center rounded-[10px] max-md:rounded-[2px] p-1">
              <p className="text-white text-[8px] md:text-xl font-lato font-extrabold truncate">
                {props.point}
              </p>
              <p className="text-white text-[6px] md:text-[15px] font-lato font-medium">
                Points
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-[125px] text-center">
            <p className="text-[#4079DA] text-[11px] md:text-xl font-lato font-extrabold truncate">
              {props.contributions}
            </p>
            <p className="text-[#4079DA] text-[7px] md:text-[15px] font-lato font-medium">
              Contributions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCreation;