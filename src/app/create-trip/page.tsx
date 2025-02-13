"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation"; // Import useRouter

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

// Configuration Constants
const BUDGET_OPTIONS: BudgetOption[] = [
  { level: "Low", range: "0 - 1000 NRP" },
  { level: "Medium", range: "1000 - 2500 NRP" },
  { level: "High", range: "2500+ NRP" },
];

const COMPANION_OPTIONS: CompanionOption[] = [
  { type: "Solo", icon: Users, description: "Traveling alone" },
  { type: "Family", icon: Users, description: "With family members" },
  { type: "Friends", icon: Users, description: "With a group of friends" },
  { type: "Couple", icon: Heart, description: "Romantic getaway" },
  { type: "Business", icon: Users, description: "Business trip" },
  { type: "Group Tour", icon: Users, description: "Organized tour group" },
];

const ACTIVITIES = [
  "Cultural",
  "Adventure",
  "Relaxation",
  "Shopping",
  "Food & Dining",
  "Nature",
  "Historical",
  "Nightlife",
];

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
            {React.createElement(companion.icon, {
              // className: "h-5 w-5",
            })}
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
  // State management
  const [destination, setDestination] = useState<string>(""); // Changed to
  // string
  const [duration, setDuration] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [travelCompanion, setTravelCompanion] = useState<string>("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [specialRequirements, setSpecialRequirements] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null); // State to
  // store the trip plan
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter(); // Initialize useRouter

  // Google Auth
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
      setIsLoggedIn(true);
      // After successful login, you might want to redirect back to the
      // current page or a different page
      // router.push('/create-trip'); // Example: Redirect back to the
      // create-trip page
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
    },
  });

  const logout = () => {
    // In a real application, you would also revoke the token from Google.
    setIsLoggedIn(false);
    console.log("User signed out");
  };

  useEffect(() => {
    // Check if the user is already logged in (e.g., by checking for a token in
    // local storage)
    // For simplicity, we'll just set isLoggedIn to false initially.
    // Implement your own logic here.
    const storedToken = localStorage.getItem("google_token"); // Example:
    // Check for token in local storage
    if (storedToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Handlers
  const toggleActivity = useCallback((activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      // Redirect to login if not logged in
      console.log("Redirecting to login...");
      login(); // Trigger the Google login flow
      return; // Stop the form submission
    }

    setIsLoading(true);

    const formData = {
      destination: destination, // Use the string value directly
      duration,
      budget,
      travelCompanion,
      selectedActivities,
      specialRequirements,
    };

    console.log("Form data submitted:", formData);

    try {
      const response = await fetch("/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("API Response Status:", response.status);

      if (!response.ok) {
        // Log the error response body
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${
            errorData?.error || "Unknown error"
          }`
        );
      }

      const data = await response.json();

      console.log("API Response Data:", data);

      if (data.success) {
        console.log("Trip plan generated successfully:", data.data);
        setTripPlan(data.data); // Store the trip plan in state
      } else {
        console.error("Failed to generate trip plan:", data.error);
        // Handle the error (e.g., display an error message)
      }
    } catch (error: unknown) {
      console.error("Error during API call:", error);
      // Handle network errors or exceptions
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      <main className="max-w-3xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title and Description */}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-gray-900">
              Tell us your travel preferences
            </h1>
            <p className="text-gray-600 text-lg">
              Just provide some basic information, and our trip planner will
              generate a customized itinerary based on your preferences.
            </p>
          </div>

          {/* Destination Input */}
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

          {/* Duration Input */}
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

          {/* Budget Selection */}
          <BudgetSelection budget={budget} setBudget={setBudget} />

          {/* Travel Companions */}
          <CompanionSelection
            travelCompanion={travelCompanion}
            setTravelCompanion={setTravelCompanion}
          />

          {/* Additional Preferences */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">
              Additional Preferences
            </h2>

            {/* Travel Style */}
            <ActivitySelection
              selectedActivities={selectedActivities}
              toggleActivity={toggleActivity}
            />

            {/* Special Requirements */}
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

          {/* Generate Button */}
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
        {/* Display Trip Plan */}
        {tripPlan && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Generated Trip Plan:
            </h2>
            <pre>{JSON.stringify(tripPlan, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateTripPage;
