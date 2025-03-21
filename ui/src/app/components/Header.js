'use client';

import React, { useEffect, useState } from 'react';
import { RiMenuUnfold4Line } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";
import { CiSettings } from "react-icons/ci";
import { FiBell } from "react-icons/fi";
import { FaMoon, FaUser, FaShieldAlt, FaSignOutAlt } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import { MdArrowForwardIos } from "react-icons/md";
import API from '../Auth_api';
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';

const Header = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await API.post("/logout");
      Cookies.remove("token");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDarkToggle = () => {};
  return (
    <header className="sticky top-0 w-full bg-white p-4 shadow-md z-20">
      <div className="flex justify-between items-center">
        <div className="flex">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-medium text-blue-600 flex items-center">
              <img
                src="/Logo2.png"
                alt="Reflect Logo"
                className="h-8 ml-4"
              />
            </h1>
          </div>
          <div className="flex ml-6 space-x-2 mt-1">
            <button
              onClick={toggleSidebar}
              className=" text-2xl  w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
            >
              <RiMenuUnfold4Line size={18} />
            </button>
            <button className=" text-2xl  w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <IoIosSearch />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 mr-6">

          <button className="  text-xl  w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <FiBell />
          </button>
          <button className=" text-2xl w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center " onClick={() => setIsOpen(!isOpen)}>
            <CiSettings />
          </button>
        </div>
        {isOpen && (
          <div className="fixed right-6 top-20 bg-white w-64 border shadow-md rounded-xl p-2 z-[9999999] before:absolute 
       before:content-[''] before:w-0 before:h-0 before:border-l-8 before:border-r-8 before:border-b-8 
       before:border-l-transparent before:border-r-transparent before:border-b-white
       before:top-[-8px] before:right-5">
            <h3 className='p-2'>Settings</h3>
            <hr className='w-full' />

            <div className="bg-white">
              <div className='ml-1'>
                <div className="flex items-center ">


                  <div className='flex-col gap-2 w-full h-10 m-2'>
                    <div className="ml-3">
                      {user ? (
                        <>
                          <p>{user?.name}</p>
                          <p className='text-[13px] text-neutral-400'>{user?.email}</p>
                        </>
                      ) : (
                        <p>Please log in to view your profile.</p>
                      )}
                    </div>
                  </div>


                  <div className='absolute right-8 top-21 mt-2 text-xl p-0'>
                    <MdArrowForwardIos />
                  </div>

                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-2 cursor-pointer hover:bg-gray-100 rounded-md">

                <div className="flex items-center gap-2">

                  <FaMoon className="w-4 h-4" />
                  <span className=" text-sm">Dark Mode</span>
                </div>
                <div className='flex justify-between items-center'>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      onChange={() => handleDarkToggle()}
                    />
                    <div className="relative w-7 h-4 bg-blue-300 peer-checked:bg-blue-600 rounded-full 
                     after:absolute after:w-3 after:h-3 after:bg-white after:rounded-full 
                     after:top-[2px] after:left-[2px] after:transition-all peer-checked:after:translate-x-full">
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between px-5 py-2 cursor-pointer hover:bg-gray-100 rounded-md">
                <div className="flex items-center gap-2">
                  <FaUser className="w-4 h-4 text-green-500" />
                  <span className=" text-sm">Active Status</span>
                </div>
                <div className='flex justify-between items-center'>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      onChange={() => handleDarkToggle()}
                    />
                    <div className="relative w-7 h-4 bg-blue-300 peer-checked:bg-blue-600 rounded-full 
                     after:absolute after:w-3 after:h-3 after:bg-white after:rounded-full 
                     after:top-[2px] after:left-[2px] after:transition-all peer-checked:after:translate-x-full">
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex items-center px-5 cursor-pointer py-2 hover:bg-gray-100 rounded-md">
                <GoBell className="w-4 h-4 text-red-500" />
                <span className="ml-2 text-sm">Notifications</span>
                <div className='absolute right-9 top-21 text-sm p-0'>
                  <MdArrowForwardIos />
                </div>
              </div>


              <div className="flex items-center px-5  cursor-pointer py-2 hover:bg-gray-100 rounded-md">
                <FaShieldAlt className="w-4 h-4 text-blue-500" />
                <span className="ml-2 text-sm">Security</span>
                <div className='absolute right-9 top-21  text-sm p-0'>
                  <MdArrowForwardIos />
                </div>
              </div>
            </div>


            <div className="border-t bg-white" onClick={handleLogout}>
              <div className="flex items-center px-5 py-2 cursor-pointer hover:bg-gray-100 rounded-md text-red-500">
                <FaSignOutAlt className="w-4 h-4" />
                <span className="ml-2 text-md">Logout</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
