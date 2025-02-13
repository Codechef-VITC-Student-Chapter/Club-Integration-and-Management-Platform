import React from "react"
import Cards1 from "./card_creation1.jsx"
import img from "../../assets/Clubleads.jpg"
import img2 from "../../assets/Competetive_programming.jpg"
import img3 from "../../assets/Web_development.jpg"
import img4 from "../../assets/Design.jpg"
import img5 from "../../assets/Event_management.jpg"
import img6 from "../../assets/Market_sponsorship.jpg"
import img7 from "../../assets/Social_media.jpg"
import img8 from "../../assets/Finance.jpg"


function Members(){
    return(
        <div className="w-screen h-screen bg-[#E9F1FE] pt-40  overflow-hidden md:flex md:justify-center md:pb-5 ">
                <div className="flex justify-center items-center gap-10 max-md:flex flex-wrap max-md:gap-5 md:w-[1050px] ">
                    <Cards1 img1={img} text="Club Leads" point={70} contributions={6} />
                    <Cards1 img1={img2} text="Competetive Programming" point={70} contributions={6} />
                    <Cards1 img1={img3} text="Web Development" point={70} contributions={6} /> 
                    <Cards1 img1={img4} text="Design" point={70} contributions={6} />
                    <Cards1 img1={img5} text="Event Management" point={70} contributions={6} />
                    <Cards1 img1={img6} text="Marketing & Sponsorship" point={70} contributions={6} />
                    <Cards1 img1={img7} text={<span>Social Media &<br/>Content</span>} text1="Social" point={70} contributions={6} />
                    <Cards1 img1={img8} text="Finance" point={70} contributions={6} />
                </div>
        </div>
    );
}

export default Members;