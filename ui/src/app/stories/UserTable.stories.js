import React from 'react';
import { FaUsers } from 'react-icons/fa';
import { RiUserSettingsLine } from 'react-icons/ri';
import UserTable from '../components/UserTabel';

export default {
  title: 'Components/UserTable',
  component: UserTable,
};

const sampleUsers = [
  { id: 1, name: 'Alice', label: 'Super Admin', disableActions: false },
  { id: 2, name: 'Bob', label: 'Team Member', disableActions: false },
  { id: 3, name: 'Charlie', label: 'Guest', disableActions: true },
];

export const Default = () => <UserTable data={sampleUsers} title titles />;

export const WithSearch = () => <UserTable data={sampleUsers} search />;

export const WithActions = () => (
  <UserTable data={sampleUsers} edit deletes manage adduser />
);

export const DifferentLabels = () => (
  <UserTable
    data={sampleUsers}
    titleadmins
    titleglobal
    createteam
    changesuperadmin
  />
);

export const ToggleFeature = () => (
  <UserTable data={sampleUsers} toggle />
);

export const SearchBar = () => (
  <div className="relative w-30">
    <input
      type="text"
      placeholder="Search..."
      className="px-10 py-1 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    <FaUsers className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
  </div>
);

export const ManageButton = () => (
  <button className="flex items-center px-3 py-1 text-blue-500 border border-gray-300 rounded-md">
    <RiUserSettingsLine className="mr-2" /> Manage
  </button>
);
