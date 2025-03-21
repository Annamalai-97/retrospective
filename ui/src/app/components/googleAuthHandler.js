import { jwtDecode } from "jwt-decode";
import API from "../Auth_api";
import Cookies from "js-cookie";

export const handleGoogleSuccess = async (credentialResponse, router, setError) => {
    try {
        if (!credentialResponse || !credentialResponse.credential) {
            console.error("❌ No credential received from Google.");
            setError && setError("Google sign-in failed. Please try again.");
            return;
        }

        const decoded = jwtDecode(credentialResponse.credential);
        localStorage.setItem("user", JSON.stringify({
            name: decoded.name,
            email: decoded.email,
            sub: decoded.sub
        }));

        const response = await API.post("/google-signup", { token: credentialResponse.credential });

        if (response.data && response.data.token) {
            Cookies.set("token", response.data.token, { expires: 5 / 1440 });
            localStorage.setItem("token", response.data.token);

            const decodedToken = jwtDecode(response.data.token);
            localStorage.setItem("user", JSON.stringify({
                name: decodedToken.name,
                email: decodedToken.email,
                sub: decodedToken.sub
            }));

            router.push("/reflect");
        } else {
            console.error("❌ No token received from API.");
        }
    } catch (err) {
        console.error("❌ Google Sign-Up Error:", err.response ? err.response.data : err);
        setError && setError("Google sign-up failed. Try again.");
    }
};
