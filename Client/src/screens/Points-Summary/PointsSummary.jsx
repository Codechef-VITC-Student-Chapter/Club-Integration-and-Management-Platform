import React from "react"
import CardCreation from "./components/card_creation1.jsx"
import img from "./assets/ClubLeadsIcon.png"
import img2 from "./assets/CompetetiveProgIcon.png"
import img3 from "./assets/WebDevIcon.png"
import img4 from "./assets/DesignIcon.png"
import img5 from "./assets/EventMgmtIcon.png"
import img6 from "./assets/MarketingIcon.png"
import img7 from "./assets/SocialMediaIcon.png"
import img8 from "./assets/FinanceIcon.png"


function PointsSummary() {
    return (
        <div className="flex flex-col gap-5">
            <div className="bg-[#E9F0FA] px-4 md:px-10 pt-6">
                <div className="max-w-6xl mx-auto">
                    {/* Title - Points Summary */}
                    <div className="flex items-center text-black text-xl md:text-2xl font-bold">
                        {/* <FaCoins className="mr-2 text-black" /> */}
                        Points Summary
                    </div>

                    {/* Total Points + Member Box */}
                    <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mt-7">
                        {/* Total Points */}
                        <p className="text-md md:text-lg text-black font ml-8">
                            Total Points: <span className="font">100</span>
                        </p>

                        {/* Member Box (Position Adjusted) */}
                        <div className="bg-[#1E1E1E] text-white py-3 px-10 flex items-center rounded-md w-full md:w-96 h-14 justify-between mt-4 md:mt-0">
                            <span className="font-bold text-md md:text-lg">Member name</span>
                            <div className="h-10 w-0.5 bg-gray-400 mx-4"></div>
                            <span className="font-bold text-md md:text-lg">23XXX1000</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-screen bg-[#E9F1FE] overflow-hidden md:flex md:justify-center md:pb-5">
                <div className="flex justify-center items-center gap-10 max-md:flex flex-wrap max-md:gap-5 md:w-[1050px] ">
                    <CardCreation img1={img} text="Club Leads" point={70} contributions={6} />
                    <CardCreation img1={img2} text="Competetive Programming" point={70} contributions={6} />
                    <CardCreation img1={img3} text="Web Development" point={70} contributions={6} />
                    <CardCreation img1={img4} text="Design" point={70} contributions={6} />
                    <CardCreation img1={img5} text="Event Management" point={70} contributions={6} />
                    <CardCreation img1={img6} text="Marketing & Sponsorship" point={70} contributions={6} />
                    <CardCreation img1={img7} text={<span>Social Media &<br />Content</span>} text1="Social" point={70} contributions={6} />
                    <CardCreation img1={img8} text="Finance" point={70} contributions={6} />
                </div>
            </div>
        </div>
    );
}

export default PointsSummary;