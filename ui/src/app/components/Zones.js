"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RiAddCircleLine } from "react-icons/ri";
import ProjectCard from "./projectCard";
import MultiStepModal from "./MultiStepModal";
import useFetchBoards from "../hooks/BoardHooks/useFetchBoards";
import { useDispatch } from "react-redux";
import { setBoardData } from "../redux/multiStepSlice";

const Zones = () => {
    
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const { boards, error } = useFetchBoards();
    const router = useRouter();
    const dispatch = useDispatch();

    const handleCardClick = (board) => {
        if (!board) {
            setOpenDialog(true);
            setSelectedBoard(null);
            return;
        }

        if (!board.id) {
            console.error("Invalid board data", board);
            return;
        }

        dispatch(setBoardData({
            id: board.id,
            boardName: board.boardName,
            description: board.description,
            title: board.title || [],
            type: board.type || "",
        }));
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedBoard(null);
    };

    return (
        <div>
            <div className="flex p-3 bg-[#0089FA] bg-opacity-[0.13]">
                <header className="align-element text-sm p-1 bg-opacity-[0.13] font-semibold">Default Boards</header>
            </div>

            <div className="flex flex-wrap gap-2">
                <div
                    className="border border-gray-300 w-[170px] h-[216px] mt-4 rounded-xl flex flex-col items-center ml-6 justify-center bg-white text-gray-500 cursor-pointer"
                    onClick={() => handleCardClick(null)}
                >
                    <button className="bg-primary border-2 rounded-full border-blue-200">
                        <RiAddCircleLine className="text-4xl text-white p-1.5" />
                    </button>
                    <p className="text-xs text-center px-5  mt-3"> Create Customize Zones </p>
                </div>

                {error && <p className="text-red-500">{error}</p>}

                {boards
                    .filter(board => board.defaultboard !== true)
                    .map((board, idx) => (
                        <ProjectCard
                            key={idx}
                            project={board}
                            hideDots={true}
                            className="h-[216px] mt-4"
                            showHr={false}
                            onClick={() => handleCardClick(board)}
                            showTitle={true}
                        />
                    ))
                }
            </div>

            {openDialog && (
                <MultiStepModal
                    isModalOpen={openDialog}
                    closeModal={handleCloseDialog}
                    boardData={selectedBoard || null}
                />
            )}
        </div>
    );
};

export default Zones;
