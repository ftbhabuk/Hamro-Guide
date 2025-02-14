import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Hotel,
  MapPin,
  Calendar,
  DollarSign,
  Utensils,
  BadgeInfo,
  Clock,
  Sun,
  Plane,
  Bus,
  ShieldAlert,
  Luggage,
} from 'lucide-react';

const EnhancedTripViewer = ({ data }) => {
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
      <CardHeader>
        <CardTitle>Trip Overview</CardTitle>
        <CardDescription>Essential details about your journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Destination</p>
              <p className="font-medium">{tripData.tripOverview.destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">{tripData.tripOverview.duration} days</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Best Time to Visit</p>
              <p className="font-medium">{tripData.tripOverview.bestTimeToVisit}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Budget Category</p>
              <p className="font-medium">{tripData.tripOverview.budgetCategory}</p>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <BadgeInfo className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Weather Info</p>
                <p className="font-medium">{tripData.tripOverview.weatherInfo}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CostBreakdown = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
        <CardDescription>Estimated expenses for your trip</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(tripData.costBreakdown).map(([category, cost]) => (
            <div key={category} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 capitalize">{category}</p>
              <p className="text-lg font-semibold">${cost}</p>
            </div>
          ))}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">Total Estimated Cost</p>
            <p className="text-lg font-semibold">
              ${tripData.tripOverview.totalEstimatedCost}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TransportationSection = () => (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5" />
            Airport Transfer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tripData.transportation.fromAirport.options.map((option, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{option}</span>
                <span className="font-medium">
                  ${tripData.transportation.fromAirport.estimatedCosts[index]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bus className="w-5 h-5" />
            Local Transport
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tripData.transportation.localTransport.options.map((option, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{option}</span>
                <span className="font-medium">
                  ${tripData.transportation.localTransport.estimatedCosts[index]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const EssentialInfoSection = () => (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(tripData.essentialInfo.emergencyContacts).map(([
              service,
              contact,
            ]) => (
              <div key={service} className="flex justify-between">
                <span className="capitalize">{service}:</span>
                <span className="font-medium">{contact}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Luggage className="w-5 h-5" />
            Packing List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1">
            {tripData.essentialInfo.packingList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  const HotelsTabContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tripData.hotels.map((hotel, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="w-5 h-5 text-blue-500" />
              {hotel.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                {/* Google Maps Link */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${hotel.name} ${hotel.location}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {hotel.location}
                </a>
              </div>
              <div className="flex justify-between">
                <span>${hotel.pricePerNight}/night</span>
                <span>Rating: {hotel.rating}/5</span>
              </div>
              <div>
                <p className="font-medium mb-2">Amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map((amenity, i) => (
                    <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
              {hotel.notes && <p className="text-sm text-gray-600">{hotel.notes}</p>}

              {/* Check Availability Button with Google Maps Link Format */}
              <Button
                variant='outline'
                className='font-semibold shadow-md opacity-90 on-hover:opacity-100'
                onClick={() => {
                  const availabilityQuery = `availability for ${hotel.name} in ${hotel.location}`;
                  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    availabilityQuery
                  )}`;
                  window.open(googleMapsUrl, '_blank');
                }}
              >
                Check Availability
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const RestaurantsTabContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tripData.restaurants.map((restaurant, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-blue-500" />
              {restaurant.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                {/* Google Maps Link */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${restaurant.name} ${restaurant.location}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {restaurant.location}
                </a>
              </div>
              <div className="flex justify-between">
                <span>{restaurant.cuisine}</span>
                <span>{restaurant.priceRange}</span>
              </div>
              <div>
                <p className="font-medium mb-2">Must Try Dishes:</p>
                <div className="flex flex-wrap gap-2">
                  {restaurant.mustTryDishes.map((dish, i) => (
                    <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {dish}
                    </span>
                  ))}
                </div>
              </div>

              {/* Check Availability Button with Google Maps Link Format */}
              <Button
                variant="outline"
                 className='font-semibold shadow-md opacity-90 on-hover:opacity-100'
                onClick={() => {
                  const availabilityQuery = `availability for ${restaurant.name} in ${restaurant.location}`;
                  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    availabilityQuery
                  )}`;
                  window.open(googleMapsUrl, '_blank');
                }}
              >
                Check Availability
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Your Trip to {tripData.tripOverview.destination}
      </h1>

      <TripOverview />
      <CostBreakdown />

      <Tabs defaultValue="itinerary" className="mb-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          <TabsTrigger value="transport">Transportation</TabsTrigger>
          <TabsTrigger value="essentials">Essential Info</TabsTrigger>
        </TabsList>

        <TabsContent value="itinerary">
          <div className="space-y-4">
            {tripData.dailyItinerary.map((day) => (
              <Card key={day.day}>
                <CardHeader>
                  <CardTitle>
                    Day {day.day} - {day.date}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {day.activities.map((activity, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">{activity.time}</p>
                            <span className="text-sm text-gray-500">
                              {activity.duration}
                            </span>
                          </div>
                          <p className="font-medium">{activity.activity}</p>
                          <p className="text-sm text-gray-600">{activity.location}</p>
                          <div className="mt-2 text-sm">
                            <span className="text-gray-500">Cost: ${activity.cost}</span>
                            {activity.notes && (
                              <p className="mt-1 text-gray-600">{activity.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hotels">
          <HotelsTabContent />
        </TabsContent>

        <TabsContent value="restaurants">
          <RestaurantsTabContent />
        </TabsContent>

        <TabsContent value="transport">
          <TransportationSection />
        </TabsContent>

        <TabsContent value="essentials">
          <div className="space-y-6">
            <EssentialInfoSection />
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Local Customs</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {tripData.essentialInfo.localCustoms.map((custom, index) => (
                        <li key={index}>{custom}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Safety Tips</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {tripData.essentialInfo.safetyTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Visa Requirements</h3>
                  <p>{tripData.essentialInfo.visaRequirements}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedTripViewer;
