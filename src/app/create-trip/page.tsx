import React from 'react';
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Coins, Users, Heart,  } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const CreateTripPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white border-b">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-800">AI Travel Planner</h1>
        </div>
      </header>

      {/* Main Form */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Title and Description */}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-gray-900">
              Tell us your travel preferences
            </h1>
            <p className="text-gray-600 text-lg">
              Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
            </p>
          </div>

          {/* Destination Input */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-900">
              What is destination of choice?
            </label>
            <Input 
              type="text" 
              className="w-full h-12"
              placeholder="Enter your destination"
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
            />
          </div>

          {/* Budget Selection */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-gray-900">What is Your Budget?</h2>
              <p className="text-gray-600">The budget is exclusively allocated for activities and dining purposes.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { level: 'Low', range: '0 - 1000 USD' },
                { level: 'Medium', range: '1000 - 2500 USD' },
                { level: 'High', range: '2500+ USD' }
              ].map((budget) => (
                <Card 
                  key={budget.level}
                  className="p-4 cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <div className="space-y-2">
                    <Coins className="h-6 w-6 text-gray-600" />
                    <div>
                      <h3 className="font-medium">{budget.level}</h3>
                      <p className="text-sm text-gray-600">{budget.range}</p>
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
              {[
                { type: 'Solo', icon: Users, description: 'Traveling alone' },
                { type: 'Family', icon: Users, description: 'With family members' },
                { type: 'Friends', icon: Users, description: 'With a group of friends' },
                { type: 'Couple', icon: Heart, description: 'Romantic getaway' },
                { type: 'Business', icon: Users, description: 'Business trip' },
                { type: 'Group Tour', icon: Users, description: 'Organized tour group' }
              ].map((companion) => (
                <Card 
                  key={companion.type}
                  className="p-4 cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <div className="space-y-2">
                    <companion.icon className="h-6 w-6 text-gray-600" />
                    <div>
                      <h3 className="font-medium">{companion.type}</h3>
                      <p className="text-sm text-gray-600">{companion.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Preferences */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Additional Preferences</h2>
            
            {/* Travel Style */}
            <div className="space-y-2">
              <label className="text-base font-medium text-gray-900">
                Preferred Activities
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Cultural', 'Adventure', 'Relaxation', 'Shopping',
                  'Food & Dining', 'Nature', 'Historical', 'Nightlife'
                ].map((activity) => (
                  <Button
                    key={activity}
                    variant="outline"
                    className="rounded-full"
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
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-6">
            <Button className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white">
              Generate My Trip Itinerary
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateTripPage;