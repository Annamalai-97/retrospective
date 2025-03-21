import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { FaUsers } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";
import { useRouter } from "next/navigation";
import Modal from "react-modal";
import CreateTeamSteps from "./CreateTeamSteps";
import useFetchTeams from "../hooks/TeamHooks/useFetchTeams";
import useTeamActions from "../hooks/TeamHooks/useTeamActions";

const TeamManagement = () => {
    const router = useRouter();
    const { setTeamData, searchText, setSearchText, filteredData } = useFetchTeams();
    const { handleDelete } = useTeamActions(setTeamData);

    const [openCreate, setOpenCreate] = useState(false);
    const [editTeam, setEditTeam] = useState(null);
    const [edit, setEdit] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState(null);

    const handleCloseDialog = () => {
        setOpenCreate(false);
        setEdit(false);
        setEditTeam(null);
    };

    const handleEdit = (team) => {
        setEditTeam(team);
        setEdit(true);
    };

    const navigate = (id) => router.push(`/manage?id=${id}`);

    const confirmDelete = (teamId) => {
        setSelectedTeamId(teamId);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedTeamId) {
            handleDelete(selectedTeamId);
        }
        setDeleteModalOpen(false);
        setSelectedTeamId(null);
    };

    const selectedTeam = filteredData.find((team) => team._id === selectedTeamId);

    const columns = [
        { selector: (row, index) => index + 1, sortable: true, width: "60px" },
        {
            selector: (row) => row.name,
            cell: (row) => (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-[15px] text-black">{row.name}</span>
                </div>
            ),
            sortable: true,
        },
        {
            cell: (row) => (
                <div className="flex gap-x-3">
                    <button
                        className="text-xl text-primary shadow-md w-8 h-8 rounded-lg flex items-center justify-center"
                        onClick={() => handleEdit(row)}
                    >
                        <MdManageAccounts />
                    </button>
                    <button
                        className="text-xl w-8 h-8 text-red-500 shadow-md rounded-lg flex items-center justify-center"
                        onClick={() => confirmDelete(row._id)}
                    >
                        <RiDeleteBin6Line />
                    </button>
                    <button
                        className="text-sm px-2 h-8 text-primary shadow-md rounded-lg flex items-center gap-2"
                        onClick={() => navigate(row._id)}
                    >
                        <FaUsers className="w-6 h-4" />
                        <span className="text-xs text-primary whitespace-nowrap">Manage</span>
                    </button>
                </div>
            ),
            width: "200px",
        },
    ];

    return (
        <div className="p-4 bg-slate-100 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <FaUsers className="text-sm" />
                    <span className="text-sm font-semibold">Team and User Management</span>
                </div>
                <div className="flex"> 
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border px-3 py-1 rounded-md"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button className="ml-4 px-3 py-1 bg-primary text-white rounded-md" onClick={() => setOpenCreate(true)}>
                        + Create Team
                    </button>
                </div>
            </div>

            <DataTable columns={columns} data={filteredData} striped customStyles={{
                headRow: { style: { display: "none" } },
                rows: { style: { padding: "12px 0", borderBottom: "1px solid #E5E7EB" } },
            }} />

            {
                (openCreate || edit) && (
                    <CreateTeamSteps
                        isModalOpen={openCreate || edit}
                        closeModal={handleCloseDialog}
                        onSave={() => setOpenCreate(false)}
                        editTeam={edit ? editTeam : undefined}
                        setTeamData={setTeamData}
                        setEdit={setEdit}
                        setEditTeam={setEditTeam}
                    />
                )
            }

            <Modal
                isOpen={deleteModalOpen}
                onRequestClose={() => setDeleteModalOpen(false)}
                className="modal-content bg-white border rounded-2xl shadow-lg w-[40%] p-6 relative"
                overlayClassName="modal-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
                ariaHideApp={false}
            >
                <button
                    onClick={() => setDeleteModalOpen(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                >
                    &times;
                </button>

                <div className="flex justify-center mb-3">
                    <img src="/delete.png" alt="Warning" className="w-28 h-28" />
                </div>

                <h2 className="text-lg font-semibold text-center"> Are you sure you want to delete this team ?</h2>
                <p className="text-gray-600 text-center mt-2">
                    You're about to remove the {selectedTeam?.name}  this will permentally erase all boards and associated data.
                </p>

                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={() => setDeleteModalOpen(false)}
                        className="border border-gray-400 px-5 py-2 rounded-lg text-gray-700 hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmDelete}
                        className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </Modal>

        </div >
    );
};

export default TeamManagement;
