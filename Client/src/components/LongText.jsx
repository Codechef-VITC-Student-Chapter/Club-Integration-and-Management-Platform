
function LongText(){
    return(
        <div>
            <div className="flex flex-col items-center pt-[15px] gap-[15px] " >
                <div>
                    <p className="text-[#191919] font-semibold text-[10px] " >LABEL</p>
                    <textarea className="w-[300px] h-[90px] rounded-md border-2 border-[#333333] p-2 " placeholder="Text" />
                </div>
                <div>
                    <p className="text-[#191919] font-semibold text-[10px] " >LABEL</p>
                    <textarea className="w-[300px] h-[90px] rounded-md border-2 border-[#4079DA] p-2 " placeholder="Text" />
                </div>
            </div>
        </div>
    );
}

export default LongText