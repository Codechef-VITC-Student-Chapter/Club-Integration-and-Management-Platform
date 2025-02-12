import user from "../../assets/user_ShortInputText_Numberandpassword.png";
import state1 from "./assets/state1_ShortInputText.png";
import state2 from "./assets/state2_ShortInputText.png";
import state3 from "./assets/state3_ShortInputText.png";

function ShortTextInput() {
  return (
    <div className="flex flex-col gap-[110px] items-center pt-10">
      <div className="w-62.5 h-11.5 flex flex-col justify-center ">
        <p className="text-[#191919] font-medium text-[10px] ">LABEL</p>
        <div className="w-62.5 h-7.5 border-[#333333] border-2 rounded-md flex justify-center items-center gap-1 ">
          <div className="pl-2">
            <img src={user} alt="User" className="w-3 h-3  " />
          </div>
          <input
            className="outline-none rounded-md"
            placeholder="Text field data"
          />
        </div>
      </div>
      <div className="w-62.5 h-11.5 flex flex-col justify-center ">
        <p className="text-[#191919] font-medium text-[10px] ">LABEL</p>
        <div className="w-62.5 h-7.5 border-[#4079DA] border-2 rounded-md flex justify-center items-center gap-1 ">
          <div className="pl-2">
            <img src={user} alt="User" className="w-3 h-3  " />
          </div>
          <input
            className="outline-none rounded-md"
            placeholder="Text field data"
          />
        </div>
      </div>
      <div className="w-62.5 h-11.5 flex flex-col justify-center ">
        <p className="text-[#191919] font-medium text-[10px] ">LABEL</p>
        <div className="w-62.5 h-7.5 border-[#ED933F] border-2 rounded-md flex justify-center items-center gap-1 ">
          <div className="pl-2">
            <img src={user} alt="User" className="w-3 h-3  " />
          </div>
          <input
            className="outline-none rounded-md"
            placeholder="Text field data"
          />
          <div className="pr-1">
            <img src={state1} alt="!" className="w-3 h-3 " />
          </div>
        </div>
      </div>
      <div className="w-62.5 h-11.5 flex flex-col justify-center ">
        <p className="text-[#191919] font-medium text-[10px] ">LABEL</p>
        <div className="w-62.5 h-7.5 border-[#EB5252] border-2 rounded-md flex justify-center items-center gap-1 ">
          <div className="pl-2">
            <img src={user} alt="User" className="w-3 h-3  " />
          </div>
          <input
            className="outline-none rounded-md"
            placeholder="Text field data"
          />
          <div className="pr-1">
            <img src={state2} alt="x" className="w-3 h-3 " />
          </div>
        </div>
      </div>
      <div className="w-62.5 h-11.5 flex flex-col justify-center ">
        <p className="text-[#191919] font-medium text-[10px] ">LABEL</p>
        <div className="w-62.5 h-7.5 border-[#198754] border-2 rounded-md flex justify-center items-center gap-1 ">
          <div className="pl-2">
            <img src={user} alt="User" className="w-3 h-3  " />
          </div>
          <input
            className="outline-none rounded-md"
            placeholder="Text field data"
          />
          <div className="pr-1">
            <img src={state3} alt="tick" className="w-3 h-3 " />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShortTextInput;
