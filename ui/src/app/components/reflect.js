"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiAddCircleLine } from "react-icons/ri";
import ProjectCard from './projectCard';
import TabButtons from './TabButtons';
import useFetchBoards from '../hooks/BoardHooks/useFetchBoards';
import DropdownMenu from './DropdownMenu';

const Reflect = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return localStorage.getItem('isSidebarOpen') === 'true';
  });
  const [showStarred, setShowStarred] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visiblePopup, setVisiblePopup] = useState(null);
  const { boards: fetchedBoards = [], error } = useFetchBoards();
  const [boards, setBoards] = useState(fetchedBoards);

  React.useEffect(() => {
    setBoards(fetchedBoards);
  }, [fetchedBoards]);

  const handleTabClick = (index) => {
    setActiveIndex(index);
    setShowStarred(index === 1);
  };

  const filteredBoards = boards
    .filter(board => board.defaultboard !== false)
    .filter(board => (!showStarred || board.isFavorite));

  const handleToggleFavorite = (boardId) => {
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId ? { ...board, isFavorite: !board.isFavorite } : board
      )
    );
  };

  const handleDelete = async (boardId) => {
    setBoards((prevBoards) => prevBoards.filter((board) => board._id !== boardId));
    const result = await deleteBoard(boardId);
    if (result.success) {
      setBoards((prevBoards) => prevBoards.filter((board) => board._id !== boardId));
      setVisiblePopup(null);
      refetch?.();
    } else {
      console.error("Failed to delete board:", result.error);
    }
  };

  const handleDotsClick = (boardId, event) => {
    event.stopPropagation();
    setVisiblePopup((prev) => (prev === boardId ? null : boardId));
  };

  React.useEffect(() => {
    const handleClickOutside = () => setVisiblePopup(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleNewBoardClick = () => {
    router.push('/zones');
  };

  const handleCardClick = (board) => {
    if (board?._id) {
      router.push(`/customZones?id=${encodeURIComponent(board._id)}&name=${encodeURIComponent(board.boardName.replace(/\s+/g, '-'))}`);
    } else {
      console.error("Board ID is undefined", board);
    }
  };

  const tabs = [
    { label: 'All Boards' },
    { label: 'Starred Boards' }
  ];

  return (
        <div className= 'flex flex-col min-h-screen'>
          <header className="align-element text-sm p-3 bg-[#0089FA] bg-opacity-[0.13] font-semibold">Created Boards</header>
          <div className="border-gray-300 mb-3  border-b-2 flex ml-3">
            <div className='mt-4'>
              <TabButtons tabs={tabs} activeIndex={activeIndex} onClick={handleTabClick} />
            </div>
            <div className="flex gap-4 mt-2 mb-2 z-10 ml-auto mr-2">
              <DropdownMenu
                className="bg-white"
                buttonLabel="Active Members"
                icon="/green.png"
                options={["Member 1", "Member 2", "Member 3"]}
              />
              <DropdownMenu
                className="bg-white z-10"
                buttonLabel="Active Members"
                icon="/green.png"
                options={["Member 1", "Member 2", "Member 3"]}
              />
            </div>
          </div>

          <div className="flex flex-wrap mt-8 gap-3">
            {!showStarred && (
              <div
                className="ml-6 mb-2 border border-gray-300 w-[170px] h-[200px] rounded-xl flex flex-col items-center justify-center text-gray-500 cursor-pointer"
                onClick={handleNewBoardClick}
              >
                <button className="bg-primary border-2 rounded-full border-blue-200">
                  <RiAddCircleLine className="text-4xl text-white p-1.5" />
                </button>
                <p className='mt-2 text-xs'>New Board</p>
              </div>
            )}

            {error ? (
              <p className="text-red-500 ml-6">Error: {error}</p>
            ) : (
              filteredBoards.length > 0 ? (
                filteredBoards.map((board) => (
                  <ProjectCard
                    key={board._id}
                    project={board}
                    className="h-[201px] rounded-xl"
                    onClick={() => handleCardClick(board)}
                    boardname={true}
                    onToggleFavorite={() => handleToggleFavorite(board._id)}
                    hideDots={false}
                    onDotsClick={(event) => handleDotsClick(board._id, event)}
                    showPopup={visiblePopup === board._id}
                    onDelete={() => handleDelete(board._id)}
                  />
                ))
              ) : (
                <p className="ml-6 text-gray-500">No boards found</p>
              )
            )}
          </div>
        </div>
  );
};

export default Reflect;
