import React from "react";
import Arrow from "../assets/Arrow.jpg";

function Cross() {
  return (
    <img
      src={Arrow}
      className=" h-[43px] w-[45px] max-md:h-[23px] max-md:w-[25px] rounded-tr-l max-md:rounded-tr-md "
    />
  );
}

export default Cross;
