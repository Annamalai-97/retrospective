"use client";

import { usePathname } from "next/navigation";
import { Livvic } from "next/font/google";
import "./globals.css";
import store from "./redux/store";
import { Provider } from "react-redux";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google"; 

const livvic = Livvic({
  variable: "--font-livvic",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedSidebarState = localStorage.getItem("isSidebarOpen") === "true";
    setIsSidebarOpen(storedSidebarState);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("isSidebarOpen", newState);
      return newState;
    });
  };

  return (
    <html lang="en">
      <body className={`${livvic.variable} antialiased`}>
        <Provider store={store}>
          <GoogleOAuthProvider clientId="1087048113622-kjg82rrdf4664vhts8l0mksns1ncege6.apps.googleusercontent.com"> 
            {pathname !== "/" && pathname !== "/signup" ? (
              <div className="flex flex-col h-screen">
                <Header toggleSidebar={toggleSidebar} />
                <div className="flex flex-1">
                  <div
                    className={`fixed left-0 top-14 h-[calc(100%-3.5rem)] bg-white border-r shadow-md  ${
                      isSidebarOpen ? "w-64" : "w-16"
                    }`}
                  >
                    <Sidebar
                      isSidebarOpen={isSidebarOpen}
                      toggleSidebar={toggleSidebar}
                    />
                  </div>
                  <div
                    className={`flex-1 bg-gray-50 h-full ${
                      isSidebarOpen ? "pl-64" : "pl-16"
                    }`}
                  >
                    {children}
                  </div>
                </div>
              </div>
            ) : (
              <div>{children}</div>
            )}
          </GoogleOAuthProvider>
        </Provider>
      </body>
    </html>
  );
}
