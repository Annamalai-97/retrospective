import React, { useState } from 'react';
import { LuSendHorizontal } from "react-icons/lu";
import EmojiPicker from 'emoji-picker-react';

const EmojiInputField = ({ placeholder, onMessageSubmit }) => {
    const [showEmojis, setShowEmojis] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const handleEmojiClick = (emoji) => {
        setInputValue(inputValue + emoji);
        setShowEmojis(false);
    };

    const handleSend = () => {
        if (onMessageSubmit && typeof onMessageSubmit === "function") {
            onMessageSubmit(inputValue);
            setInputValue("");
        } else {
            console.error("onMessageSubmit is not a function");
        }
    };

    return (
        <div className="relative">
            <div className="flex items-center border border-blue-500 rounded-md px-2 py-2">
                <button
                    onClick={() => setShowEmojis(!showEmojis)}
                    className="text-lg text-black focus:outline-none border border-neutral-300 border-y-0 border-l-0 pr-2"
                >
                    😊
                </button>

                {showEmojis && (
                    <div className="absolute top-full left-0 mb-3 border border-t-1 rounded-lg shadow-md p-2 z-20 overflow-auto bg-white">
                        <EmojiPicker
                            onEmojiClick={(emojiData) => handleEmojiClick(emojiData.emoji)}
                            theme="light" 
                            emojiStyle="native"
                            searchDisabled={false} 
                            skinTonesDisabled={false} 
                            height={250} 
                            width={280}
                            lazyLoadEmojis={false}
                            previewConfig={{
                                defaultCaption: 'Pick your emoji!',
                                showPreview: false,
                            }}
                        />
                    </div>
                )}

                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full text-sm px-3 py-1.5 focus:outline-none"
                    placeholder={placeholder}
                />

                <button
                    onClick={handleSend}
                    className="text-lg text-blue-600 hover:text-blue-800"
                >
                    <LuSendHorizontal />
                </button>
            </div>
        </div>
    );
};

export default EmojiInputField;
