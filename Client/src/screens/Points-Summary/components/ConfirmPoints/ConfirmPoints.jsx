import TaskComponent from "../../../../components/TaskComponent";
import { useRunningContext } from "../../../../contexts/RunningContext";
import { departmentMap } from "../../../../lib/keys";

const ConfirmPoints = ({
  id,
  taskName,
  department,
  description,
  points,
  setShowConfirm,
  handleSubmit,
}) => {
  const { currentUser } = useRunningContext();
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl sm:w-3/5 border border-gray-200 ">
        <div className="bg-[#FFAC33] rounded-t-2xl p-3">
          <h2 className="text-gray-800 text-lg font-semibold">
            Confirm your action
          </h2>
        </div>

        <div className="p-4 flex  flex-col justify-center items-center gap-5">
          <div className="w-full flex flex-col justify-center items-center">
            <TaskComponent
              taskName={taskName}
              date={new Date().toLocaleDateString()}
              department={departmentMap[department]}
              description={description}
              id={"TBD"}
              target={id}
              points={points}
              status={"pending"}
            />
            <span className="text-[10px]">
              Target is the user who you are giving points to
            </span>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              className="bg-[#FFAC33] hover:bg-[#FFB94D] text-white font-medium py-1.5 px-6 rounded-lg transition-colors text-sm"
              onClick={() => {
                handleSubmit();
                setShowConfirm(false);
              }}
            >
              Add
            </button>
            <button
              className="border border-gray-300 hover:bg-gray-50 text-gray-600 font-medium py-1.5 px-6 rounded-lg transition-colors text-sm"
              onClick={() => {
                setShowConfirm(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPoints;
