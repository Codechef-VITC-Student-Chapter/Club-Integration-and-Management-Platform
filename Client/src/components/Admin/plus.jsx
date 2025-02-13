import React from "react"
import add from "../../assets/Plus2.jpg"

function plus(){
    return(
        <img src={add} className=" h-[43px] w-[45px] max-md:h-[23px] max-md:w-[25px] rounded-tr-l max-md:rounded-tr-md " />        
    );
}

export default plus;