import { useState } from "react";
import UserIcon from "./Assets/UserIcon";
import DeptIcon from "./Assets/DeptIcon";
import DateIcon from "./Assets/DateIcon";

const ConfirmPoints = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const description =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vehicula turpis nec justo venenatis, at ultricies libero bibendum. Sed tincidunt lorem nec lorem auctor.";

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl sm:w-3/5 border border-gray-200 ">
        <div className="bg-[#FFAC33] rounded-t-2xl p-3">
          <h2 className="text-gray-800 text-lg font-semibold">
            Confirm your action
          </h2>
        </div>

        <div className="p-4">
          <div className="border border-[#FFAC33] rounded-lg px-4 pt-0 pl-0 mb-3 w-4/5 mx-auto">
            <div className="bg-[#FFAC33] text-gray-800 px-4 py-1 rounded-tl-lg rounded-br-lg inline-block font-medium mb-4">
              TaskName
            </div>

            <div className="pl-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <UserIcon className="text-gray-600 w-4" />
                  <span className="text-gray-600 min-w-[80px]">Target:</span>
                  <span className="text-gray-800">XYZZZZ</span>
                </div>

                <div className="flex items-center gap-2">
                  <DeptIcon className="text-gray-600 w-4" />
                  <span className="text-gray-600 min-w-[80px]">
                    Department:
                  </span>
                  <span className="text-gray-800">Web Dev</span>
                  <div className="ml-auto">
                    <span className="bg-[#FFAC33] text-gray-800 w-12 h-12 flex items-center justify-center rounded-full font-medium">
                      10
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DateIcon className="text-gray-600 w-4" />
                  <span className="text-gray-600 min-w-[80px]">Date:</span>
                  <span className="text-gray-800">30/12/2024</span>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-600">Task Description:</span>
                  <p className="text-gray-700 text-sm">
                    {isExpanded
                      ? description
                      : `${description.slice(0, 45)}...`}
                    {description.length > 45 && (
                      <button
                        onClick={toggleExpand}
                        className="text-gray-600 hover:text-gray-800 ml-1 underline"
                      >
                        {isExpanded ? "See Less" : "See More..."}
                      </button>
                    )}
                  </p>
                </div>

                <div className="text-gray-400 text-xs pt-0 pb-2">
                  CID2ZBCE3007172700244J384
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button className="bg-[#FFAC33] hover:bg-[#FFB94D] text-white font-medium py-1.5 px-6 rounded-lg transition-colors text-sm">
              Add
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-600 font-medium py-1.5 px-6 rounded-lg transition-colors text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPoints;
