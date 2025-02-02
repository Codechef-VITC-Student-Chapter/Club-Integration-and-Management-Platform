import { useState } from "react";

function Checkbox() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const [isChecked1, setIsChecked1] = useState(false);

  const handleCheckboxChange1 = () => {
    setIsChecked1(!isChecked1);
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="text-gray-700">Item 1</span>
      </label>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isChecked1}
          onChange={handleCheckboxChange1}
          className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
          style={{ "--tw-ring-color": "#4079DA" }}
        />
        <span className="text-gray-700">Item 2</span>
      </label>
    </div>
  );
}

export default Checkbox;
