"use client";
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Coins, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import dynamic from 'next/dynamic';
import type {  SingleValue } from 'react-select';
import {toast } from "sonner";


// Define types for Google Places Autocomplete
interface Option {
  label: string;
  value: string;
}

// Dynamically import Google Places Autocomplete with SSR disabled
const GooglePlacesAutocomplete = dynamic(
  () => import('react-google-places-autocomplete'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full p-3 border rounded-md bg-gray-50">
        Loading places autocomplete...
      </div>
    )
  }
);

const CreateTripPage = () => {
  // State management with proper typing
  const [destination, setDestination] = useState<Option | null>(null);
  const [duration, setDuration] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [travelCompanion, setTravelCompanion] = useState<string>('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [specialRequirements, setSpecialRequirements] = useState<string>('');

  // For development without API key
  const googlePlacesApiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || 'dummy-key';

  // Handler for activities selection
  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !duration || !budget || !travelCompanion) {
      toast.error("Please fill in all required fields.");
      return;
    }
    toast.success("Trip details submitted successfully!");
    console.log("Form submitted:", { destination, duration, budget, travelCompanion, selectedActivities, specialRequirements });
  };

  // Custom handler for Google Places Autocomplete
  const handlePlaceSelect = (
    newValue: SingleValue<Option>,
    // actionMeta: ActionMeta<Option>
  ) => {
    setDestination(newValue);
  };

  const budgetOptions = [
    { level: 'Low', range: '0 - 1000 NRP' },
    { level: 'Medium', range: '1000 - 2500 NRP' },
    { level: 'High', range: '2500+ NRP' },
  ];

  const companionOptions = [
    { type: 'Solo', icon: Users, description: 'Traveling alone' },
    { type: 'Family', icon: Users, description: 'With family members' },
    { type: 'Friends', icon: Users, description: 'With a group of friends' },
    { type: 'Couple', icon: Heart, description: 'Romantic getaway' },
    { type: 'Business', icon: Users, description: 'Business trip' },
    { type: 'Group Tour', icon: Users, description: 'Organized tour group' },
  ];

  const activities = [
    'Cultural', 'Adventure', 'Relaxation', 'Shopping',
    'Food & Dining', 'Nature', 'Historical', 'Nightlife',
  ];

  // Temporary destination input for development without API
  const DevDestinationInput = () => (
    <Input
      type="text"
      className="w-full h-12"
      placeholder="Enter destination (Development mode)"
      onChange={(e) => setDestination({ label: e.target.value, value: e.target.value })}
    />
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="w-full py-4 px-6 bg-white border-b">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-800">
            AI Travel Planner
          </h1>
        </div>
      </header>

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
            {process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ? (
              <GooglePlacesAutocomplete
                apiKey={googlePlacesApiKey}
                selectProps={{
                  value: destination,
                  onChange: handlePlaceSelect,
                  placeholder: "Enter your destination",
                  className: "w-full"
                }}
              />
            ) : (
              <DevDestinationInput />
            )}
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
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-gray-900">
                What is Your Budget?
              </h2>
              <p className="text-gray-600">
                The budget is exclusively allocated for activities and dining
                purposes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {budgetOptions.map((option) => (
                <Card
                  key={option.level}
                  className={`p-4 cursor-pointer transition-colors ${
                    budget === option.level ? 'border-blue-500' : ''
                  }`}
                  onClick={() => setBudget(option.level)}
                >
                  <div className="space-y-2">
                    <Coins className="h-6 w-6 text-gray-600" />
                    <div>
                      <h3 className="font-medium">{option.level}</h3>
                      <p className="text-sm text-gray-600">{option.range}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Travel Companions */}
          <div className="space-y-4">
            <label className="text-lg font-medium text-gray-900">
              Who are you traveling with?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {companionOptions.map((companion) => (
                <Card
                  key={companion.type}
                  className={`p-4 cursor-pointer transition-colors ${
                    travelCompanion === companion.type ? 'border-blue-500' : ''
                  }`}
                  onClick={() => setTravelCompanion(companion.type)}
                >
                  <div className="space-y-2">
                    <companion.icon className="h-6 w-6 text-gray-600" />
                    <div>
                      <h3 className="font-medium">{companion.type}</h3>
                      <p className="text-sm text-gray-600">
                        {companion.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Preferences */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">
              Additional Preferences
            </h2>

            {/* Travel Style */}
            <div className="space-y-2">
              <label className="text-base font-medium text-gray-900">
                Preferred Activities
              </label>
              <div className="flex flex-wrap gap-2">
                {activities.map((activity) => (
                  <Button
                    key={activity}
                    variant="outline"
                    className={`rounded-full ${
                      selectedActivities.includes(activity)
                        ? 'bg-blue-100 border-blue-500'
                        : ''
                    }`}
                    onClick={() => toggleActivity(activity)}
                    type="button"
                  >
                    {activity}
                  </Button>
                ))}
              </div>
            </div>

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
            >
              Generate My Trip 
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateTripPage;