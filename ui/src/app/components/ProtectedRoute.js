"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem("token");  
    
    if (!token) {
      setErrorMessage("Unauthorized access! Please login again.");
     router.replace('/');
    } else {
     
      setIsAuthenticated(true);
    }
 
  }, [router]);


  if (errorMessage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {errorMessage}
        </div>
      </div>
    );
  }
  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
