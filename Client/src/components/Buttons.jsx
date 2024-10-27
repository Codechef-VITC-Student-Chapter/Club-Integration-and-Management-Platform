
function Buttons(){
    return(
        <div className="flex justify-center items-center gap-5 pt-5 " >
            <button className="bg-[#198754] text-white w-[108px] h-[43px] rounded-md font-mooli font-normal text-[16px] " >Positive</button>
            <button className="bg-[#FFC107] text-[#333333] w-[108px] h-[43px] rounded-md font-mooli font-normal text-[16px] " >Neutral</button>
            <button className="bg-[#DC3545] text-[#FFFBFB] w-[108px] h-[43px] rounded-md font-mooli font-normal text-[16px] " >Negative</button>
            <button className="bg-[#4079DA] text-white w-[108px] h-[43px] rounded-md font-mooli font-normal text-[16px] " >Action</button>
        </div>
    );
}

export default Buttons