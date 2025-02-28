import { useEffect, useState } from "react";
import TaskComponent from "../../components/TaskComponent";
import { useParams, useSearchParams } from "react-router-dom";
import { useRunningContext } from "../../contexts/RunningContext";
import faceicon from "../../assets/empty-box.png";

const deptMapping = {
  clubleads: "Club Leads",
  cp: "Competetive Programming",
  webdev: "Web Development",
  em: "Event Management",
  mands: "Marketing & Sponsorship",
  design: "Design",
  smandc: "Social Media & Content",
  finance: "Finance",
};

const DepartmentContributions = () => {
  const [searchParams] = useSearchParams();
  const { baseURL } = useRunningContext();
  const { id, dept } = useParams();
  const member_name = searchParams.get("name");

  const [contributions, setContributions] = useState([]);
  const [points, setPoints] = useState(0);

  const fetchData = async () => {
    try {
      const res = await fetch(`${baseURL}/userApi/get-contribution-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: id,
        }),
      });

      const allContributions = await res.json();
      const filteredContributions = allContributions.filter(
        (cont) => cont.department === dept
      );
      const totalPoints = filteredContributions
        .map((cont) => cont.points)
        .reduce((sum, num) => sum + num, 0);

      setPoints(totalPoints);
      setContributions(filteredContributions);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-5 h-[91.4vh] w-full overflow-hidden">
      <div className="bg-[#E9F0FA] px-4 md:px-10 pt-6">
        <div className="max-w-6xl mx-auto">
          {/* Title - Points Summary */}
          <div className="flex items-center text-black text-xl md:text-2xl font-bold">
            {/* <FaCoins className="mr-2 text-black" /> */}
            {deptMapping[dept]}
          </div>

          {/* Total Points + Member Box */}
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mt-7">
            {/* Total Points */}
            <p className="text-md md:text-lg text-black font ml-8">
              Total Points:{" "}
              <span className="font">
                {points} | {contributions.length} Contributions
              </span>
            </p>

            {/* Member Box (Position Adjusted) */}
            <div className="bg-[#1E1E1E] text-white py-3 px-10 flex items-center rounded-md w-full md:w-96 h-14 justify-between mt-4 md:mt-0">
              <span className="font-bold text-md md:text-lg">
                {member_name}
              </span>
              <div className="h-10 w-0.5 bg-gray-400 mx-4"></div>
              <span className="font-bold text-md md:text-lg">
                {id.slice(3)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-full w-full overflow-scroll flex p-5">
        {contributions.length === 0 ? (
          <p className="flex flex-col justify-center items-center w-full font-semibold text-xl">
            <img src={faceicon} alt="" />
            No contributions.
          </p>
        ) : (
          <div className="flex flex-wrap md:flex-row gap-8 items-start justify-center overflow-scroll">
            {contributions.map((contribution) => (
              <TaskComponent
                key={contribution.id}
                taskName={contribution.title} // Match the prop name expected in TaskComponent
                target={contribution.target} // Match the prop name expected in TaskComponent
                department={contribution.department} // Match the prop name expected in TaskComponent
                date={contribution.created_at} // Match the prop name expected in TaskComponent
                description={contribution.description} // Match the prop name expected in TaskComponent
                id={contribution.id} // Assuming you want to pass the ID as well
                points={contribution.points} // Match the prop name expected in TaskComponent
                status={contribution.status} // Match the prop name expected in TaskComponent
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default DepartmentContributions;
