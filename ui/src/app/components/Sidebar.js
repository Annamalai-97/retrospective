'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AiOutlineHome, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { FiSettings, FiTrendingUp } from 'react-icons/fi';
import { MdOutlineTrackChanges } from 'react-icons/md';
import { IoExitOutline } from 'react-icons/io5';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import API from '../Auth_api';

const Sidebar = ({ isSidebarOpen }) => {
  const route = useRouter();
  const [user, setUser] = useState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
       

      if (token) {
        setUser(jwtDecode(token));
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await API.post("/logout");
      Cookies.remove("token");
      localStorage.removeItem("token");
      route.push('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div
      className={`${isSidebarOpen ? 'w-64' : 'w-18'
        } bg-white border-r border-gray-300 h-[calc(100vh-64px)] flex flex-col  ease-in-out`}
    >
      <nav className="space-y-4 flex-grow pt-6">
        <SidebarItem isSidebarOpen={isSidebarOpen} icon={<AiOutlineHome />} label="Home" route="/reflect" />
        <SidebarItem
          isSidebarOpen={isSidebarOpen}
          icon={<AiOutlineUsergroupAdd />}
          label="Team & User Management"
          route="/user"
        />
        <SidebarItem
          isSidebarOpen={isSidebarOpen}
          icon={<FiTrendingUp />}
          label="Analytics & Reporting"
          route="/Analytics"
        />
        <SidebarItem
          isSidebarOpen={isSidebarOpen}
          icon={<MdOutlineTrackChanges />}
          label="Action Tracker"
          route="/action-tracker"
        />
        <SidebarItem isSidebarOpen={isSidebarOpen} icon={<FiSettings />} label="Settings" route="/settings" />
      </nav>

      <div className="overflow-x-auto flex items-center p-4">
        {isSidebarOpen && (
          <>
            <img
              src="https://img.freepik.com/free-photo/portrait-happy-smiling-woman-standing-square-sunny-summer-spring-day-outside-cute-smiling-woman-looking-you-attractive-young-girl-enjoying-summer-filtered-image-flare-sunshine_231208-6734.jpg?semt=ais_hybrid"
              alt="User Avatar"
              className="w-8 h-10 rounded-full"
            />
            <div className="ml-3">
              {user ? (
                <p>{user?.name}</p>
              ) : (
                <p>Please log in to view your profile.</p>
              )}
            </div>
          </>
        )}
        <button
          onClick={handleLogout}
          className={`w-8 h-9 text-xl bg-gray-100 border rounded-md flex items-center justify-center hover:bg-gray-300 ${isSidebarOpen ? 'ml-auto' : 'ml-0.5 p-2'
            }`}
          label="Logout"
        >
          <IoExitOutline />
        </button>
      </div>
    </div>
  );
};

const SidebarItem = ({ isSidebarOpen, icon, label, route }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (e) => {
    e.stopPropagation();
    if (pathname !== route) {
      router.push(route);
    }
  };

  const isActive = pathname.startsWith(route);

  return (
    <div
      onClick={handleNavigation}
      className={`flex items-center text-[10px] ml-3 mr-3 font-semibold h-9 text-gray-700 text-sm cursor-pointer rounded-md
      ${isSidebarOpen ? 'justify-start' : 'justify-center px-5'} 
      ${isActive ? 'bg-[#0089FA] text-white' : 'text-gray'}`}

    >
      <div className={`text-2xl ${isSidebarOpen ? 'ml-2' : ''}`}>{icon}</div>
      {isSidebarOpen && <span className="ml-2">{label}</span>}
    </div>
  );
};

export default Sidebar;
