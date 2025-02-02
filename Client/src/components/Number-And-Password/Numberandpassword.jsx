import Lock from "./assets/Lock_Numberandpassword.png";
import user from "../../assets/user_ShortInputText_Numberandpassword.png";

function Numberandpassword() {
  return (
    <div>
      <div className="flex flex-col items-center pt-[15px] gap-[15px] ">
        <div>
          <p className="text-[#191919] font-medium text-[10px] ">PASSWORD</p>
          <div className="w-[250px] h-[28px] border-[#333333] border-2 rounded-md flex justify-center items-center gap-1 ">
            <div className="pl-1">
              <img src={Lock} alt="lock" className="w-[13.28px] h-[14px]  " />
            </div>
            <input
              className="outline-none rounded-md w-[250px] h-[20px]"
              placeholder="**********"
              type="password"
            />
          </div>
        </div>
        <div>
          <p className="text-[#191919] font-semibold text-[10px] ">
            PHONE NUMBER
          </p>
          <div className="w-[250px] h-[28px] border-[#333333] border-2 rounded-md flex justify-center items-center gap-1 ">
            <div className="pl-1">
              <img src={user} alt="user" className="w-[16px] h-[16px]  " />
            </div>
            <input
              className="outline-none rounded-md w-[250px] h-[20px]"
              placeholder="1234567891"
              type="text"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Numberandpassword;
