import React from 'react';

const TabButtons = ({ tabs, activeIndex, onClick }) => {
  return (
    <div className="flex">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => onClick(index)}
          className={`relative flex items-center ml-6 first:ml-0 text-gray-800 text-sm font-medium no-underline 
            after:content-[''] after:absolute after:left-0 after:bottom-[-15px] after:w-full after:h-[2px] 
            after:bg-black after:duration-200 
            ${activeIndex === index ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'}`}
        >
          {tab.icon && <span className="mr-1">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabButtons;
