"use client"

import React, { useState } from 'react';
import TabButtons from './TabButtons';
import { FaUsers, FaUserShield, FaGlobe } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Analytics = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const suggestions = ["Great team performer", "Congrats! You’re Amazing!"];

  const handleSelectChange = (e) => {
    setSelectedSuggestion(e.target.value);
  };

  const tabs = [
    { label: 'Action Tracker Insights', onClick: () => setActiveTab(0), icon: <FaUsers /> },
    { label: 'Team & Board Insights', onClick: () => setActiveTab(1), icon: <FaUserShield /> },
    { label: 'Meeting Insights', onClick: () => setActiveTab(2), icon: <FaGlobe /> }
  ];

  const data = [
    { name: "Retrospective", Completed: 40, Open: 20, InProgress: 40 },
    { name: "Delicato App", Completed: 50, Open: 30, InProgress: 20 },
    { name: "MYME App", Completed: 60, Open: 10, InProgress: 30 },
    { name: "Delicato V5", Completed: 70, Open: 15, InProgress: 15 },
    { name: "Scriptum Website", Completed: 45, Open: 25, InProgress: 30 },
    { name: "ERP Project", Completed: 80, Open: 10, InProgress: 10 },
    { name: "Delicato V4", Completed: 55, Open: 20, InProgress: 25 },
    { name: "Delicato V3", Completed: 65, Open: 20, InProgress: 15 }
  ];

  return (
      <div>
          <div className="border-gray-300 border-b-2 flex p-4">
            <TabButtons tabs={tabs} onClick={(index) => tabs[index].onClick()} />
          </div>
          {activeTab === 0 && (
            <div className="mt-4 overflow-x-auto">
              <select
                value={""}
                onChange={handleSelectChange}
                className="w-[35%] justify-end ml-4 border border-gray-200 rounded-lg px-4 py-0.5 focus:outline-none"
              >
                <option value="">
                  Active Team: {selectedSuggestion || "None"}
                </option>
                {suggestions.map((suggestion, index) => (
                  <option key={`${suggestion}-${index}`} value={suggestion}>
                    {suggestion}
                  </option>
                ))}
              </select>
              <div className='bg-[#F4F7FCBF] mt-4'>
                <div className='p-2 flex'>
                  <header className="align-element text-sm ml-6 mt-1 font-bold">Action items</header>
                  <div className=''>
                  <select
                value={""}
                onChange={handleSelectChange}
                className="w-[65%] ml-4 border border-gray-200 rounded-lg px-4 py-0.5 focus:outline-none"
              >
                <option value="">
                  All
                </option>
                {suggestions.map((suggestion, index) => (
                  <option key={`${suggestion}-${index}`} value={suggestion}>
                    {suggestion}
                  </option>
                ))}
              </select>
                </div>
                </div>
                <hr className='border border-gray-300'></hr>
                <div className="flex justify-left ml-10 gap-2 mt-2 mb-2">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-[#0084FF] inline-block rounded-full mr-1"></span>
                    <span className="text-black font-normal">Completed</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-[#0084FF61] inline-block rounded-full mr-1"></span>
                    <span className="text-black font-normal">Open</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-[#0084FF2E] inline-block rounded-full mr-1"></span>
                    <span className="text-black font-normal">In Progress</span>
                  </div>
                </div>
                <hr className='border border-gray-300'></hr>
                <div className="mt-6 w-full flex ">
                  <ResponsiveContainer width={850} height={300}>
                    <BarChart data={data} barSize={30}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis className='text-sm' dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Completed" stackId="a" fill="#0084FF" name="Completed" />
                      <Bar dataKey="Open" stackId="a" fill="#0084FF61" name="Open" />
                      <Bar dataKey="InProgress" stackId="a" fill="#0084FF2E" name="In Progress" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
  );
};

export default Analytics