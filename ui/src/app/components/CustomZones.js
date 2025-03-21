'use client';

import React, { useState, useEffect } from 'react';
import EmojiInputField from './EmojiInputField';
import DropdownMenu from './DropdownMenu';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BiSortAlt2 } from "react-icons/bi";
import { LuMessageSquareMore } from "react-icons/lu";
import { BsEmojiSmile } from "react-icons/bs";
import { MdOutlineCelebration } from "react-icons/md";
import { CiShare2 } from 'react-icons/ci';
import { useSearchParams } from 'next/navigation';
import CelebrationInputField from './CelebrationInputField';
import useFetchBoardDetails from '../hooks/BoardHooks/useFetchBoardDetails';
import { useRouter } from 'next/navigation';
import BoardSharePopup from './BoardSharePopup';
import useHandleMessageSubmit from '../hooks/BoardHooks/useHandleMessageSubmit';
import useHandleReplySubmit from '../hooks/BoardHooks/useHandleReplySubmit';
import useHandleDeleteComment from '../hooks/BoardHooks/useHandleDeleteComment';

const CustomZones = () => {
  const [activeInput, setActiveInput] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState({});
  const boardId = searchParams.get('id');
  const token = searchParams.get('token');
  const [boardInfo, setBoardInfo] = useState(null);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState({});
  const [activeInputType, setActiveInputType] = useState({});
  const [inputVisibility, setInputVisibility] = useState({});
  const [dropdownVisibility, setDropdownVisibility] = useState({});
  const { boardDetails } = useFetchBoardDetails(boardId);
  const [board, setBoard] = useState(null);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isAscending, setIsAscending] = useState(true);
  const [activeReactionIndex, setActiveReactionIndex] = useState(null); 2
  const [replyText, setReplyText] = useState('');
  const [ReplyInputVisibility, setReplyInputVisibility] = useState('');
  const [comments, setComments] = useState()
  const [activeButton, setActiveButtons] = useState({});


  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/boards/${boardId}/comments`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {

        const messagesMap = {};
        data.forEach((msg) => {
          if (!messagesMap[msg.titleKey]) {
            messagesMap[msg.titleKey] = [];
          }
          messagesMap[msg.titleKey].push(msg);
        });
        Object.keys(messagesMap).forEach((key) => {
          messagesMap[key].reverse();
        });

        setMessages(messagesMap);
      } else {
        console.error("Error fetching messages:", data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const { handleMessageSubmit, loading: messageLoading, error: messageError } = useHandleMessageSubmit(fetchMessages);
  const { handleReplySubmit, loading: replyLoading, error: replyError } = useHandleReplySubmit(fetchMessages);
  const { handleDeleteComment, loading: deleteLoading, error: deleteError } = useHandleDeleteComment(fetchMessages);

  useEffect(() => {
    if (!token || !boardId) {
      setError("Invalid access link.");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/verify-invitation?id=${boardId}&token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setBoardInfo(data.boardInfo);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to verify access.");
      }
    };

    verifyToken();
  }, [boardId, token]);

  useEffect(() => {
    if (!boardId) return;
    fetchMessages();
  }, [boardId]);

  const toggleInputField = (category, type) => {
    setInputVisibility((prev) => ({
      ...prev,
      [category]: prev[category] && activeInputType[category] === type ? false : true,
    }));

    setActiveInputType((prev) => ({
      ...prev,
      [category]: prev[category] === type ? null : type,
    }));

    setActiveInput((prevActive) => (prevActive === category ? null : category));
  };

  const handleInputFocus = (key) => {
    setDropdownVisibility((prev) => ({ ...prev, [key]: true }));
  };

  const handleClick = (key, type) => {
    setActiveButtons((prev) => ({
      ...prev,
      [key]: prev[key] === type ? null : type,
    }));
    toggleInputField(key, type);
  };


  const handleInputBlur = (key) => {
    setTimeout(() => {
      setDropdownVisibility((prev) => ({ ...prev, [key]: false }));
    }, 200);
  };

  const handleSortMessages = (titleKey) => {
    setMessages((prevMessages) => {
      if (!prevMessages[titleKey]) {
        return prevMessages;
      }

      const sortedMessages = [...prevMessages[titleKey]].sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return isAscending ? timeA - timeB : timeB - timeA;
      });

      return { ...prevMessages, [titleKey]: sortedMessages };
    });

    setIsAscending((prev) => !prev);
  };


  useEffect(() => {
    if (boardDetails) {
      setBoard(boardDetails);
    }
  }, [boardDetails]);

  const handleBoardShare = (boardDetails) => {
    if (!boardDetails) {
      console.error("Board details are null or undefined");
      return;
    }
    setSelectedBoard(boardDetails);
    setShowSharePopup(true);
  };

  return (

    <div>
      <div className="flex justify-between items-center bg-[#0089FA] bg-opacity-[0.13] border-gray-100 mb-8">
        <h6 className="p-4 text-sm ml-2 font-semibold">{boardDetails?.boardName}</h6>
        <div className="gap-6 flex mr-10">
          <DropdownMenu
            className='bg-white'
            buttonLabel="Active Members"
            icon="/green.png"
            options={["Member 1", "Member 2", "Member 3"]}
          />
          {(
            <button onClick={() => handleBoardShare(board)} className=" text-2xl w-8 h-8  bg-white text-black rounded-lg flex items-center justify-center">
              <CiShare2 />
            </button>
          )}
        </div>
      </div>
      <div className={`grid grid-cols-3 gap-12 bg-gray-50 border-gray-100 ml-4 ${isSidebarOpen ? "w-[100%]" : "w-[90%]"}`}>
        {boardDetails?.titles?.map((titleObj, index) => (
          <div key={titleObj.key} className="border rounded-lg border-gray-100 bg-white w-[100%] mx-auto transition-all duration-300 h-fit">
            <h6 className="p-2 text-base font-medium border-b border-gray-100 flex justify-between items-center">
              {titleObj.title}
              <div className="flex gap-2">
                <button className="w-5 h-5 shadow-2xl rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 border">
                  {messages[titleObj.key]?.length > 0 && (
                    <span className="absolute text-xs rounded-full ">
                      {messages[titleObj.key].length}
                    </span>
                  )}
                </button>
                <button
                  className="w-5 h-5 shadow-2xl rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 border"
                  onClick={() => handleSortMessages(titleObj.key)}
                >
                  <BiSortAlt2 className="text-black" />
                </button>
              </div>
            </h6>

            <div className="mt-6 mb-4 flex ml-2 space-x-2">
              <button
                className={`w-8 h-8 rounded-md border flex items-center justify-center ${activeButton[titleObj.key] === "emoji" ? "bg-blue-100 border-blue-400 text-blue-500" : "bg-white"
                  }`}
                onClick={() => handleClick(titleObj.key, "emoji")}
              >
                <LuMessageSquareMore size={20} />
              </button>
              <button
                className={`w-8 h-8 rounded-md border flex items-center justify-center ${activeButton[titleObj.key] === "celebration" ? "bg-blue-100 border-blue-400 text-blue-500" : "bg-white"
                  }`}
                onClick={() => handleClick(titleObj.key, "celebration")}
              >
                <MdOutlineCelebration size={20} />
              </button>
            </div>

            {inputVisibility[titleObj.key] && (
              <div className="max-w-sm min-w-[20px] ml-2 mr-2">
                {activeInputType[titleObj.key] === "emoji" ? (
                  <EmojiInputField
                    placeholder="Type something..."
                    onMessageSubmit={(message) => handleMessageSubmit(boardId, titleObj.key, message)}
                  />
                ) : (
                  <CelebrationInputField
                    placeholder="Press enter to add card (@ to tag)"
                    onMessageSubmit={(message) => handleMessageSubmit(boardId, titleObj.key, message)}
                    showDropdown={dropdownVisibility?.[titleObj.key]}
                    onFocus={() => handleInputFocus(titleObj.key)}
                    onBlur={() => handleInputBlur(titleObj.key)}
                  />
                )}
              </div>
            )}

            <hr className='mt-4' />

            {messages?.[titleObj.key]?.length > 0 && messages?.[titleObj.key]?.map((msg) => (
              <div key={msg._id} className="bg-white rounded-xl p-2 w-full border mt-2">
                <div className='border rounded-md border-gray-300'>
                  <div className=" text-base font-medium border-b bg-[#EBF6FF] w-full rounded-md flex justify-between items-center">
                    <span className="font-bold p-1.5">{msg.username}</span>
                    <button
                      onClick={() => setIsOpen(prev => ({ ...prev, [msg._id]: !prev[msg._id] }))}
                    >
                      <HiOutlineDotsVertical className="w-6 h-6 text-black hover:text-black" />
                    </button>
                    {isOpen?.[msg._id] && (
                      <div className="absolute ml-[190px] mt-6 w-24 bg-white">
                        <button
                          onClick={() => {
                            console.log("Delete button clicked with:", {
                              boardId,
                              titleKey: msg._id,
                              commentId: comments,
                            });

                            if (!boardId || !titleObj?.key || !msg?._id) {
                              console.error("Error: Missing parameters before calling handleDeleteComment:", {
                                boardId,
                                titleKey: titleObj?.key,
                                commentId: msg?._id,
                              });
                              return;
                            }

                            handleDeleteComment(boardId, titleObj.key, msg._id);
                            setIsOpen(prev => ({ ...prev, [msg._id]: false }));
                          }}
                          className="absolute w-full p-1 text-sm text-center text-black shadow-gray-200 shadow-[-6px_-6px_10px_rgba(0,0,0,0.2),6px_6px_10px_rgba(0,0,0,0.2)] rounded-md bg-white"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="break-words overflow-hidden p-2 rounded-md">
                    <p className="text-sm font-medium text-gray-800">{msg.message.split(" - ")[0]}</p>
                    {msg.message.includes(" - ") && (
                      <div
                        className="relative p-2 rounded-lg shadow-md text-center bg-cover bg-center"
                        style={{ backgroundImage: "url('celebrate BG.png')" }}
                      >
                        <div className="flex justify-center my-2">
                          <img
                            src="9572410 1 (1).png"
                            alt="Message Image"
                            className="w-24 h-24 rounded-lg"
                          />
                        </div>
                        <p className="text-xs font-semibold mt-1 text-center">
                          {msg.message.split(" - ")[1]}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="w-full pt-2  space-x-3 rounded-lg p-2">
                    <div className=''>
                      <div className="rounded-md  relative">
                        <div className={`flex justify-between`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveReactionIndex(activeReactionIndex === msg._id);
                          }}
                        >
                      
                           

                            <div>
                            <BsEmojiSmile />
                            </div>

                            <div className=" text-xs text-black underline">
                              {msg.replies.length} Others
                            </div>
                        </div>

                        {activeReactionIndex === msg._id && (
                          <div className="absolute bottom-full mb-1 left-0 flex gap-1 bg-white border rounded-xl p-2 shadow-lg z-20">
                            {['❤️', '👍', '👎', '👏', '💡', '😘'].map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => handleReplySubmit(
                                  boardId,
                                  titleObj.key,
                                  msg._id,
                                  emoji,
                                  setMessages,
                                  setReplyText,
                                  setReplyInputVisibility
                                )}
                                className="text-base hover:scale-110 transition-transform duration-100 "
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {
        showSharePopup && selectedBoard && (
          <BoardSharePopup
            board={selectedBoard}
            onClose={() => setShowSharePopup(false)}
            email={email}
            setEmail={setEmail}
          />
        )
      }
    </div >
  );
};

export default CustomZones;
