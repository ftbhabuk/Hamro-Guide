"use client"
import React, { useState, useEffect } from "react";
import { Sprout } from "lucide-react";
import { Button } from "./ui/button";
import { useGoogleLogin } from "@react-oauth/google";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      setIsLoggedIn(true);
      localStorage.setItem("google_token", tokenResponse.access_token); // Store
      // the token
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
    },
  });

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("google_token"); // Remove the token
    console.log("User signed out");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("google_token");
    if (storedToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <header className="w-full py-4 px-6 bg-white border-b">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        {/* Added justify-between to space out content */}
        <div className="flex items-center">
          <Sprout className="mr-2" />
          <h1 className="text-xl font-semibold text-gray-800">Hamro Guide</h1>
        </div>

        {/* Sign In/Sign Out Button */}
        {isLoggedIn ? (
          <Button
            className="bg-red-600 text-white hover:bg-red-700 border-black transition duration-300 ease-in-out rounded-md py-2 px-4"
            onClick={logout}
          >
            <p className="text-muted font-bold">Sign Out</p>
          </Button>
        ) : (
          <Button
            className="bg-red-600 text-white hover:bg-red-700 border-black transition duration-300 ease-in-out rounded-md py-2 px-4"
            onClick={() => login()} // Wrap login() in an arrow function
          >
            <p className="text-muted font-bold">Sign In</p>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
