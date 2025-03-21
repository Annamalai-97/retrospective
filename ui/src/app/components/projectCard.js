import React, { useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { FaEdit, FaTrash } from "react-icons/fa";
import useDeleteBoard from "../hooks/BoardHooks/useDeleteBoard";

const ProjectCard = ({
    project,
    hideDots,
    className = "",
    showHr = true,
    showTitle,
    onToggleFavorite,
    boardname,
    isSelected,
    onClick = () => { },
}) => {
    const { deleteBoard, loading } = useDeleteBoard();
    const [showPopup, setShowPopup] = useState(false);

    const handleDotsClick = (e) => {
        e.stopPropagation();
        setShowPopup(!showPopup);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        const result = await deleteBoard(project._id);
        if (result.success) {
            console.log("Board deleted successfully!");
        } else {
            console.error("Failed to delete board:", result.error);
        }
        setShowPopup(false);
    };

    return (
        <div
            className={`relative border rounded-lg shadow-sm hover:shadow-md w-[170px] ml-6 bg-white flex flex-col cursor-pointer 
            ${isSelected ? "border-[#0084FF]" : "border-gray-300"} ${className}`}
            onClick={() => onClick(project)}
        >
            <div className="p-1 flex justify-between items-center">
                {boardname ? (
                    <h4 className="ml-2 mt-1 text-[12px] truncate overflow-hidden whitespace-nowrap w-[160px]">
                        {project.boardName}
                    </h4>
                ) : (
                    <div></div>
                )}
                <div className="flex items-center relative">
                    <button
                        className="ml-1 mr-0.5 mt-1 text-gray-500 hover:text-red-500"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite && onToggleFavorite(project.id);
                        }}
                    >
                        {project.isFavorite ? <FaStar className="text-red-500" /> : <FaRegStar />}
                    </button>
                    {!hideDots && (
                        <button onClick={handleDotsClick} className="text-[#373737] mt-1 relative">
                            <HiOutlineDotsVertical />
                        </button>
                    )}

                    {showPopup && (
                        <div className="absolute top-8 -right-3  bg-white shadow-xl rounded-lg border w-28 z-0 before:absolute  before:content-[''] before:w-0 before:h-0 before:border-l-8 before:border-r-8 before:border-b-8 
          before:border-l-transparent before:border-r-transparent 
           before:top-[-8px] before:right-3">
                            <button
                                className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-100 w-full text-sm rounded-md"
                                disabled={loading}
                            >
                                <FaEdit className="text-gray-500" />
                                Edit
                            </button>
                            <div className="border-t border-gray-400 "></div>
                            <button
                                className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-100 w-full text-sm rounded-md"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                <FaTrash className="text-gray-500" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {showHr && <hr className="border border-slate-200" />}
            <div>
                <img
                    src={project.image || "/img.png"}
                    className="w-34 mt-2 h-32 object-contain mx-auto p-2"
                    alt={project.name || "Default Image"}
                />
            </div>

            <hr className="border border-gray-100" />
            <div className="border-t border-gray-300 text-gray-500 text-xs flex flex-col items-center min-h-[50px] p-1">
                {showTitle ? (
                    <p className="font-light text-center text-xs break-words px-4">
                        {Array.isArray(project.title) ? project.title.join(", ") : project.title}
                    </p>
                ) : (
                    <p className="mb-1 text-[9px] items-center">
                        Modified by admin on{" "}
                        {new Date(project.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                        })}
                    </p>
                )}
                <p className="text-[14px] text-black text-center font-bold">{project.data}</p>
            </div>
        </div>
    );
};

export default ProjectCard;
