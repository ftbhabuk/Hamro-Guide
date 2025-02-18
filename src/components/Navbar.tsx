"use client";
import React from "react";
import { Sprout } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react"; // Import from next-auth/react

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession(); // Use useSession

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <header className="w-full py-4 px-6 bg-white border-b sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div
          className="flex items-center cursor-pointer"
          onClick={handleLogoClick}
        >
          <Sprout className="mr-2" />
          <h1 className="text-xl font-semibold text-gray-800">
            Hamro Guide
          </h1>
        </div>

        {/* Sign In/Sign Out Button */}
        {session?.user ? ( // Check if user exists in session
          <Button
            className="bg-red-600 text-white hover:bg-red-700 border-black transition duration-300 ease-in-out rounded-md py-2 px-4"
            onClick={() => signOut()} // Use signOut from next-auth/react
          >
            <p className="text-muted font-bold">Sign Out</p>
          </Button>
        ) : (
          <Button
            className="bg-red-600 text-white hover:bg-red-700 border-black transition duration-300 ease-in-out rounded-md py-2 px-4"
            onClick={() => signIn("google")} // Use signIn from next-auth/react
          >
            <p className="text-muted font-bold">Sign In</p>
          </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
