"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { BUDGET_OPTIONS, COMPANION_OPTIONS, ACTIVITIES } from "./constants";
import axios from "axios";
import Image from "next/image";

// Define types
interface Option {
  label: string;
  value: string;
}

interface BudgetOption {
  level: string;
  range: string;
}

interface CompanionOption {
  type: string;
  icon: React.FC;
  description: string;
}

// Helper Components
const BudgetSelection = ({
  budget,
  setBudget,
}: {
  budget: string;
  setBudget: (budget: string) => void;
}) => (
  <div className="space-y-4">
    <div className="space-y-1">
      <h2 className="text-lg font-medium text-gray-900">
        What is Your Budget?
      </h2>
      <p className="text-gray-600">
        The budget is exclusively allocated for activities and dining purposes.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {BUDGET_OPTIONS.map((option) => (
        <Card
          key={option.level}
          className={`p-4 cursor-pointer transition-colors ${
            budget === option.level ? "border-blue-500" : ""
          }`}
          onClick={() => setBudget(option.level)}
        >
          <div>
            <h3 className="font-semibold">{option.level}</h3>
            <p className="text-sm text-gray-500">{option.range}</p>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const CompanionSelection = ({
  travelCompanion,
  setTravelCompanion,
}: {
  travelCompanion: string;
  setTravelCompanion: (companion: string) => void;
}) => (
  <div className="space-y-4">
    <label className="text-lg font-medium text-gray-900">
      Who are you traveling with?
    </label>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COMPANION_OPTIONS.map((companion) => (
        <Card
          key={companion.type}
          className={`p-4 cursor-pointer transition-colors ${
            travelCompanion === companion.type ? "border-blue-500" : ""
          }`}
          onClick={() => setTravelCompanion(companion.type)}
        >
          <div className="flex items-center space-x-2">
            {React.createElement(companion.icon, {})}
            <div>
              <h3 className="font-semibold">{companion.type}</h3>
              <p className="text-sm text-gray-500">{companion.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const ActivitySelection = ({
  selectedActivities,
  toggleActivity,
}: {
  selectedActivities: string[];
  toggleActivity: (activity: string) => void;
}) => (
  <div className="space-y-2">
    <label className="text-base font-medium text-gray-900">
      Preferred Activities
    </label>
    <div className="flex flex-wrap gap-2">
      {ACTIVITIES.map((activity) => (
        <Button
          key={activity}
          variant="outline"
          className={`rounded-full ${
            selectedActivities.includes(activity)
              ? "bg-blue-100 border-blue-500"
              : ""
          }`}
          onClick={() => toggleActivity(activity)}
        >
          {activity}
        </Button>
      ))}
    </div>
  </div>
);

interface TripPlan {
  [key: string]: unknown;
}

const CreateTripPage = () => {
  const [destination, setDestination] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [travelCompanion, setTravelCompanion] = useState<string>("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [specialRequirements, setSpecialRequirements] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [jsonBinId, setJsonBinId] = useState<string | null>(null);

  const router = useRouter();
  const JSONBIN_URL = "https://api.jsonbin.io/v3/b";

  // **HARDCODED API KEY (FOR DEBUGGING ONLY)**
  const apiKey =
    "$2a$10$R6Pd/bZ7RzyKLchhTQkUPufqnPgK7tXiZOgmrbwAYDX3LapMWrnL2";

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google Login Success:", tokenResponse);
      setIsLoggedIn(true);

      try {
        const googleResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userInfo = googleResponse.data;
        console.log("User Info from Google:", userInfo);
        setUserData(userInfo);
        localStorage.setItem("user_data", JSON.stringify(userInfo));
      } catch (error) {
        console.error("Failed to fetch user info from Google:", error);
      }
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
    },
  });

  const logout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem("user_data");
    console.log("User signed out");
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("user_data");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      setIsLoggedIn(true);
    }
  }, []);

  const toggleActivity = useCallback((activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  }, []);

  const storeInJsonBin = async (data: unknown) => {
    try {
      console.log("Attempting to store data in JSONBin.io...", data);

      // Use the hardcoded API key
      console.log("API Key length:", apiKey.length);
      console.log("API key starts with:", apiKey.substring(0, 10));

      const response = await axios.post("https://api.jsonbin.io/v3/b", data, {
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": apiKey,
          "X-Bin-Name": `Trip Plan - ${data.formData.destination} - ${new Date().toISOString()}`,
        },
      });

      console.log("Successfully stored data in JSONBin.io:", response.data);
      setJsonBinId(response.data.metadata.id);

      // Add success message in UI
      if (response.data.metadata.id) {
        // Store the ID for later reference
        localStorage.setItem("lastTripPlanId", response.data.metadata.id);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("JSONBin.io Error Details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
      }
      console.error("Failed to store data in JSONBin.io:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      console.log("Redirecting to login...");
      login();
      return;
    }

    setIsLoading(true);

    const formData = {
      destination,
      duration,
      budget,
      travelCompanion,
      selectedActivities,
      specialRequirements,
      user: userData
        ? {
            name: userData.name,
            email: userData.email,
          }
        : null,
      timestamp: new Date().toISOString(),
    };

    console.log("Form data submitted:", formData);

    try {
      const response = await axios.post("/api/", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("API Response Data:", response.data);

      if (response.data.success) {
        const tripPlanData = response.data.data;
        console.log("Trip plan generated successfully:", tripPlanData);
        setTripPlan(tripPlanData);

        try {
          const jsonBinResponse = await storeInJsonBin({
            formData,
            tripPlan: tripPlanData,
          });
          const tripId = jsonBinResponse.metadata.id; // Get the ID
          console.log(
            "Trip plan stored in JSONBin.io with ID:",
            tripId
          );
          localStorage.setItem(
            "lastTripPlanBinId",
            tripId
          );

          // Redirect to the view trip page
          router.push(
            `/view-trip/${tripId}?userData=${encodeURIComponent(
              JSON.stringify(userData)
            )}`
          );
          
        } catch (jsonBinError) {
          console.error(
            "Failed to store trip plan in JSONBin.io:",
            jsonBinError
          );
        }

        setOpen(true);
      } else {
        console.error("Failed to generate trip plan:", response.data.error);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* {userData && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              Welcome, {userData.name}!
            </h2>
            <p>Email: {userData.email}</p>
            <img
              src={userData.picture}
              alt="Google Profile"
              className="rounded-full w-12 h-12"
            />
            <Button onClick={logout} className="ml-4">
              Logout
            </Button>
          </div>
        )} */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-gray-900">
              Tell us your travel preferences
            </h1>
            <p className="text-gray-600 text-lg">
              Just provide some basic information, and our trip planner will
              generate a customized itinerary based on your preferences.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-900">
              What is your destination of choice?
            </label>
            <Input
              type="text"
              className="w-full h-12"
              placeholder="Enter your destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-900">
              How many days are you planning your trip?
            </label>
            <Input
              type="number"
              className="w-full h-12"
              placeholder="Enter number of days"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <BudgetSelection budget={budget} setBudget={setBudget} />

          <CompanionSelection
            travelCompanion={travelCompanion}
            setTravelCompanion={setTravelCompanion}
          />

          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">
              Additional Preferences
            </h2>

            <ActivitySelection
              selectedActivities={selectedActivities}
              toggleActivity={toggleActivity}
            />

            <div className="space-y-2">
              <label className="text-base font-medium text-gray-900">
                Any special requirements or preferences?
              </label>
              <Textarea
                placeholder="E.g., accessibility needs, dietary restrictions, preferred transportation..."
                className="h-24"
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              className="w-full h-12 text-lg bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate My Trip"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateTripPage;
