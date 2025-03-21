'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import TabButtons from './TabButtons';
import { FaUsers, FaUserShield } from 'react-icons/fa';
import { BiUserPin } from "react-icons/bi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import Schedule from './Schedule';
import GuestUser from './GuestUser';
import TeamData from './teamData';
import useFetchTeamById from '../hooks/TeamHooks/useFetchTeamById';
import useAddUserToTeam from '../hooks/TeamHooks/useAddUserToTeam';

const DataTable = dynamic(() => import('react-data-table-component'), { ssr: false });

const roleColors = {
  'Super Admin': 'bg-[#FFDEC6] text-[#C66146]',
  'manager': 'bg-[#FFC5DC] text-[#BF003D]',
  'member': 'bg-[#CCEEFF] text-[#4664C6]',
  'Admin': 'bg-[#FFDEC6] text-[#C66146]',
  'User': 'bg-[#FFC5DC] text-[#BF003D]',
};
const roles = ["Super Admin", "Manager", "Member", "Admin", "User"];
const getRoleBadge = (role) => (
  <span className={`px-4 py-1 text-sm font-semibold rounded-md ${roleColors[role] || "bg-gray-200 text-gray-600"}`} style={{ minWidth: "130px", display: "inline-block", textAlign: "center" }}>
    {role}
  </span>
);

const getUserAvatar = (name) => {
  const initials = name.split("")[0].substring(0, 2).toUpperCase();
  const colors = ['bg-[#60D9CF]', 'bg-[#4869D3]', 'bg-[#D157B3]', 'bg-[#DC904E]'];
  const bgColor = colors[name.length % colors.length];
  return (
    <div className={`w-9 h-9 flex items-center justify-center rounded-full ${bgColor} text-white font-bold text-lg`}>
      {initials}
    </div>
  );
};

const tabs = [
  { label: 'User Management', icon: <FaUsers /> },
  { label: 'Team Profile', icon: <FaUserShield /> },
  { label: 'Guest Users', icon: <BiUserPin /> },
  { label: 'Scheduler', icon: <RiCalendarScheduleLine /> }
];

const TeamProfile = () => {
  const searchParams = useSearchParams();
  const teamId = searchParams.get('id');
  const { team: teamData, error , refetch } = useFetchTeamById(teamId);
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("User");

  const { handleAddTeam, loading, message, setMessage } = useAddUserToTeam();
  const handleTabClick = (index) => setActiveTab(index);

  const userColumns = [
    {
      selector: (row, index) => index + 1,
      width: "60px",
    },
    {
      selector: row => row.email,
      cell: row => (
        <div className="flex items-center gap-5">
          {getUserAvatar(row.email)}
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      selector: (row) => row.role,
      cell: (row) => <div className="text-sm w-full mr-4">{getRoleBadge(row.role)}</div>,
      grow: 1,
      style: { textAlign: "right" },
    }
  ];

 const users = Array.isArray(teamData)
  ? teamData.filter(user => user.team_ids?.some(team => team.teamId === teamId))
  : [];


  return (
    <div>
      <div className="border-gray-300 border-b-2 flex p-4 justify-between">
        <TabButtons tabs={tabs} onClick={handleTabClick} activeIndex={activeTab} />
      </div>

      <div className="p-6">
        {activeTab === 0 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <FaUsers className="text-sm" />
                <span className="text-sm font-semibold">User Management</span>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-1 text-white border rounded-lg bg-[#0089FA] transition duration-300 ease-in-out"
              >
                + Add User
              </button>
            </div>

            {error && <p className="text-red-500">Error: {error}</p>}
            {users.length > 0 ? (
              <DataTable
                striped
                columns={userColumns}
                data={users}
                customStyles={{
                  headRow: { style: { display: "none" } },
                  rows: { style: { padding: "12px 0", borderBottom: "1px solid #E5E7EB" } },
                }}
              />
            ) : (
              <p className="text-gray-500">No users found for this team.</p>
            )}
          </>
        )}

        {activeTab === 1 && <TeamData />}
        {activeTab === 2 && <GuestUser />}
        {activeTab === 3 && <Schedule />}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] space-y-4">
            <h2 className="text-lg font-semibold">Add User to Team</h2>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter User ID"
              className="w-full border p-2 rounded-lg focus:outline-none"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border p-2 rounded-lg focus:outline-none"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>

            {message && <p className="text-red-500 text-sm">{message}</p>}
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-1 rounded-lg border">Cancel</button>
              <button
              onClick={() => handleAddTeam(userId, teamId, role, () => { 
                setShowModal(false); 
                setUserId(''); 
                setRole("User");
                setMessage(''); 
                refetch();
              })}
              
                disabled={loading}
                className="px-4 py-1 rounded-lg text-white bg-[#0089FA] disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamProfile;
