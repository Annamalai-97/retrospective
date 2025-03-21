import React from "react";

const TeamData = () => {
    return (
        <div className="relative">
            <div className="absolute -top-12 right-0">
                <button
                    onClick={() => handleManageClick(user.id)}
                    className="px-4 py-1 text-white border border-gray-300 rounded-md bg-[#006ED4] shadow-md hover:bg-gray-100 transition"
                >
                    Change Super Admin
                </button>
            </div>
            <div className="mt-10">
                <div className="border p-2 rounded-lg shadow-lg border-[#E0E0E0] bg-[#F7F9FD]">
                    <h2 className="text-lg  font-semibold mb-5">Team Profile</h2>
                    <p className="text-sm font-semibold">ERP Software Team</p>
                    <p className="text-sm font-semibold">
                        Your Role: <span className="text-sm font-thin">Super Admin</span>
                    </p>
                </div>

                <div className="flex gap-6 mt-6">
                    <div className="border p-2 w-64 h-24 rounded-lg shadow-lg border-[#E0E0E0] bg-[#F7F9FD]">
                        <p className="text-sm mb-1">Super Admins: 2</p>
                        <p className="text-sm mb-1">Team Admins:2</p>
                        <p className="text-sm">Total Zones: <span className="font-semibold">2</span></p>
                    </div>

                    <div className="border p-2 w-64 h-24 rounded-lg shadow-lg border-[#E0E0E0] bg-[#F7F9FD]">
                        <p className="text-sm mb-1  ">Total Team Members: 2</p>
                        <p className="text-sm mb-1">Read Only:2</p>
                        <p className="text-sm">Guest Users: <span className="font-semibold">2</span></p>
                    </div>

                    <div className="border p-2 flex-grow  h-24 rounded-lg shadow-lg border-[#E0E0E0] bg-[#F7F9FD] flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm mb-1">
                                Leave <span className="font-semibold">ERP Software Team</span> team
                            </h3>
                            <p className="text-xs mb-2">
                                By leaving this team, you will lose access to all its boards.
                            </p>
                        </div>
                        <button className="px-3 py-0.5 text-xs text-[#006ED4] border border-[#006ED4] rounded-md shadow-md transition self-end">
                            Leave Team
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TeamData;
