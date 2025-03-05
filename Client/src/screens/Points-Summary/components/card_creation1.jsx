import Plus from "./plus";
import Cross from "./Cross";
import { Link } from "react-router-dom";
import { useRunningContext } from "../../../contexts/RunningContext";
import { useState } from "react";
import AddPoints from "./AddPoints/AddPoints";
import ConfirmPoints from "./ConfirmPoints/ConfirmPoints";
import { club_id, departmentMap } from "../../../lib/keys";
import { toast } from "react-toastify";

const CardCreation = (props) => {
  const { baseURL, currentUser, isAdmin, token } = useRunningContext();

  const [showAdd, setShowAdd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(0);
  const [title, setTitle] = useState("");

  const handleAddContribution = async () => {
    try {
      setLoading(true);
      // console.log(token);
      const response = await fetch(`${baseURL}/contApi/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: props.id,
          title,
          points,
          description,
          proof_files: [],
          target: [currentUser],
          club_id: club_id,
          department: props.dept,
          status: "approved",
          created_at: new Date().toLocaleString(),
        }),
      });

      if (!response.ok) {
        // console.log(response);
        toast.error("Failed to add contribution");
        return;
      }
      toast.success("Contribution added successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setPoints(0);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Error submitting request");
      setLoading(false);
    }
  };

  return (
    <div className="w-[230px] h-[260px] max-md:w-[120px] max-md:h-[150px] bg-white border-[#2E3446] border-[6px] max-md:border-[3px] rounded-xl overflow-hidden">
      {showAdd && (
        <AddPoints
          name={props.member_name}
          reg_no={props.id.slice(3)}
          dept={departmentMap[props.dept]}
          setShowAdd={setShowAdd}
          setShowConfirm={setShowConfirm}
          setDescription={setDescription}
          setPoints={setPoints}
          setTitle={setTitle}
        />
      )}
      {showConfirm && (
        <ConfirmPoints
          department={props.dept}
          description={description}
          points={points}
          id={props.id}
          handleSubmit={handleAddContribution}
          setShowConfirm={setShowConfirm}
          taskName={title}
        />
      )}
      <div className="flex flex-col h-full">
        <div className={`flex ${isAdmin ? "justify-between" : "justify-end"}`}>
          {isAdmin && (
            <button onClick={() => setShowAdd(true)}>
              <Plus />
            </button>
          )}
          <Link
            to={`/department/${props.id}/${props.dept}?name=${props.member_name}`}
          >
            <Cross />
          </Link>
        </div>

        <div className="flex flex-col items-center">
          <img
            src={props.img1}
            className={`object-contain ${
              props.text === "Marketing & Sponsorship" ||
              props.text === "Club Leads"
                ? "h-[70px] w-[85px] max-md:h-[45px] max-md:w-[60px]"
                : "h-[70px] w-[75px] max-md:h-[40px] max-md:w-[45px]"
            }`}
            alt={props.text}
          />
          <p
            className={`text-[#333333] font-lato font-extrabold text-[11px] md:text-xl text-center w-full px-2 
              ${
                props.text === "Design" ||
                props.text === "Web Development" ||
                props.text === "Finance" ||
                props.text === "Event Management"
                  ? "pt-5 max-md:pt-2"
                  : props.text === "Competetive Programming" ||
                    props.text === "Club Leads"
                  ? "max-md:pt-1"
                  : ""
              }`}
          >
            {props.text}
          </p>
        </div>

        <div
          className={`flex justify-center gap-2 p-2 
            ${
              props.text === "Competetive Programming" ||
              props.text === "Marketing & Sponsorship"
                ? "pt-2 max-md:pt-2 "
                : props.text1 === "Social"
                ? "pt-2 max-md:pt-3"
                : "pt-9 max-md:pt-5"
            } 
            ${
              props.text === "Web Development" ||
              props.text === "Design" ||
              props.text === "Event Management" ||
              props.text === "Finance"
                ? "md:pt-4"
                : ""
            }`}
        >
          <div className="flex-1 max-w-[125px] max-md:max-w-[105px]">
            <div className="bg-[#4079DA] text-center rounded-[10px] max-md:rounded-[2px] p-1">
              <p className="text-white text-[8px] md:text-xl font-lato font-extrabold truncate">
                {props.point}
              </p>
              <p className="text-white text-[6px] md:text-[15px] font-lato font-medium">
                Points
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-[125px] text-center">
            <p className="text-[#4079DA] text-[11px] md:text-xl font-lato font-extrabold truncate">
              {props.contributionsNumber}
            </p>
            <p className="text-[#4079DA] text-[7px] md:text-[15px] font-lato font-medium">
              Contributions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCreation;
