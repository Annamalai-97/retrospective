import React, { useState } from "react";
import { LuSendHorizontal } from "react-icons/lu";

const CelebrationInputField = ({ placeholder, onMessageSubmit, onFocus, onBlur }) => {
    const [inputValue, setInputValue] = useState("");
    const [selectedSuggestion, setSelectedSuggestion] = useState("");
    const suggestions = ["Great team performer", "Congrats! You’re Amazing!", "Valued asset. Much appreciated!", "Shining positivity. Thanks, Teammate!", "Impressive work! Creative solutions!"];

    const handleSend = () => {
        if (onMessageSubmit && typeof onMessageSubmit === "function") {
            const combinedMessage = [inputValue, selectedSuggestion]
                .filter(Boolean)
                .join(" - ");

            if (combinedMessage) {
                onMessageSubmit(combinedMessage);
            }
        }
        setInputValue("");
        setSelectedSuggestion("");
    };

    const handleSelectChange = (e) => {
        setSelectedSuggestion(e.target.value);
    };

    return (
        <div className="relative w-full">
            <div className="flex flex-col border rounded-lg px-2 py-1.5 shadow-sm border-gray-300 focus-within:border-blue-500 mb-2">
                <div className="flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={placeholder}
                        className="w-full text-sm px-3 mt-1 pb-1 mb-2 focus:outline-none"
                    />
                </div>
                <div className="flex items-center">
                    <button className="w-8 h-8 border border-dashed rounded-full text-gray-500">
                        <img
                            src="Group 1000004845.png"
                            alt="Celebration"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </button>
                    <select
                        value={selectedSuggestion}
                        onChange={handleSelectChange}
                        className="w-[70%] justify-end ml-4 border rounded-lg px-3 py-1.5 focus:outline-none"
                    >
                        <option value="" disabled hidden>
                            -- Select an Option --
                        </option>
                        {suggestions.map((suggestion, index) => (
                            <option key={`${suggestion}-${index}`} value={suggestion}>
                                {suggestion}
                            </option>
                        ))}
                    </select>

                    <button onClick={handleSend} className="text-lg ml-4 text-gray-500 hover:text-gray-700">
                        <LuSendHorizontal />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CelebrationInputField;
