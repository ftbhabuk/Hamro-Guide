import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ExploreMore - Your Travel Guide",
  description:
    "Discover top destinations, hidden gems, and travel tips to make your journey unforgettable.",
};

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <Navbar /> {/* Render the Navbar component */}
            <Toaster position="top-right" />
            {children}
          </GoogleOAuthProvider>
        ) : (
          <>
            <Navbar /> {/* Render the Navbar component */}
            <Toaster position="top-right" />
            {children}
          </>
        )}
      </body>
    </html>
  );
}
