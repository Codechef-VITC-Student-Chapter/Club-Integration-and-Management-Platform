import React from 'react';
import UserIcon from './Assets/UserIcon';
import DeptIcon from './Assets/DeptIcon';
import ScoreIcon from './Assets/ScoreIcon';

const AddPoints = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-xl overflow-hidden md:w-2/3 lg:w-2/5">
        <div className="bg-[#20614C] w-32 md:w-1/3 rounded-tl-lg rounded-br-lg">
          <h2 className="text-white text-lg md:text-xl font-semibold px-4 py-2 md:px-6 md:py-3">
            Add Points
          </h2>
        </div>

        <div className="p-4 md:p-6">
          <div className="max-w-md mx-auto space-y-4 md:space-y-6">
            <div className="flex items-center justify-between px-0 md:px-4 overflow-x-auto">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-[#20614C]">
                  <UserIcon />
                </span>
                <span className="text-[#20614C] text-sm md:text-base font-medium">Name</span>
              </div>
              
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-[#20614C]">
                  <DeptIcon />
                </span>
                <span className="text-[#20614C] text-sm md:text-base font-medium">Department</span>
              </div>
              
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-[#20614C]">
                  <ScoreIcon />
                </span>
                <span className="text-[#20614C] text-sm md:text-base font-medium">100</span>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">Title</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#20614C] focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  How many points would you like to add?
                </label>
                <input 
                  type="number"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#20614C] focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Detailed Description
                </label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-[#20614C] focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                className="bg-[#20614C] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#20614C] focus:ring-offset-2 text-sm"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPoints;