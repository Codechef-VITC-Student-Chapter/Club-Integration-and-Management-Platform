import React from "react"
import Arrow from "../assets/Arrow.jpg"

function Cross() {
    return (
        <div className="h-[43px] w-[45px] max-md:h-[23px] max-md:w-[25px]  overflow-hidden">
            <img src={Arrow} alt="Arrow" className="h-full w-full bg-white object-cover mix-blend-multiply" />
        </div>
    );
}

export default Cross;