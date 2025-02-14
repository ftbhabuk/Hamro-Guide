"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface TripPlan {
  [key: string]: any;
}

const ViewTripPage = () => {
  const { id } = useParams();
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTripPlan = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // **HARDCODED API KEY (FOR DEBUGGING ONLY)**
        const apiKey =
          "$2a$10$R6Pd/bZ7RzyKLchhTQkUPufqnPgK7tXiZOgmrbwAYDX3LapMWrnL2";
        const response = await axios.get(
          `https://api.jsonbin.io/v3/b/${id}`,
          {
            headers: {
              "X-Master-Key": apiKey,
            },
          }
        );

        if (response.data && response.data.record) {
          setTripPlan(response.data.record);
        } else {
          setError("Trip plan not found.");
        }
      } catch (e: any) {
        setError(e.message || "Failed to fetch trip plan.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTripPlan();
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading trip plan...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!tripPlan) {
    return <div>No trip plan found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6">
        <h1 className="text-2xl font-semibold mb-4">Trip Plan Details</h1>
        <pre className="overflow-auto p-4 bg-gray-50 rounded">
          {JSON.stringify(tripPlan, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ViewTripPage;
