import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import useTeamActions from "../hooks/TeamHooks/useTeamActions";

const CreateTeamSteps = ({
    isModalOpen,
    closeModal,
    editTeam,
    setTeamData,
    setEdit,
    setEditTeam
}) => {
    const [teamName, setTeamName] = useState("");
    const [teamAdmin, setAdmin] = useState("");

    const { handleSaveTeam, handleUpdateTeam } = useTeamActions(setTeamData, setEdit, setEditTeam);

    const isEditMode = Boolean(editTeam);

    useEffect(() => {
        if (isEditMode) {
            setTeamName(editTeam.name || "");
        } else {
            setTeamName("");
            setAdmin("");
        }
    }, [editTeam, isEditMode]);

    const handleSave = () => {
        if (teamName && teamAdmin) {
            if (isEditMode) {
                handleUpdateTeam({ ...editTeam, Teamname: teamName, TeamAdmin: teamAdmin });
            } else {
                handleSaveTeam(teamName);
            }
            setTeamName("");
            setAdmin("");
            closeModal();
        }
    };

    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            className="modal-content bg-white border !rounded-2xl shadow-lg h-[60%] w-[35%] p-2"
            overlayClassName="modal-overlay fixed top-0 left-0 w-full min-h-[100%] bg-black bg-opacity-50 flex items-center justify-center mt-4"
            ariaHideApp={false}
        >
            <h2 className="text-xl font-semibold text-start m-3">
                {isEditMode ? "Edit Team" : "Create New Team"}
            </h2>

            <IoMdClose
                className="absolute right-5 top-5 text-xl cursor-pointer text-black"
                onClick={closeModal}
            />
            <hr />

            <div className="flex flex-col items-start w-full p-3">

                <label className="text-sm font-medium">Team Title</label>
                <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full p-2 border rounded mt-1 outline-none"
                    placeholder="Enter Team Name"
                />
                {!isEditMode && (
                    <>
                        <label className="text-sm font-medium"> Team Admin</label>
                        <select
                            value={teamAdmin}
                            onChange={(e) => setAdmin(e.target.value)}
                            className="w-full p-2 border rounded mt-1 outline-none bg-white">
                            <option value="">-Select Team Admin-</option>
                            <option value="Super Admin">Super Admin</option>
                            <option value="Team Admin">Team Admin</option>
                            <option value="Team Member">Team Member</option>
                        </select>
                    </>
                )}
            </div>

            <div className="flex justify-center gap-3 m-3">
                <button
                    onClick={closeModal}
                    className="border border-primary px-1 py-1 rounded"
                >
                    Cancel
                </button>
                <button
                    onClick={isEditMode
                        ? () => handleUpdateTeam({ ...editTeam, Teamname: teamName, TeamAdmin: teamAdmin })
                        : handleSave}
                    className="bg-primary text-white px-2 py-1 rounded-md"
                >
                    {isEditMode ? "Update" : "Save"}
                </button>
            </div>
        </Modal>
    );
};

export default CreateTeamSteps;