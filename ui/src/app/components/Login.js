"use client";

import React, { useState } from "react";
import TextField from "./TextField,";
import LoginButton from "./LoginButton";
import { useRouter } from "next/navigation";
import API from "../Auth_api";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { handleGoogleSuccess } from "./googleAuthHandler";
import { GoogleLogin } from "@react-oauth/google";

const Login = ({ variant = "primary" }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setLocalError("Both email and password are required.");
            return;
        }
        setLocalError("");

        try {
            const response = await API.post("/login", { email, password });
            const token = response.data.token;
            Cookies.set("token", token, { expires: "1d" });
            localStorage.setItem("token", token);
            const decodedToken = jwtDecode(token);
            const userName = decodedToken.name;
            localStorage.setItem("username", decodedToken.name);
            router.push("/reflect");
        } catch (err) {
            console.error("Login error:", err);
            setLocalError("Login failed. Please check your credentials.");
        } finally {

        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center w-full"
            style={{
                backgroundImage: "url('/login1.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="bg-gray-200 p-8 rounded-3xl border max-w-sm w-full shadow-md">
                <div className="flex justify-center items-center mt-10">
                    <img src="/LOGO1.png" className="h-16" alt="Logo" />
                </div>
                <h1 className="text-base text-center mt-6 mb-1">Login to your account</h1>
                <div className="text-center text-sm mb-4 text-gray-400">Enter your email and password</div>
                {localError && <div className="text-red-500 text-center">{localError}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <TextField
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />
                        <TextField
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>
                    <div className="text-right pb-4">
                        <a href="#" className="text-sm text-gray-400 hover:underline">
                            Forgot Password?
                        </a>
                    </div>
                    <div className="pb-4">
                        <LoginButton label={"log in"} variant={variant} />
                    </div>
                </form>
                
                <div className="pb-2 mt-5">
                    Don't have an account? <a href="/signup" className="text-primary hover:underline">Sign up here</a>
                </div>
                
                <div className="text-center my-1 text-gray-500">OR</div>

                <GoogleLogin
                    ux_mode="popup"
                    redirect_uri="http://localhost:3000/login"
                    onSuccess={(credentialResponse) => handleGoogleSuccess(credentialResponse, router, setError)}
                    onError={() => console.log("Google Sign-In Failed")}
                />
            </div>
        </div>
    );
};

export default Login;
