import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Hotel,
  MapPin,
  Calendar,
  DollarSign,
  Utensils,
  AlertCircle,
  Clock,
  Sun,
} from 'lucide-react';

const TripDetailsViewer = ({ data }) => {
  // Extract the actual trip data from the JSONBin structure
  const tripData = data?.record?.tripPlan;
  
  if (!tripData) {
    return (
      <Alert>
        <AlertDescription>
          No trip data available. The data structure might be incorrect.
        </AlertDescription>
      </Alert>
    );
  }

  const TripOverview = () => (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Destination</p>
              <p className="font-medium">{tripData.tripOverview?.destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">{tripData.tripOverview?.duration} days</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Best Time to Visit</p>
              <p className="font-medium">{tripData.tripOverview?.bestTimeToVisit}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const HotelSection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tripData.hotels?.map((hotel, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="w-5 h-5 text-blue-500" />
              {hotel.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{hotel.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  ${hotel.pricePerNight}/night
                </span>
                <span className="text-sm text-gray-600">
                  Rating: {hotel.rating}/5
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ItinerarySection = () => (
    <div className="space-y-4">
      {tripData.dailyItinerary?.map((day, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-lg">
              Day {day.day} - {day.date}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {day.activities?.map((activity, i) => (
                <div key={i} className="flex gap-4 p-2 hover:bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-500 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium">
                      {activity.time} - {activity.activity}
                    </p>
                    <p className="text-sm text-gray-600">{activity.location}</p>
                    <div className="flex justify-between mt-1 text-sm text-gray-500">
                      <span>Duration: {activity.duration}</span>
                      <span>Cost: ${activity.cost}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Your Trip to {tripData.tripOverview?.destination}
      </h1>

      <TripOverview />

      <Tabs defaultValue="itinerary" className="mb-6">
        <TabsList>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
        </TabsList>

        <TabsContent value="itinerary">
          <ItinerarySection />
        </TabsContent>

        <TabsContent value="hotels">
          <HotelSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TripDetailsViewer;