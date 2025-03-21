"use client";
import React from "react";
import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { FaSmile, FaTrash } from "react-icons/fa";
import ProjectCard from "./projectCard";
import { useDispatch, useSelector } from "react-redux";
import {
    nextStep,
    prevStep,
    setZoneName,
    setDescription,
    setType,
    setTitles,
    resetModal,
} from "../redux/multiStepSlice";
import useCreateBoard from "../hooks/BoardHooks/useCreateBoard";
import { useRouter } from "next/navigation";


const MultiStepModal = ({ isModalOpen, closeModal }) => {
    const { createBoard, loading } = useCreateBoard();
    const router = useRouter()
    const dispatch = useDispatch();
    const { step, zoneName, description, type, titles } = useSelector(
        (state) => state.multiStepModal
    );

    const handleNext = () => dispatch(nextStep());
    const handlePrev = () => dispatch(prevStep());

    const addColumn = () => {
        dispatch(setTitles([...titles, { id: Date.now(), title: "", comments: [] }]));
    };

    const removeColumn = (id) => {
        dispatch(setTitles(titles.filter((col) => col.id !== id)));
    };

    const handleCreateBoard = async () => {
        if (!type) {
            alert("Please select a board type before proceeding.");
            return;
        }

        const boardData = {
            boardName: zoneName,
            description,
            type: type,
            titles: titles.map((col, index) => ({
                [`t${index + 1}`]: { title: col.title, comment: [], key: `t${index + 1}` }
            })),
        };

        console.log("Before Sending:", { boardName: zoneName, description, type: type, titles });

        console.log("Final boardData:", boardData);

        const result = await createBoard(boardData);

      
        if (result.success) {
            dispatch(resetModal());
            closeModal();
            router.push('/reflect');
        } else {
            if (result.error === "Board name already exists!") {
                alert("A board with this name already exists. Please choose a different name.");
            } else {
                alert(result.error);
            }
        }
    };
    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            className="modal-content bg-white border !rounded-lg shadow-lg h-[60%] w-[60%] flex flex-col"
            overlayClassName="modal-overlay fixed top-0 left-0 w-full min-h-[100%] bg-black bg-opacity-50 flex items-center justify-center mt-4"
            ariaHideApp={false}
        >
            <IoMdClose
                className="absolute right-5 top-5 text-xl cursor-pointer text-black"
                onClick={closeModal}
            />
            <hr />

            <div className="flex-1 min-h-[300px] flex flex-col justify-center items-center">
                {step === 1 && (
                    <div className="flex items-start w-full p-6">
                        <div className="w-1/2">
                            <label className="text-sm font-medium">Board Name</label>
                            <input
                                type="text"
                                value={zoneName}
                                onChange={(e) => dispatch(setZoneName(e.target.value))}
                                className="w-full p-2 border rounded mt-1 outline-none placeholder:text-sm"
                                placeholder="Board Name"
                                required
                            />
                            <label className="text-sm font-light mt-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => dispatch(setDescription(e.target.value))}
                                className="w-full p-2 border h-28 resize-none outline-none placeholder:text-sm"
                                placeholder="Add Description"
                            />
                        </div>
                        <div className="w-1/2 flex justify-center items-center">
                            <img
                                src="/6294049 1.png"
                                alt="Board Template"
                                className="max-w-[50%] mt-4 h-auto rounded-lg"
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col items-center w-full mt-8">
                        <div className="flex justify-center gap-2 mb-4">
                            <ProjectCard
                                project={{ image: "Untitled-1346 1.png", data: "Standard Board" }}
                                onClick={() => dispatch(setType("Standard Board"))}
                                hideDots={true}
                                showStar={false}
                                showHr={false}
                                showTitle={true}
                                isSelected={type === "Standard Board"}
                            />
                            <ProjectCard
                                project={{ image: "/6294049 1.png", data: "Phased Board" }}
                                onClick={() => dispatch(setType("Phased Board"))}
                                hideDots={true}
                                showStar={false}
                                showHr={false}
                                showTitle={true}
                                isSelected={type === "Phased Board"}
                            />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col items-center w-full">
                        {titles.map((column, index) => (
                            <div key={index} className="flex items-center gap-3 p-2">
                                <FaSmile className="text-lg" />
                                <input
                                    type="text"
                                    className="w-[90%] px-5 py-1 border rounded-md outline-none"
                                    value={column.title}
                                    onChange={(e) =>
                                        dispatch(setTitles(
                                            titles.map(col =>
                                                col && col.id === column.id ? { ...col, title: e.target.value } : col || { id: column.id, title: e.target.value }
                                            )
                                        ))
                                    }



                                />
                                <button
                                    onClick={() => removeColumn(column.id)}
                                    className="text-red-500 border px-2 rounded-md py-2 border-gray-500"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addColumn}
                            className="border border-primary ml-2 p-1 mt-2 mb-2 text-blue-600 rounded-md"
                        >
                            + Create Column
                        </button>
                    </div>
                )}
            </div>

            <div className="flex justify-center gap-3 m-3">
                {(step === 1 &&
                    <button onClick={closeModal} className="border border-primary px-1 py-1 ml-6  rounded ">
                        Cancel
                    </button>
                )}
                {step > 1 && (
                    <button onClick={handlePrev} className="border border-primary px-3 py-1 rounded ml-5">
                        Back
                    </button>
                )}
                {step < 3 && (
                    <button onClick={handleNext} className="bg-primary text-white px-3 py-1 rounded-md">
                        Next
                    </button>
                )}
                {step === 3 && (
                    <button onClick={handleCreateBoard} className="bg-primary text-white px-2 py-1 rounded-md">
                        {loading ? "Creating..." : "Create"}
                    </button>
                )}
            </div>
        </Modal>
    );
};

export default MultiStepModal;
