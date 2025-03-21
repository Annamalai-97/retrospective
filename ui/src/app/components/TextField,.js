"use client"; 

import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const TextField = ({ label, type, value, onChange, placeholder, required }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className="relative">
            {label && <label className="block mb-2 text-sm text-gray-600">{label}</label>}
            <input
                type={type === "password" && !isPasswordVisible ? "password" : "text"}
                value={value}
                onChange={onChange}
                className="w-full p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={placeholder}
                required={required}
            />
            {type === "password" && ( 
                <div className="absolute right-3 bottom-2 text-gray-400 cursor-pointer" onClick={togglePasswordVisibility}>
                    {isPasswordVisible ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
                </div>
            )}
        </div>
    );
};

export default TextField;
