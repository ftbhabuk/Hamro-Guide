// // src/components/TripDetailsPage.tsx
// "use client";
// import React from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//   Hotel,
//   MapPin,
//   Calendar,
//   DollarSign,
//   Utensils,
//   AlertCircle,
//   Clock,
//   Sun,
// } from "lucide-react";

// // Define TypeScript interfaces for better type safety
// interface TripOverview {
//   destination: string;
//   duration: number;
//   bestTimeToVisit: string;
//   weatherInfo: string;
//   budgetCategory: string;
//   totalEstimatedCost: number;
// }

// interface HotelType {
//   name: string;
//   location: string;
//   pricePerNight: number;
//   rating: number;
//   amenities: string[];
//   bookingUrl: string;
//   notes: string;
// }

// interface Activity {
//   time: string;
//   activity: string;
//   location: string;
//   duration: string;
//   cost: number;
//   notes: string;
// }

// interface DailyItinerary {
//   day: number;
//   date: string;
//   activities: Activity[];
// }

// interface Restaurant {
//   name: string;
//   cuisine: string;
//   location: string;
//   priceRange: string;
//   mustTryDishes: string[];
//   rating: number;
// }

// interface EssentialInfo {
//   emergencyContacts: {
//     police: string;
//     ambulance: string;
//     nearestHospital: string;
//   };
//   localCustoms: string[];
//   packingList: string[];
//   visaRequirements: string;
//   safetyTips: string[];
// }

// interface TripData {
//   tripOverview: TripOverview;
//   hotels: HotelType[];
//   dailyItinerary: DailyItinerary[];
//   restaurants: Restaurant[];
//   essentialInfo: EssentialInfo;
// }

// const TripOverviewSection = ({ overview }: { overview: TripOverview }) => (
//   <Card className="mb-6">
//     <CardContent className="pt-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         <div className="flex items-center gap-2">
//           <MapPin className="w-5 h-5 text-blue-500" />
//           <div>
//             <p className="text-sm text-gray-500">Destination</p>
//             <p className="font-medium">{overview?.destination || "N/A"}</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <Calendar className="w-5 h-5 text-blue-500" />
//           <div>
//             <p className="text-sm text-gray-500">Duration</p>
//             <p className="font-medium">{overview?.duration || "N/A"} days</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <DollarSign className="w-5 h-5 text-blue-500" />
//           <div>
//             <p className="text-sm text-gray-500">Budget Category</p>
//             <p className="font-medium">{overview?.budgetCategory || "N/A"}</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <Sun className="w-5 h-5 text-blue-500" />
//           <div>
//             <p className="text-sm text-gray-500">Best Time to Visit</p>
//             <p className="font-medium">{overview?.bestTimeToVisit || "N/A"}</p>
//           </div>
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// );

// const HotelSection = ({ hotels }: { hotels: HotelType[] }) => (
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//     {hotels?.map((hotel, index) => (
//       <Card key={index} className="hover:shadow-lg transition-shadow">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Hotel className="w-5 h-5 text-blue-500" />
//             {hotel?.name || "Unknown Hotel"}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             <div className="flex items-center gap-2">
//               <MapPin className="w-4 h-4 text-gray-500" />
//               <span>{hotel?.location || "Location not specified"}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-sm text-gray-600">
//                 ${hotel?.pricePerNight || 0}/night
//               </span>
//               <span className="text-sm text-gray-600">
//                 Rating: {hotel?.rating || 0}/5
//               </span>
//             </div>
//             <div>
//               <p className="text-sm font-medium mb-1">Amenities:</p>
//               <div className="flex flex-wrap gap-2">
//                 {hotel?.amenities?.map((amenity, i) => (
//                   <span
//                     key={i}
//                     className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs"
//                   >
//                     {amenity}
//                   </span>
//                 )) || "No amenities"}
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     )) || <p>No hotels found.</p>}
//   </div>
// );

// const ItinerarySection = ({ itinerary }: { itinerary: DailyItinerary[] }) => (
//   <div className="space-y-4">
//     {itinerary?.map((day, index) => (
//       <Card key={index}>
//         <CardHeader>
//           <CardTitle className="text-lg">
//             Day {day?.day} - {day?.date}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {day?.activities?.map((activity, i) => (
//               <div
//                 key={i}
//                 className="flex gap-4 p-2 hover:bg-gray-50 rounded-lg"
//               >
//                 <Clock className="w-5 h-5 text-blue-500 mt-1" />
//                 <div className="flex-1">
//                   <p className="font-medium">
//                     {activity?.time} - {activity?.activity}
//                   </p>
//                   <p className="text-sm text-gray-600">{activity?.location}</p>
//                   <div className="flex justify-between mt-1 text-sm text-gray-500">
//                     <span>Duration: {activity?.duration}</span>
//                     <span>Cost: ${activity?.cost}</span>
//                   </div>
//                 </div>
//               </div>
//             )) || <p>No activities planned for this day.</p>}
//           </div>
//         </CardContent>
//       </Card>
//     )) || <p>No itinerary found.</p>}
//   </div>
// );

// const RestaurantSection = ({ restaurants }: { restaurants: Restaurant[] }) => (
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//     {restaurants?.map((restaurant, index) => (
//       <Card key={index}>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Utensils className="w-5 h-5 text-blue-500" />
//             {restaurant?.name}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <MapPin className="w-4 h-4 text-gray-500" />
//               <span>{restaurant?.location}</span>
//             </div>
//             <p className="text-sm">Cuisine: {restaurant?.cuisine}</p>
//             <p className="text-sm">Price Range: {restaurant?.priceRange}</p>
//             <div>
//               <p className="text-sm font-medium mb-1">Must Try Dishes:</p>
//               <div className="flex flex-wrap gap-2">
//                 {restaurant?.mustTryDishes?.map((dish, i) => (
//                   <span
//                     key={i}
//                     className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs"
//                   >
//                     {dish}
//                   </span>
//                 )) || "No dishes listed"}
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     )) || <p>No restaurants found.</p>}
//   </div>
// );

// const TripDetailsPage = ({ tripData }: { tripData: TripData }) => {
//   if (!tripData) {
//     return (
//       <Alert>
//         <AlertDescription>No trip data available.</AlertDescription>
//       </Alert>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">
//         Your Trip to {tripData?.tripOverview?.destination}
//       </h1>

//       <TripOverviewSection overview={tripData?.tripOverview} />

//       <Tabs defaultValue="itinerary" className="mb-6">
//         <TabsList>
//           <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
//           <TabsTrigger value="hotels">Hotels</TabsTrigger>
//           <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
//           <TabsTrigger value="essentials">Essential Info</TabsTrigger>
//         </TabsList>

//         <TabsContent value="itinerary">
//           <ItinerarySection itinerary={tripData?.dailyItinerary} />
//         </TabsContent>

//         <TabsContent value="hotels">
//           <HotelSection hotels={tripData?.hotels} />
//         </TabsContent>

//         <TabsContent value="restaurants">
//           <RestaurantSection restaurants={tripData?.restaurants} />
//         </TabsContent>

//         <TabsContent value="essentials">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <AlertCircle className="w-5 h-5 text-blue-500" />
//                 Essential Information
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="font-medium mb-2">Emergency Contacts</h3>
//                   <div className="space-y-1 text-sm">
//                     <p>
//                       Police:{" "}
//                       {tripData?.essentialInfo?.emergencyContacts?.police ||
//                         "N/A"}
//                     </p>
//                     <p>
//                       Ambulance:{" "}
//                       {tripData?.essentialInfo?.emergencyContacts?.ambulance ||
//                         "N/A"}
//                     </p>
//                     <p>
//                       Hospital:{" "}
//                       {tripData?.essentialInfo?.emergencyContacts
//                         ?.nearestHospital || "N/A"}
//                     </p>
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="font-medium mb-2">Local Customs</h3>
//                   <ul className="list-disc list-inside text-sm space-y-1">
//                     {tripData?.essentialInfo?.localCustoms?.map((custom, i) => (
//                       <li key={i}>{custom}</li>
//                     )) || "No customs listed"}
//                   </ul>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default TripDetailsPage;
