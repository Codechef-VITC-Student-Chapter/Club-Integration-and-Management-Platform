import user from "../assets/Frame.png";
import document from "../assets/Document.png";
import points from "../assets/POINTS.png";
import danger from "../assets/Danger.png";
import textarea from "../assets/TEXTAREA.png";

function RejectBox(props) {
  return (
    <div className="w-screen h-screen fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
      <div className="w-3/4 h-3/5 sm:w-3/5 sm:h-3/5 bg-white rounded-3xl">
        <div className="w-full h-16 bg-red-500 rounded-t-3xl flex items-center text-xs sm:text-sm justify-center text-white">
          <img src={danger} className="size-4 mr-3" />
          Enter Rejection Reason
        </div>
        <div className="text-black flex flex-col  text-center  ">
          <div className="flex  mt-12">
            <img
              src={document}
              className=" sm:size-5 size-4  sm:ml-5 ml-2 mr-2"
            />
            <p className="font-sans font-bold  text-xs sm:text-sm">
              REQUEST TITLE :{" "}
            </p>
            <span className="font-sans text-xs sm:text-sm"> {props.title}</span>
          </div>

          <div className="flex  mt-4">
            <img src={user} className="sm:size-5 size-4   sm:ml-5 ml-2 mr-2" />
            <span className="font-sans font-bold text-xs sm:text-sm">
              USERNAME :{" "}
            </span>
            <span className="font-sans text-xs sm:text-sm sm:w-2">
              {" "}
              {props.username}
            </span>{" "}
          </div>

          <div className="flex mt-4">
            <img src={points} className="sm:size-5 size-4 sm:ml-5 ml-2 mr-2" />
            <p className="font-sans font-bold text-xs sm:text-sm">
              POINTS REQUIRED :{" "}
            </p>
            <span className="font-sans text-xs sm:text-sm">
              {" "}
              {props.points}
            </span>
          </div>

          <div className="flex mt-4 items-start flex-col">
            <div className="flex">
              <img
                src={textarea}
                className="sm:size-5 size-4  sm:ml-5 ml-2 mr-2"
              />
              <span className="font-sans font-bold text-xs sm:text-sm mb-2">
                REJECTION REASON{" "}
              </span>
            </div>
            <textarea
              className="border-2 rounded-md ml-5 w-5/6  sm:mx-10  md:mx-10 border-black max-w-3/4 box-border sm:4/6 md:w-5/6  resize-none p-2"
              placeholder="Enter reason for rejection"
              rows="4"
              cols="60"
              onChange={(e) => props.setReason(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="text-black flex justify-center gap-4  mt-5">
          <button
            className="text-white px-2 py-0.5 rounded-lg bg-green-700"
            onClick={props.onSubmit}
          >
            Submit
          </button>
          <button
            className="text-red-400 border-red-400 border-2 px-2  rounded-lg bg-white"
            onClick={props.onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default RejectBox;
