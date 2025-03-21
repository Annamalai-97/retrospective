import React from "react";

const LoginButton = ({ label, loading, variant }) => {
    const buttonStyles = {
        primary: 'bg-blue-500 hover:bg-blue-700',
        secondary: 'bg-green-500 hover:bg-green-700',
    };

    return (
        <button
            type="submit"
            className={`w-full p-2 rounded-md text-white ${loading ? 'bg-gray-400' : buttonStyles[variant]}`}
            disabled={loading}
        >
            {loading ? "Logging in..." : label}
        </button>
    );
};

export default LoginButton;
