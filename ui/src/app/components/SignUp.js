"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import TextField from "./TextField,";
import LoginButton from "./LoginButton";
import API from "../Auth_api";
import Cookies from "js-cookie";
import { handleGoogleSuccess } from "./googleAuthHandler";

const SignUp = ({ variant = "primary" }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("User");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await API.post("/signup", { name: username, email, password, role });

            if (response.data.token) {
                Cookies.set("token", response.data.token, { expires: 5 / 1440 });
                localStorage.setItem("token", response.data.token);
            }

            router.push("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Sign Up failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center w-full"
            style={{ backgroundImage: "url('/login1.png')" }}>
            <div className="bg-gray-200 p-8 rounded-3xl border max-w-sm w-full shadow-md">
                <div className="flex justify-center">
                    <img src="/LOGO1.png" className="h-16" alt="Logo" />
                </div>
                <h1 className="text-base text-center mt-6 mb-1">Sign up for an account</h1>
                <p className="text-center text-sm mb-4 text-gray-400">Enter your details</p>

                {error && <div className="text-red-500 text-center mb-3">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <TextField type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                        <TextField type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                        <TextField type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                        <TextField type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Select Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="Super Admin">Super Admin</option>
                                <option value="Admin">Admin</option>
                                <option value="Team Lead">Team Lead</option>
                                <option value="Team Member">Team Member</option>
                            </select>
                        </div>
                    </div>

                    <div className="pb-2 mt-5">
                        <LoginButton variant={variant} label={loading ? "Signing up..." : "Sign Up"} disabled={loading} />
                    </div>
                </form>

                <div className="text-center my-1 text-gray-500">OR</div>

                <GoogleLogin
                    ux_mode="popup"
                    redirect_uri="http://localhost:3000/signup"
                    onSuccess={(credentialResponse) => handleGoogleSuccess(credentialResponse, router, setError)}
                    onError={() => console.log("Google Sign-In Failed")}
                />
            </div>
        </div>
    );
};

export default SignUp;
