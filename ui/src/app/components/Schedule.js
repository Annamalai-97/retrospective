import React, { useState } from 'react';
import { FaSmile } from "react-icons/fa";

const Schedule = () => {
  const [columns, setColumns] = useState([
    { id: 1, icon: <FaSmile />, text: "Went Well" },
    { id: 2, icon: <FaSmile />, text: "To Improve" },
    { id: 3, icon: <FaSmile />, text: "To Improve" },
  ]);



  const addColumn = () => {
    setColumns([...columns, { id: Date.now(), icon: <FaSmile />, text: "" }]);
  };

  const removeColumn = (id) => {
    setColumns(columns.filter((col) => col.id !== id));
  };
  return (
    <>
      <div className='mt-3 border rounded-md w-full bg-slate-100 p-1'>
        <div className='w-[100%] '>
          <div className='flex justify-between items-center '>
            <h1 className='p-1 text-lg font-semibold ml-1'>Feedback Reminder Settings </h1>
            <button className=' bg-sky-400 rounded-md p-1 text-sm text-white'>save changes</button>

          </div>

          <div className='flex mb-2 ml-1 gap-2'>
            <div className='bg-white border rounded-md p-2'>
              <h4 className='p-1 '>Set date for your retropective</h4>
              <div className='flex p-1'>
                <input type="date" className="border rounded-md text-gray-400 p-1" />
              </div>
            </div>
            <div className='bg-white border rounded-md p-2'>
              <h4 className='p-1 mt-1'>Set time when feedback should be sent to team</h4>
              <div className='flex p-1'>
                <input type="time" className="border rounded-md p-1" />
              </div>
            </div>
            <div className='bg-white border rounded-md p-2'>
              <h4 className='p-1'>Set date for your retrospective</h4>
              <div className='flex p-1'>
                <select className="border rounded-md p-1">
                  <option value="every-week">Every Week</option>
                  <option value="every-day">Every Day</option>
                  <option value="every-week">Every hour</option>

                </select>
              </div>
            </div>



          </div>

        </div>



      </div>


      <div className='border mt-4 rounded-md bg-slate-100'>
        <div className='flex p-1'>
          <h1 className='text-lg font-semibold ml-2'>Board Auto-creation settings </h1>
        </div>
        <div className='flex justify-between items-center p-2 border-y '>
          <p>Columns</p>
          <button className=' bg-sky-400 rounded-md p-1 text-sm text-white' onClick={addColumn}>+ create Column</button>

        </div>

        <div className=' flex-col w-[300px]'>

          {columns.map((column) => (
            <div key={column.id} className="flex items-center gap-3 p-2 rounded-lg">
              <span className="  border-r-2 border-gray-200 p-2 text-lg">{column.icon}</span>
              <input
                type="text"
                className=" flex w-[90%] px-5 py-1 border rounded-md text-start focus:outline-none"
                value={column.text}
                onChange={(e) => {
                  setColumns(
                    columns.map((col) =>
                      col.id === column.id ? { ...col, text: e.target.value } : col
                    )
                  );
                }}
              />
              <div className='bg-white px-1 rounded-md'>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"

                  />
                  <div className="relative w-9 h-4 bg-blue-500 peer-checked:bg-primary rounded-full 
        after:absolute after:w-2 after:h-2 after:bg-white after:rounded-full 
        after:top-[4px] after:left-[2px] after:transition-all 
        peer-checked:after:translate-x-5">
                  </div>
                </label>
              </div>


            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Schedule