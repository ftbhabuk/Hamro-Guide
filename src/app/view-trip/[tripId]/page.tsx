"use client";
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from 'next/navigation'; // Use useSearchParams instead of router.query
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import TripDetailsViewer from "@/components/TripDetailsViewer"; // Make sure this is actually EnhancedTripViewer

const ViewTripPage = () => {
  const params = useParams();
  const searchParams = useSearchParams(); // Use this instead of router.query
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const tripId = params?.tripId;
  const userDataString = searchParams.get('userData'); // This is how you get query params in App Router

  useEffect(() => {
    // Try to get userData from searchParams first
    if (userDataString) {
      try {
        const parsedUserData = JSON.parse(decodeURIComponent(userDataString));
        setUserData(parsedUserData);
        console.log("Successfully parsed userData from URL:", parsedUserData);
      } catch (error) {
        console.error('Error parsing userData from URL:', error);
        setUserData(null);
      }
    } else {
      // Fallback: Try to get userData from localStorage if not in URL
      const storedUserData = localStorage.getItem("user_data");
      if (storedUserData) {
        try {
          setUserData(JSON.parse(storedUserData));
          console.log("Successfully loaded userData from localStorage");
        } catch (error) {
          console.error('Error parsing userData from localStorage:', error);
        }
      }
    }
  }, [userDataString]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiKey = "$2a$10$R6Pd/bZ7RzyKLchhTQkUPufqnPgK7tXiZOgmrbwAYDX3LapMWrnL2";
        const response = await axios.get(
          `https://api.jsonbin.io/v3/b/${tripId}`,
          {
            headers: {
              "X-Master-Key": apiKey,
            },
          }
        );
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchData();
    }
  }, [tripId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading trip data: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Only render TripDetailsViewer if we have data
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Trip Plan Details</h1>

      {data ? (
        <TripDetailsViewer data={data} userData={userData} />
      ) : (
        <Alert>
          <AlertDescription>No trip data found for ID: {tripId}</AlertDescription>
        </Alert>
      )}

      {/* Optional: Keep the raw JSON display for debugging */}
      {data && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Raw JSON Data (Debug View)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm whitespace-pre-wrap break-words">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ViewTripPage;