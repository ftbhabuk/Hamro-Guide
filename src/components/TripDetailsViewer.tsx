import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
  Info,
  Camera,
  List,
  Star,
} from "lucide-react";

interface TripDetailViewerProps {
  data: any; // Consider defining a stricter type based on your API response
}

const TripDetailViewer: React.FC<TripDetailViewerProps> = ({ data }) => {
  const tripData = data?.record?.tripPlan;
  const formData = data?.record?.formData;
  const userData = formData?.user;

  if (!tripData) {
    return (
      <Alert>
        <AlertDescription>
          No trip data available. The data structure might be incorrect.
        </AlertDescription>
      </Alert>
    );
  }

  const firstName = userData?.name?.split(" ")[0] || "Traveler";

  const createGoogleMapsUrl = (query: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const TripOverview = () => (
    <Card className="mb-6 overflow-hidden border-none shadow-md">
      <div className="relative h-48 w-full">
        <img
          src="/pokhara.jpg" // Replace with dynamic image if available
          alt={tripData.tripOverview.destination}
          className="object-cover h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h2 className="text-2xl font-bold">{tripData.tripOverview.destination}</h2>
            <p className="text-sm opacity-80">{tripData.tripOverview.weatherInfo}</p>
          </div>
        </div>
      </div>
      <CardContent className="pt-6 bg-white rounded-b-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-sm text-gray-500">Destination</p>
              <p className="font-medium">{tripData.tripOverview.destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">{tripData.tripOverview.duration} days</p>
            </div>
          </div>
          {formData.startDate && formData.endDate && (
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="text-sm text-gray-500">Dates</p>
                <p className="font-medium">
                  {new Date(formData.startDate).toLocaleDateString()} -{" "}
                  {new Date(formData.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Sun className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-sm text-gray-500">Best Time to Visit</p>
              <p className="font-medium">{tripData.tripOverview.bestTimeToVisit}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-sm text-gray-500">Budget Category</p>
              <p className="font-medium">{tripData.tripOverview.budgetCategory}</p>
            </div>
          </div>
          {tripData.tripOverview.nearbyLandmark && (
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="text-sm text-gray-500">Nearby Landmark</p>
                <p className="font-medium">{tripData.tripOverview.nearbyLandmark}</p>
              </div>
            </div>
          )}
        </div>

        {/* Additional Sections for Things to Do and Travel Tips */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {tripData.tripOverview.thingsToDo && tripData.tripOverview.thingsToDo.length > 0 && (
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-1 text-indigo-700">
                <List className="w-5 h-5" /> Things to Do
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {tripData.tripOverview.thingsToDo.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {tripData.tripOverview.travelTips && tripData.tripOverview.travelTips.length > 0 && (
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-1 text-indigo-700">
                <Star className="w-5 h-5" /> Travel Tips
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {tripData.tripOverview.travelTips.map((tip: string, index: number) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const CostBreakdown = () => (
    <Card className="mb-6 border-none shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
          <CardDescription className="text-indigo-100">
            Estimated expenses for your trip
          </CardDescription>
        </CardHeader>
      </div>
      <CardContent className="pt-6 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(tripData.costBreakdown).map(([category, cost]) => (
            <div
              key={category}
              className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow"
            >
              <p className="text-sm text-gray-500 capitalize">{category}</p>
              <p className="text-lg font-semibold">${cost}</p>
            </div>
          ))}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-indigo-700">Total Estimated Cost</p>
            <p className="text-lg font-semibold">
              ${tripData.tripOverview.totalEstimatedCost}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TransportationSection = () => (
    <div className="space-y-6">
      <Card className="border-none shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5" />
              Airport Transfer
            </CardTitle>
          </CardHeader>
        </div>
        <CardContent className="pt-6 bg-white">
          <div className="grid md:grid-cols-2 gap-4">
            {tripData.transportation.fromAirport.options.map((option, index) => (
              <a
                key={index}
                href={createGoogleMapsUrl(
                  `${option} ${tripData.tripOverview.destination} airport transfer`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="border rounded-lg overflow-hidden transition-shadow hover:shadow-md">
                  <div className="relative h-40 w-full bg-gray-200">
                    <img
                      src={index % 2 === 0 ? "/transport-taxi.jpg" : "/transport-bus.jpg"}
                      alt={option}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-indigo-600 group-hover:text-indigo-700">
                      {option}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">Estimated cost</span>
                      <span className="font-semibold">
                        ${tripData.transportation.fromAirport.estimatedCosts[index]}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="w-5 h-5" />
              Local Transport
            </CardTitle>
          </CardHeader>
        </div>
        <CardContent className="pt-6 bg-white">
          <div className="grid md:grid-cols-2 gap-4">
            {tripData.transportation.localTransport.options.map((option, index) => (
              <a
                key={index}
                href={createGoogleMapsUrl(`${option} ${tripData.tripOverview.destination}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="border rounded-lg overflow-hidden transition-shadow hover:shadow-md">
                  <div className="relative h-40 w-full bg-gray-200">
                    <img
                      src={index % 2 === 0 ? "/transport-local1.jpg" : "/transport-local2.jpg"}
                      alt={option}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-indigo-600 group-hover:text-indigo-700">
                      {option}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">Estimated cost</span>
                      <span className="font-semibold">
                        ${tripData.transportation.localTransport.estimatedCosts[index]}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const EssentialInfoSection = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-none shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
          </div>
          <CardContent className="pt-4 bg-white">
            <div className="space-y-2">
              {Object.entries(tripData.essentialInfo.emergencyContacts).map(
                ([service, contact]) => (
                  <div
                    key={service}
                    className="flex justify-between py-2 border-b last:border-0"
                  >
                    <span className="capitalize">{service}:</span>
                    <span className="font-medium">{contact}</span>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Luggage className="w-5 h-5" />
                Packing List
              </CardTitle>
            </CardHeader>
          </div>
          <CardContent className="pt-4 bg-white">
            <ul className="list-disc list-inside space-y-1">
              {tripData.essentialInfo.packingList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <div className="relative h-48 w-full">
          <img
            src="/local-customs.jpg"
            alt="Local Customs"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 flex items-end">
            <CardHeader className="text-white z-10">
              <CardTitle>Local Customs & Safety</CardTitle>
            </CardHeader>
          </div>
        </div>
        <CardContent className="pt-6 bg-white">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-1 text-indigo-700">
                <Info className="w-4 h-4" /> Local Customs
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {tripData.essentialInfo.localCustoms.map((custom, index) => (
                  <li key={index}>{custom}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-1 text-indigo-700">
                <ShieldAlert className="w-4 h-4" /> Safety Tips
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {tripData.essentialInfo.safetyTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-medium mb-2 flex items-center gap-1 text-indigo-700">
              <BadgeInfo className="w-4 h-4" /> Visa Requirements
            </h3>
            <p>{tripData.essentialInfo.visaRequirements}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const HotelsTabContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tripData.hotels.map((hotel, index) => (
        <Card
          key={index}
          className="overflow-hidden group hover:shadow-lg transition-shadow border-none shadow-md"
        >
          <div className="relative h-48 w-full">
            <img
              src="/pokhara.jpg"
              alt={hotel.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-sm font-semibold">
              ${hotel.pricePerNight}/night
            </div>
          </div>

          <CardHeader className="bg-white">
            <CardTitle className="flex items-center gap-2">
              <Hotel className="w-5 h-5 text-indigo-500" />
              {hotel.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <a
                href={createGoogleMapsUrl(`${hotel.name} ${hotel.location}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 hover:underline"
              >
                {hotel.location}
              </a>
            </CardDescription>
          </CardHeader>

          <CardContent className="bg-white">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  {[...Array(Math.floor(hotel.rating))].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                  {hotel.rating % 1 !== 0 && (
                    <svg
                      className="w-4 h-4 text-yellow-400 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                        fillOpacity="0.5"
                      />
                    </svg>
                  )}
                  <span className="ml-1 text-sm text-gray-600">{hotel.rating}/5</span>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="bg-indigo-50 px-2 py-1 rounded text-sm text-indigo-700"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {hotel.notes && <p className="text-sm text-gray-600">{hotel.notes}</p>}

              <Button
                variant="outline"
                className="w-full mt-2 font-semibold shadow-sm group-hover:bg-indigo-50 text-indigo-700 border-indigo-200"
                onClick={() => {
                  const availabilityQuery = `${hotel.name} in ${hotel.location}`;
                  window.open(createGoogleMapsUrl(availabilityQuery), "_blank");
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
        <Card
          key={index}
          className="overflow-hidden group hover:shadow-lg transition-shadow border-none shadow-md"
        >
          <div className="relative h-48 w-full">
            <img
              src="/restaurant.jpg"
              alt={restaurant.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-sm font-semibold">
              {restaurant.priceRange}
            </div>
          </div>

          <CardHeader className="bg-white">
            <CardTitle className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-indigo-500" />
              {restaurant.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <a
                href={createGoogleMapsUrl(`${restaurant.name} ${restaurant.location}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 hover:underline"
              >
                {restaurant.location}
              </a>
            </CardDescription>
          </CardHeader>

          <CardContent className="bg-white">
            <div className="space-y-4">
              <div>
                <span className="text-indigo-700 bg-indigo-50 px-2 py-1 rounded text-sm">
                  {restaurant.cuisine} Cuisine
                </span>
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

              <Button
                variant="outline"
                className="w-full mt-2 font-semibold shadow-sm group-hover:bg-indigo-50 text-indigo-700 border-indigo-200"
                onClick={() => {
                  const availabilityQuery = `${restaurant.name} in ${restaurant.location}`;
                  window.open(createGoogleMapsUrl(availabilityQuery), "_blank");
                }}
              >
                View on Map
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ItineraryTabContent = () => (
    <div className="space-y-6">
      {tripData.dailyItinerary.map((day) => (
        <Card key={day.day} className="border-none shadow-md overflow-hidden">
          <div className="relative h-32 w-full">
            <img
              src={`/day${day.day % 5 || 5}.jpg`}
              alt={`Day ${day.day}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
              <CardHeader className="text-white z-10">
                <CardTitle>
                  Day {day.day} - {day.date}
                </CardTitle>
              </CardHeader>
            </div>
          </div>

          <CardContent className="pt-6 bg-white">
            <div className="space-y-6">
              {day.activities.map((activity, index) => (
                <a
                  key={index}
                  href={createGoogleMapsUrl(`${activity.activity} ${activity.location}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={`/activity${(index + day.day) % 8 + 1}.jpg`}
                        alt={activity.activity}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-900 group-hover:text-indigo-700 transition-colors">
                          {activity.activity}
                        </p>
                        <span className="text-sm text-gray-500">
                          {activity.duration}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4" />
                        {activity.time}
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        {activity.location}
                      </div>

                      <div className="mt-2 text-sm">
                        <span className="text-gray-500">Cost: ${activity.cost}</span>
                        {activity.notes && (
                          <p className="mt-1 text-gray-600">{activity.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const UserPreferencesSection = () => (
    <Card className="mb-6 border-none shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-teal-500 to-green-600 text-white">
        <CardHeader>
          <CardTitle>User Preferences</CardTitle>
          <CardDescription>
            Additional details provided by the user
          </CardDescription>
        </CardHeader>
      </div>
      <CardContent className="pt-6 bg-white">
        <div className="space-y-4">
          {formData.dateFlexibility && (
            <div>
              <p className="text-sm text-gray-500">Date Flexibility:</p>
              <p className="font-medium">{formData.dateFlexibility}</p>
            </div>
          )}
          {formData.preferredSeason && (
            <div>
              <p className="text-sm text-gray-500">Preferred Season:</p>
              <p className="font-medium">{formData.preferredSeason}</p>
            </div>
          )}
          {formData.budgetIncludes && (
            <div>
              <p className="text-sm text-gray-500">Budget Includes:</p>
              <p className="font-medium">{formData.budgetIncludes}</p>
            </div>
          )}
          {formData.splurgeCategories && formData.splurgeCategories.length > 0 && (
            <div>
              <p className="text-sm text-gray-500">Splurge Categories:</p>
              <p className="font-medium">
                {formData.splurgeCategories.join(", ")}
              </p>
            </div>
          )}
          {formData.accommodationType && (
            <div>
              <p className="text-sm text-gray-500">Accommodation Type:</p>
              <p className="font-medium">{formData.accommodationType}</p>
            </div>
          )}
          {formData.locationPreference && (
            <div>
              <p className="text-sm text-gray-500">Location Preference:</p>
              <p className="font-medium">{formData.locationPreference}</p>
            </div>
          )}
          {formData.transportationTypes && formData.transportationTypes.length > 0 && (
            <div>
              <p className="text-sm text-gray-500">Transportation Types:</p>
              <p className="font-medium">
                {formData.transportationTypes.join(", ")}
              </p>
            </div>
          )}
          {formData.activityIntensity && (
            <div>
              <p className="text-sm text-gray-500">Activity Intensity:</p>
              <p className="font-medium">{formData.activityIntensity}</p>
            </div>
          )}
          {formData.mustSeeAttractions && (
            <div>
              <p className="text-sm text-gray-500">Must-See Attractions:</p>
              <p className="font-medium">{formData.mustSeeAttractions}</p>
            </div>
          )}
          {formData.cuisineTypes && formData.cuisineTypes.length > 0 && (
            <div>
              <p className="text-sm text-gray-500">Cuisine Types:</p>
              <p className="font-medium">{formData.cuisineTypes.join(", ")}</p>
            </div>
          )}
          {formData.diningStyles && formData.diningStyles.length > 0 && (
            <div>
              <p className="text-sm text-gray-500">Dining Styles:</p>
              <p className="font-medium">{formData.diningStyles.join(", ")}</p>
            </div>
          )}
          {formData.dietaryRestrictions && formData.dietaryRestrictions.length > 0 && (
            <div>
              <p className="text-sm text-gray-500">Dietary Restrictions:</p>
              <p className="font-medium">
                {formData.dietaryRestrictions.join(", ")}
              </p>
            </div>
          )}
          {formData.structuredVsFreeTime && (
            <div>
              <p className="text-sm text-gray-500">Structured vs Free Time:</p>
              <p className="font-medium">{formData.structuredVsFreeTime}</p>
            </div>
          )}
          {formData.morningVsEveningPerson && (
            <div>
              <p className="text-sm text-gray-500">Morning vs Evening Person:</p>
              <p className="font-medium">{formData.morningVsEveningPerson}</p>
            </div>
          )}
          {formData.specialRequirements && (
            <div>
              <p className="text-sm text-gray-500">Special Requirements:</p>
              <p className="font-medium">{formData.specialRequirements}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="relative h-64 md:h-96 w-full mb-6 rounded-xl overflow-hidden shadow-xl">
        <img
          src="/pokhara.jpg"
          alt={tripData.tripOverview.destination}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 flex flex-col justify-end">
          <div className="p-6 md:p-8 text-white max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {firstName}'s Trip to {tripData.tripOverview.destination}
            </h1>
            <p className="text-lg opacity-90">{tripData.tripOverview.duration} days of adventure</p>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 px-3 py-2 rounded-full text-sm font-semibold text-gray-800 flex items-center gap-1 shadow-md">
          <Camera className="w-4 h-4" />
          <a
            href={createGoogleMapsUrl(`${tripData.tripOverview.destination} panorama view`)}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            View in Maps
          </a>
        </div>
      </div>

      <TripOverview />
      <CostBreakdown />
      <UserPreferencesSection />

      <Tabs defaultValue="itinerary" className="mb-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full bg-white shadow-md rounded-lg overflow-hidden border-none">
          <TabsTrigger value="itinerary" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Itinerary</TabsTrigger>
          <TabsTrigger value="hotels" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Hotels</TabsTrigger>
          <TabsTrigger value="restaurants" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Restaurants</TabsTrigger>
          <TabsTrigger value="transport" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Transportation</TabsTrigger>
          <TabsTrigger value="essentials" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Essential Info</TabsTrigger>
        </TabsList>

        <TabsContent value="itinerary">
          <ItineraryTabContent />
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
          <EssentialInfoSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TripDetailViewer;