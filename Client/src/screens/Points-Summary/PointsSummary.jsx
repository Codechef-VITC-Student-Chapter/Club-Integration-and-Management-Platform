import { useEffect, useState } from "react";
import CardCreation from "./components/card_creation1.jsx";
import img from "./assets/ClubLeadsIcon.png";
import img2 from "./assets/CompetetiveProgIcon.png";
import img3 from "./assets/WebDevIcon.png";
import img4 from "./assets/DesignIcon.png";
import img5 from "./assets/EventMgmtIcon.png";
import img6 from "./assets/MarketingIcon.png";
import img7 from "./assets/SocialMediaIcon.png";
import img8 from "./assets/FinanceIcon.png";
import { useRunningContext } from "../../contexts/RunningContext.jsx";
import { useNavigate, useParams } from "react-router-dom";

const defaultContributions = {
  clubleads: {
    title: "Club Leads",
    dept: "clubleads",
    conts: 0,
    points: 0,
    icon: img,
  },
  cp: {
    title: "Competetive Programming",
    dept: "cp",
    conts: 0,
    points: 0,
    icon: img2,
  },
  webdev: {
    title: "Web Development",
    dept: "webdev",
    conts: 0,
    points: 0,
    icon: img3,
  },
  em: {
    title: "Event Management",
    dept: "em",
    conts: 0,
    points: 0,
    icon: img4,
  },
  mands: {
    title: "Marketing & Sponsorship",
    dept: "mands",
    conts: 0,
    points: 0,
    icon: img5,
  },
  design: {
    title: "Design",
    dept: "design",
    conts: 0,
    points: 0,
    icon: img6,
  },
  smandc: {
    title: "Social Media & Content",
    dept: "smandc",
    conts: 0,
    points: 0,
    icon: img7,
  },
  finance: {
    title: "Finance",
    dept: "finance",
    conts: 0,
    points: 0,
    icon: img8,
  },
};

function PointsSummary() {
  const { baseURL, currentUser, isAdmin, token } = useRunningContext();
  const navigate = useNavigate();
  const [contributions, setContributions] = useState({
    ...defaultContributions,
  });
  const [userInfo, setUserInfo] = useState({
    name: "loading...",
    reg_number: "loading...",
    total_points: "loading...",
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams() || currentUser;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [userRes, contributionsRes] = await Promise.all([
        fetch(`${baseURL}/user/info/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${baseURL}/user/contributions/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const userJson = await userRes.json();
      const contributionJson = await contributionsRes.json();

      const userData = userJson.user;
      const contributionsData = contributionJson.contributions;
      console.log(userData, contributionsData);

      setUserInfo({
        name: userData.first_name + " " + userData.last_name,
        reg_number: userData.reg_number,
        total_points: userData.total_points,
      });

      const newContributions = JSON.parse(JSON.stringify(defaultContributions));

      const flattened = contributionsData.map((item) => ({
        ...item.contribution,
        clubName: item.club_name,
        departmentName: item.department_name,
      }));
      flattened.forEach((cont) => {
        const department = cont.department;
        if (newContributions[department]) {
          newContributions[department].conts += 1;
          newContributions[department].points += cont.points;
        }
      });

      setContributions(newContributions);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin && currentUser !== id) navigate("/");
    fetchData();
  }, []);

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
              Total Points:{" "}
              <span className="font">{userInfo.total_points}</span>
            </p>

            {/* Member Box (Position Adjusted) */}
            <div className="bg-[#1E1E1E] text-white py-3 px-10 flex items-center rounded-md w-full md:w-96 h-14 justify-between mt-4 md:mt-0">
              <span className="font-bold text-md md:text-lg">
                {userInfo.name}
              </span>
              <div className="h-10 w-0.5 bg-gray-400 mx-4"></div>
              <span className="font-bold text-md md:text-lg">
                {userInfo.reg_number}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-screen bg-[#E9F1FE] overflow-hidden md:flex md:justify-center md:pb-5">
        <div className="flex justify-center items-center gap-10 max-md:flex flex-wrap max-md:gap-5 md:w-[1050px] ">
          {!loading &&
            Object.keys(contributions).map((key) => (
              <div key={key}>
                <CardCreation
                  id={id}
                  dept={contributions[key].dept}
                  img1={contributions[key].icon}
                  text={contributions[key].title}
                  point={contributions[key].points}
                  contributionsNumber={contributions[key].conts}
                  text1={key === "smandc" && "Social"}
                  member_name={userInfo.name}
                />
              </div>
            ))}
          {loading && <div>Loading...</div>}
        </div>
      </div>
    </div>
  );
}

export default PointsSummary;
