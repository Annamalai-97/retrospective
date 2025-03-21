import React, { useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

const DropdownMenu = ({ buttonLabel, options, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md px-3 py-1 bg-white text-sm flex items-center gap-2 border border-gray-300"
      >
        {icon && <img src={icon} alt="icon" className="w-6 h-6 rounded-full" />}
        {buttonLabel}
        {isOpen ? <HiChevronUp className="ml-1" /> : <HiChevronDown className="ml-1" />}
      </button>

      {isOpen && (
        <div className="absolute w-[184px] mt-2 bg-white shadow-lg rounded-md border border-gray-300">
          <ul className="py-2 text-sm text-gray-700">
            {options.map((option, index) => (
              <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
