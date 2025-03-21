'use client';
import React, { useState } from 'react';
import TabButtons from './TabButtons';
import { FaUsers, FaUserShield, FaGlobe } from 'react-icons/fa';
import Admins from './Admins';
import GlobalUsers from './GlobalUsers';
import TeamManagement from './TeamManagement';

const Management = () => {
    const [activeTab, setActiveTab] = useState("Teams");
    const [activeIndex, setActiveIndex] = useState(0);
    const [showStarred, setShowStarred] = useState();

    const tabs = [
        { label: 'Teams', onClick: () => setActiveTab("Teams"), icon: <FaUsers /> },
        { label: 'Admins', onClick: () => setActiveTab("Admins"), icon: <FaUserShield /> },
        { label: 'Global Users', onClick: () => setActiveTab("Global Users"), icon: <FaGlobe /> }
    ];

    const handleTabClick = (index) => {
        setActiveIndex(index);
        setShowStarred(index === 1);
        if (tabs[index].onClick) {
          tabs[index].onClick();
        }
      };

    return (
        <div>
            <div className="border-gray-300 border-b-2 flex p-4">
                <TabButtons tabs={tabs} onClick={handleTabClick}  activeIndex={activeIndex} />
            </div>
            {activeTab === "Teams" && <TeamManagement />}
            {activeTab === "Admins" && <Admins />}
            {activeTab === "Global Users" && <GlobalUsers />}
        </div>
    );
};

export default Management;
