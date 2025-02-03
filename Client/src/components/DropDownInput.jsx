import { useState } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

const DropdownField = () => {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  
  const [selected1, setSelected1] = useState('Dropdown field data');
  const [selected2, setSelected2] = useState('Dropdown field data');
  const [selected3, setSelected3] = useState('Dropdown field data');

  const DropdownButton = ({isOpen, setIsOpen, selected, setter, 
    borderColor = "border-gray-300",
    chevronColor = "text-gray-400",
    showAlert = false,
  }) => (
    <div className="w-[250px]">
      <div className="text-sm font-medium text-gray-700 mb-1">Label</div>
      <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)} className={`w-full h-10 px-3 text-left bg-white border rounded-lg flex items-center justify-between ${borderColor} focus:outline-none focus:ring-2 ${showAlert=== true ? 'focus:ring-orange-500 ' : 'focus:ring-blue-500'}  `}>
          <span className={`text-sm ${selected === 'Dropdown field data' ? 'text-gray-500' : 'text-gray-900'}`}>
            {selected}
          </span>
          <div className="flex items-center space-x-2">
            {showAlert && <AlertCircle className="w-4 h-4 text-orange-500" />}
            <ChevronDown className={`w-4 h-4 ${chevronColor} transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}/>
          </div>
        </button>
        
        {isOpen && (
          <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <ul className="py-1">
              {['Option data ', 'Option data ', 'Option data '].map((option) => (
                <li key={option} className={`px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm ${selected === option ? 'bg-gray-50 text-gray-900' : 'text-gray-900'}`}
                  onClick={() => { setter(option); setIsOpen(false);  }}>
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8  flex flex-col justify-center items-center pt-5 ">
      {/* Default Dropdown */}
      <DropdownButton isOpen={isOpen1} setIsOpen={setIsOpen1} selected={selected1} setter={setSelected1}/>

      {/* Focused/Blue Dropdown */}
      <DropdownButton isOpen={isOpen2} setIsOpen={setIsOpen2} selected={selected2} setter={setSelected2} borderColor="border-blue-500" chevronColor="text-blue-500"/>

      {/* Orange Dropdown with Alert */}
      <DropdownButton isOpen={isOpen3} setIsOpen={setIsOpen3} selected={selected3} setter={setSelected3} borderColor="border-orange-500" className="focus:ring-orange-500" showAlert={true}/>

    </div>
  );
};

export default DropdownField;