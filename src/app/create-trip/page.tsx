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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { CalendarIcon, InfoIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Define additional constants
const ACCOMMODATION_TYPES = [
  { label: "Hotel", value: "hotel" },
  { label: "Airbnb/Rental", value: "airbnb" },
  { label: "Hostel", value: "hostel" },
  { label: "Resort", value: "resort" },
  { label: "Camping", value: "camping" },
  { label: "Stay with locals", value: "local" },
];

const TRANSPORTATION_TYPES = [
  { label: "Public Transit", value: "publicTransit" },
  { label: "Rental Car", value: "rentalCar" },
  { label: "Walking/Biking", value: "walkingBiking" },
  { label: "Rideshare/Taxi", value: "rideshare" },
  { label: "Guided Tours", value: "guidedTours" },
];

const ACTIVITY_CATEGORIES = {
  "Outdoor & Adventure": ["Hiking", "Beach", "Water Sports", "Skiing", "Wildlife"],
  "Cultural & Historical": ["Museums", "Historical Sites", "Architecture", "Local Events"],
  "Culinary & Nightlife": ["Fine Dining", "Street Food", "Wine Tasting", "Nightlife"],
  "Relaxation & Wellness": ["Spa", "Yoga", "Meditation", "Hot Springs"],
  "Shopping & Entertainment": ["Markets", "Malls", "Theater", "Concerts", "Sports Events"]
};

const CUISINE_TYPES = [
  "Local/Regional", "Italian", "Asian", "Mediterranean", 
  "Middle Eastern", "Mexican/Latin", "Vegetarian/Vegan", 
  "Fast Food", "Seafood", "Steakhouse", "Fusion"
];

const DIETARY_RESTRICTIONS = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "glutenFree", label: "Gluten-Free" },
  { id: "dairyFree", label: "Dairy-Free" },
  { id: "nutFree", label: "Nut-Free" },
  { id: "kosher", label: "Kosher" },
  { id: "halal", label: "Halal" },
];

const FLEXIBILITY_OPTIONS = [
  { label: "Exact dates only", value: "exact" },
  { label: "±2 days", value: "pm2days" },
  { label: "±1 week", value: "pm1week" },
  { label: "Very flexible", value: "veryFlexible" },
];

const SEASONS = [
  { label: "Spring", value: "spring" },
  { label: "Summer", value: "summer" },
  { label: "Fall", value: "fall" },
  { label: "Winter", value: "winter" },
];

const CURRENCIES = [
  { label: "USD ($)", value: "USD" },
  { label: "EUR (€)", value: "EUR" },
  { label: "GBP (£)", value: "GBP" },
  { label: "JPY (¥)", value: "JPY" },
  { label: "CAD (C$)", value: "CAD" },
  { label: "AUD (A$)", value: "AUD" },
];

const ACTIVITY_INTENSITY = [
  { label: "Relaxed (lots of downtime)", value: "relaxed" },
  { label: "Moderate (balanced pace)", value: "moderate" },
  { label: "Action-packed (busy itinerary)", value: "actionPacked" },
];
const CompanionSelection = ({
  travelCompanion,
  setTravelCompanion,
}) => {
  return (
    <div className="space-y-2">
      <TooltipWrapper content="Are you traveling solo, with a partner, family, or friends?">
        <label className="text-lg font-medium text-gray-900">
          Who are you traveling with?
        </label>
      </TooltipWrapper>
      <Select
        value={travelCompanion}
        onValueChange={setTravelCompanion}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select travel companion" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="solo">Solo</SelectItem>
          <SelectItem value="partner">Partner</SelectItem>
          <SelectItem value="family">Family</SelectItem>
          <SelectItem value="friends">Friends</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};


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

// Helper Components with Tooltips
const TooltipWrapper = ({ content, children }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-flex items-center">
          {children}
          <InfoIcon className="ml-1 h-4 w-4 text-gray-400" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// New and updated components
const TravelDatesSelection = ({
  startDate, setStartDate,
  endDate, setEndDate,
  dateFlexibility, setDateFlexibility,
  preferredSeason, setPreferredSeason
}) => {
  const [showDatePicker, setShowDatePicker] = useState(true);
  
  useEffect(() => {
    // If very flexible is selected, hide date picker and show season selector
    if (dateFlexibility === "veryFlexible") {
      setShowDatePicker(false);
    } else {
      setShowDatePicker(true);
    }
  }, [dateFlexibility]);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <TooltipWrapper content="Let us know when you plan to travel. This helps us suggest seasonal activities and events.">
          <h2 className="text-lg font-medium text-gray-900">Travel Timing</h2>
        </TooltipWrapper>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {showDatePicker && (
            <>
              <div className="w-full sm:w-1/2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="w-full sm:w-1/2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date < (startDate || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}
        </div>

        <div className="space-y-2">
          <TooltipWrapper content="Let us know how flexible your travel dates are. This helps us suggest optimal timing.">
            <Label>How flexible are your dates?</Label>
          </TooltipWrapper>
          <Select
            value={dateFlexibility}
            onValueChange={setDateFlexibility}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select flexibility" />
            </SelectTrigger>
            <SelectContent>
              {FLEXIBILITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!showDatePicker && (
          <div className="space-y-2">
            <TooltipWrapper content="If you don't have specific dates, let us know your preferred season to travel.">
              <Label>Preferred Season to Travel</Label>
            </TooltipWrapper>
            <Select
              value={preferredSeason}
              onValueChange={setPreferredSeason}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select preferred season" />
              </SelectTrigger>
              <SelectContent>
                {SEASONS.map((season) => (
                  <SelectItem key={season.value} value={season.value}>
                    {season.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

const BudgetSelection = ({
  budget,
  setBudget,
  currency,
  setCurrency,
  budgetIncludes,
  setBudgetIncludes,
  splurgeCategories,
  setSplurgeCategories,
}) => (
  <div className="space-y-4">
    <div className="space-y-1">
      <TooltipWrapper content="Your budget helps us recommend appropriate accommodations, dining options, and activities.">
        <h2 className="text-lg font-medium text-gray-900">Budget Details</h2>
      </TooltipWrapper>
      <p className="text-gray-600">
        Help us understand your spending preferences.
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

    <div className="flex gap-4 flex-col sm:flex-row">
      <div className="w-full sm:w-1/2">
        <TooltipWrapper content="Select the currency you'll be using for your budget.">
          <Label className="mb-2 block">Currency</Label>
        </TooltipWrapper>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((curr) => (
              <SelectItem key={curr.value} value={curr.value}>
                {curr.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-1/2">
        <TooltipWrapper content="Let us know if your budget includes transportation to your destination.">
          <Label className="mb-2 block">Your budget includes:</Label>
        </TooltipWrapper>
        <Select value={budgetIncludes} onValueChange={setBudgetIncludes}>
          <SelectTrigger>
            <SelectValue placeholder="What does your budget include?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="everything">Everything (inc. flights/transport to destination)</SelectItem>
            <SelectItem value="excludeTransport">Excludes transport to destination</SelectItem>
            <SelectItem value="onlyAtDestination">Only at-destination expenses</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="space-y-2">
      <TooltipWrapper content="Tell us where you'd be willing to spend more for a premium experience.">
        <Label className="mb-2 block">Where would you prefer to splurge? (Select all that apply)</Label>
      </TooltipWrapper>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {["Accommodation", "Dining", "Activities", "Transportation", "Shopping", "Nightlife"].map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox
              id={`splurge-${category}`}
              checked={splurgeCategories.includes(category)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSplurgeCategories([...splurgeCategories, category]);
                } else {
                  setSplurgeCategories(splurgeCategories.filter(item => item !== category));
                }
              }}
            />
            <label
              htmlFor={`splurge-${category}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {category}
            </label>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AccommodationPreferences = ({
  accommodationType,
  setAccommodationType,
  locationPreference,
  setLocationPreference
}) => (
  <div className="space-y-4">
    <div className="space-y-1">
      <TooltipWrapper content="Your accommodation preferences help us suggest suitable places to stay.">
        <h2 className="text-lg font-medium text-gray-900">Accommodation Preferences</h2>
      </TooltipWrapper>
    </div>

    <div className="space-y-2">
      <Label className="mb-2 block">Preferred Accommodation Type</Label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ACCOMMODATION_TYPES.map((option) => (
          <Card
            key={option.value}
            className={`p-3 cursor-pointer transition-colors ${
              accommodationType === option.value ? "border-blue-500" : ""
            }`}
            onClick={() => setAccommodationType(option.value)}
          >
            <div className="text-center">
              <h3 className="font-medium">{option.label}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>

    <div className="space-y-2">
      <TooltipWrapper content="Let us know if you prefer to stay in particular areas.">
        <Label className="mb-2 block">Preferred Location/Neighborhood</Label>
      </TooltipWrapper>
      <div className="flex flex-col space-y-2">
        <Textarea
          placeholder="E.g., close to downtown, near the beach, in a quiet area..."
          value={locationPreference}
          onChange={(e) => setLocationPreference(e.target.value)}
          className="h-20"
        />
        <p className="text-sm text-gray-500 italic">Example: "I prefer to stay in the historic district" or "I'd like to be within walking distance to major attractions"</p>
      </div>
    </div>
  </div>
);

const TransportationPreferences = ({
  transportationTypes,
  setTransportationTypes
}) => (
  <div className="space-y-4">
    <div className="space-y-1">
      <TooltipWrapper content="Your transportation preferences help us suggest suitable ways to get around.">
        <h2 className="text-lg font-medium text-gray-900">Transportation Preferences</h2>
      </TooltipWrapper>
    </div>

    <div className="space-y-2">
      <Label className="mb-2 block">How do you prefer to get around? (Select all that apply)</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {TRANSPORTATION_TYPES.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`transport-${option.value}`}
              checked={transportationTypes.includes(option.value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setTransportationTypes([...transportationTypes, option.value]);
                } else {
                  setTransportationTypes(transportationTypes.filter(item => item !== option.value));
                }
              }}
            />
            <label
              htmlFor={`transport-${option.value}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ActivityPreferencesDepth = ({
  activityIntensity,
  setActivityIntensity,
  selectedActivities,
  toggleActivity,
  mustSeeAttractions,
  setMustSeeAttractions
}) => (
  <div className="space-y-4">
    <div className="space-y-1">
      <TooltipWrapper content="This helps us understand what activities to prioritize in your itinerary.">
        <h2 className="text-lg font-medium text-gray-900">Activity Preferences</h2>
      </TooltipWrapper>
    </div>

    <div className="space-y-3">
      <Label className="block">Preferred Activity Intensity</Label>
      <RadioGroup value={activityIntensity} onValueChange={setActivityIntensity}>
        {ACTIVITY_INTENSITY.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`intensity-${option.value}`} />
            <Label htmlFor={`intensity-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>

    <div className="space-y-3">
      <Label className="block">Preferred Activities by Category</Label>
      
      <Tabs defaultValue="Outdoor & Adventure" className="w-full">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5">
          {Object.keys(ACTIVITY_CATEGORIES).map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs sm:text-sm">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {Object.entries(ACTIVITY_CATEGORIES).map(([category, activities]) => (
          <TabsContent key={category} value={category} className="pt-4">
            <div className="flex flex-wrap gap-2">
              {activities.map((activity) => (
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
          </TabsContent>
        ))}
      </Tabs>
    </div>

    <div className="space-y-2">
      <TooltipWrapper content="List any specific attractions or activities you don't want to miss.">
        <Label className="mb-2 block">Must-See Attractions or Activities</Label>
      </TooltipWrapper>
      <Textarea
        placeholder="E.g., Eiffel Tower in Paris, Grand Canyon in Arizona..."
        value={mustSeeAttractions}
        onChange={(e) => setMustSeeAttractions(e.target.value)}
        className="h-20"
      />
      <p className="text-sm text-gray-500 italic">Example: "I definitely want to visit the Louvre" or "Hiking in the national park is a must for us"</p>
    </div>
  </div>
);

const DiningPreferences = ({
  cuisineTypes,
  setCuisineTypes,
  diningStyles,
  setDiningStyles,
  dietaryRestrictions,
  setDietaryRestrictions
}) => (
  <div className="space-y-4">
    <div className="space-y-1">
      <TooltipWrapper content="Your dining preferences help us suggest suitable restaurants and food experiences.">
        <h2 className="text-lg font-medium text-gray-900">Dining Preferences</h2>
      </TooltipWrapper>
    </div>

    <div className="space-y-2">
      <TooltipWrapper content="Select the types of cuisine you enjoy or want to try.">
        <Label className="mb-2 block">Preferred Cuisine Types (Select all that apply)</Label>
      </TooltipWrapper>
      <div className="flex flex-wrap gap-2">
        {CUISINE_TYPES.map((cuisine) => (
          <Button
            key={cuisine}
            variant="outline"
            className={`rounded-full ${
              cuisineTypes.includes(cuisine)
                ? "bg-blue-100 border-blue-500"
                : ""
            }`}
            onClick={() => {
              if (cuisineTypes.includes(cuisine)) {
                setCuisineTypes(cuisineTypes.filter(c => c !== cuisine));
              } else {
                setCuisineTypes([...cuisineTypes, cuisine]);
              }
            }}
          >
            {cuisine}
          </Button>
        ))}
      </div>
    </div>

    <div className="space-y-2">
      <TooltipWrapper content="Select your preferred dining environments and styles.">
        <Label className="mb-2 block">Preferred Dining Styles (Select all that apply)</Label>
      </TooltipWrapper>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {["Street Food", "Casual Dining", "Fine Dining", "Local Eateries", "Food Tours", "Cooking Classes"].map((style) => (
          <div key={style} className="flex items-center space-x-2">
            <Checkbox
              id={`dining-${style.replace(/\s+/g, '')}`}
              checked={diningStyles.includes(style)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setDiningStyles([...diningStyles, style]);
                } else {
                  setDiningStyles(diningStyles.filter(s => s !== style));
                }
              }}
            />
            <label
              htmlFor={`dining-${style.replace(/\s+/g, '')}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {style}
            </label>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-2">
      <TooltipWrapper content="Let us know about any dietary restrictions so we can suggest appropriate dining options.">
        <Label className="mb-2 block">Dietary Restrictions (Select all that apply)</Label>
      </TooltipWrapper>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {DIETARY_RESTRICTIONS.map((restriction) => (
          <div key={restriction.id} className="flex items-center space-x-2">
            <Checkbox
              id={`diet-${restriction.id}`}
              checked={dietaryRestrictions.includes(restriction.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setDietaryRestrictions([...dietaryRestrictions, restriction.id]);
                } else {
                  setDietaryRestrictions(dietaryRestrictions.filter(r => r !== restriction.id));
                }
              }}
            />
            <label
              htmlFor={`diet-${restriction.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {restriction.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TimeAllocationPreferences = ({
  structuredVsFreeTime,
  setStructuredVsFreeTime,
  morningVsEveningPerson,
  setMorningVsEveningPerson
}) => (
  <div className="space-y-4">
    <div className="space-y-1">
      <TooltipWrapper content="This helps us balance your itinerary between planned activities and free time.">
        <h2 className="text-lg font-medium text-gray-900">Time Allocation Preferences</h2>
      </TooltipWrapper>
    </div>

    <div className="space-y-3">
      <Label className="block">How do you prefer your time to be allocated?</Label>
      <RadioGroup value={structuredVsFreeTime} onValueChange={setStructuredVsFreeTime}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="mostlyStructured" id="mostly-structured" />
          <Label htmlFor="mostly-structured">Mostly structured (guided tours, planned activities)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="balancedMix" id="balanced-mix" />
          <Label htmlFor="balanced-mix">Balanced mix of structured activities and free time</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="mostlyFreeTime" id="mostly-free-time" />
          <Label htmlFor="mostly-free-time">Mostly free time with few planned activities</Label>
        </div>
      </RadioGroup>
    </div>

    <div className="space-y-3">
      <Label className="block">Are you a morning person or evening person?</Label>
      <RadioGroup value={morningVsEveningPerson} onValueChange={setMorningVsEveningPerson}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="morningPerson" id="morning-person" />
          <Label htmlFor="morning-person">Morning person (early starts, earlier dinners)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="eveningPerson" id="evening-person" />
          <Label htmlFor="evening-person">Evening person (later starts, nightlife)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="flexible" id="time-flexible" />
          <Label htmlFor="time-flexible">Flexible/mix of both</Label>
        </div>
      </RadioGroup>
    </div>
  </div>
);

// Main component
const CreateTripPage = () => {
  // Existing state
  const [destination, setDestination] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [travelCompanion, setTravelCompanion] = useState<string>("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [specialRequirements, setSpecialRequirements] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<any | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [jsonBinId, setJsonBinId] = useState<string | null>(null);
  
  // New state for additional features
  const [currentStep, setCurrentStep] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dateFlexibility, setDateFlexibility] = useState("");
  const [preferredSeason, setPreferredSeason] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [budgetIncludes, setBudgetIncludes] = useState("");
  const [splurgeCategories, setSplurgeCategories] = useState<string[]>([]);
  const [accommodationType, setAccommodationType] = useState("");
  const [locationPreference, setLocationPreference] = useState("");
  const [transportationTypes, setTransportationTypes] = useState<string[]>([]);
  const [activityIntensity, setActivityIntensity] = useState("moderate");
  const [mustSeeAttractions, setMustSeeAttractions] = useState("");
  const [cuisineTypes, setCuisineTypes] = useState<string[]>([]);
  const [diningStyles, setDiningStyles] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [structuredVsFreeTime, setStructuredVsFreeTime] = useState("balancedMix");
  const [morningVsEveningPerson, setMorningVsEveningPerson] = useState("flexible");

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

      const response = await axios.post(
        "https://api.jsonbin.io/v3/b",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key": apiKey,
            "X-Bin-Name": `Trip Plan - ${data.formData.destination} - ${new Date().toISOString()}`,
          },
        }
      );

      console.log(
        "Successfully stored data in JSONBin.io:",
        response.data
      );
      setJsonBinId(response.data.metadata.id);

      // Add success message in UI
      if (response.data.metadata.id) {
        // Store the ID for later reference
        localStorage.setItem(
          "lastTripPlanId",
          response.data.metadata.id
        );
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

    // Combine all form data
    const formData = {
      destination,
      duration,
      budget,
      travelCompanion,
      selectedActivities,
      specialRequirements,
      // Travel timing data
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      dateFlexibility,
      preferredSeason,
      // Budget refinement data
      currency,
      budgetIncludes,
      splurgeCategories,
      // Accommodation data
      accommodationType,
      locationPreference,
      // Transportation data
      transportationTypes,
      // Activity depth data
      activityIntensity,
      mustSeeAttractions,
      // Dining preferences
      cuisineTypes,
      diningStyles,
      dietaryRestrictions,
      // Time allocation
      structuredVsFreeTime,
      morningVsEveningPerson,
      // User data
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
        console.log(
          "Trip plan generated successfully:",
          tripPlanData
        );
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

          // Store userData in localStorage
          localStorage.setItem("temp_user_data", JSON.stringify(userData));

          // Redirect to the view trip page, passing ONLY the tripId
          router.push(`/view-trip/${tripId}`);
        } catch (jsonBinError) {
          console.error(
            "Failed to store trip plan in JSONBin.io:",
            jsonBinError
          );
        }

        setOpen(true);
      } else {
        console.error(
          "Failed to generate trip plan:",
          response.data.error
        );
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation functions for multi-step form
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  // Helper function to render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-3xl font-semibold text-gray-900">
                  <h1>Tell us your travel preferences</h1>
                </div>
                <p className="text-gray-600 text-lg">
                  Let's start with the basics. You can provide more details in the next steps.
                </p>
              </div>

              <div className="space-y-2">
                <TooltipWrapper content="This is where you want to go. Be as specific as possible (city, country, region, etc.)">
                  <label className="text-lg font-medium text-gray-900">
                    What is your destination of choice?
                  </label>
                </TooltipWrapper>
                <Input
                  type="text"
                  className="w-full h-12"
                  placeholder="Enter your destination (e.g., Tokyo, Japan)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
                <p className="text-sm text-gray-500 italic">Example: "Paris, France" or "Bali, Indonesia"</p>
              </div>

              <div className="space-y-2">
                <TooltipWrapper content="This helps us create an appropriate itinerary length.">
                  <label className="text-lg font-medium text-gray-900">
                    How many days are you planning your trip?
                  </label>
                </TooltipWrapper>
                <Input
                  type="number"
                  className="w-full h-12"
                  placeholder="Enter number of days"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <TravelDatesSelection
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                dateFlexibility={dateFlexibility}
                setDateFlexibility={setDateFlexibility}
                preferredSeason={preferredSeason}
                setPreferredSeason={setPreferredSeason}
              />

              <CompanionSelection
                travelCompanion={travelCompanion}
                setTravelCompanion={setTravelCompanion}
              />
            </div>
            <div className="pt-6 flex justify-end">
              <Button
                type="button"
                className="h-12 text-lg bg-red-600 hover:bg-red-700 text-white"
                onClick={nextStep}
                disabled={!destination || !duration}
              >
                Next: Budget & Accommodation
              </Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-3xl font-semibold text-gray-900">
                  <h1>Budget & Accommodation</h1>
                </div>
                <p className="text-gray-600 text-lg">
                  Tell us about your spending preferences and where you'd like to stay.
                </p>
              </div>

              <BudgetSelection
                budget={budget}
                setBudget={setBudget}
                currency={currency}
                setCurrency={setCurrency}
                budgetIncludes={budgetIncludes}
                setBudgetIncludes={setBudgetIncludes}
                splurgeCategories={splurgeCategories}
                setSplurgeCategories={setSplurgeCategories}
              />

              <AccommodationPreferences
                accommodationType={accommodationType}
                setAccommodationType={setAccommodationType}
                locationPreference={locationPreference}
                setLocationPreference={setLocationPreference}
              />
            </div>
            <div className="pt-6 flex justify-between">
              <Button
                type="button"
                className="h-12 text-lg"
                variant="outline"
                onClick={prevStep}
              >
                Back
              </Button>
              <Button
                type="button"
                className="h-12 text-lg bg-red-600 hover:bg-red-700 text-white"
                onClick={nextStep}
                disabled={!budget}
              >
                Next: Transportation & Activities
              </Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-3xl font-semibold text-gray-900">
                  <h1>Transportation & Activities</h1>
                </div>
                <p className="text-gray-600 text-lg">
                  Let us know how you want to get around and what you'd like to do.
                </p>
              </div>

              <TransportationPreferences
                transportationTypes={transportationTypes}
                setTransportationTypes={setTransportationTypes}
              />

              <ActivityPreferencesDepth
                activityIntensity={activityIntensity}
                setActivityIntensity={setActivityIntensity}
                selectedActivities={selectedActivities}
                toggleActivity={toggleActivity}
                mustSeeAttractions={mustSeeAttractions}
                setMustSeeAttractions={setMustSeeAttractions}
              />
            </div>
            <div className="pt-6 flex justify-between">
              <Button
                type="button"
                className="h-12 text-lg"
                variant="outline"
                onClick={prevStep}
              >
                Back
              </Button>
              <Button
                type="button"
                className="h-12 text-lg bg-red-600 hover:bg-red-700 text-white"
                onClick={nextStep}
              >
                Next: Dining & Time Preferences
              </Button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-3xl font-semibold text-gray-900">
                  <h1>Dining & Time Preferences</h1>
                </div>
                <p className="text-gray-600 text-lg">
                  Tell us about your food preferences and how you like to structure your time.
                </p>
              </div>

              <DiningPreferences
                cuisineTypes={cuisineTypes}
                setCuisineTypes={setCuisineTypes}
                diningStyles={diningStyles}
                setDiningStyles={setDiningStyles}
                dietaryRestrictions={dietaryRestrictions}
                setDietaryRestrictions={setDietaryRestrictions}
              />

              <TimeAllocationPreferences
                structuredVsFreeTime={structuredVsFreeTime}
                setStructuredVsFreeTime={setStructuredVsFreeTime}
                morningVsEveningPerson={morningVsEveningPerson}
                setMorningVsEveningPerson={setMorningVsEveningPerson}
              />
            </div>
            <div className="pt-6 flex justify-between">
              <Button
                type="button"
                className="h-12 text-lg"
                variant="outline"
                onClick={prevStep}
              >
                Back
              </Button>
              <Button
                type="button"
                className="h-12 text-lg bg-red-600 hover:bg-red-700 text-white"
                onClick={nextStep}
              >
                Next: Additional Requirements
              </Button>
            </div>
          </>
        );
      case 5:
        return (
          <>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-3xl font-semibold text-gray-900">
                  <h1>Additional Requirements</h1>
                </div>
                <p className="text-gray-600 text-lg">
                  Anything else we should know to create your perfect trip?
                </p>
              </div>

              <div className="space-y-2">
                <TooltipWrapper content="Tell us about any special needs, preferences, or requirements that weren't covered in previous sections.">
                  <label className="text-base font-medium text-gray-900">
                    Any special requirements or preferences?
                  </label>
                </TooltipWrapper>
                <Textarea
                  placeholder="E.g., accessibility needs, dietary restrictions, preferred transportation..."
                  className="h-40"
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                />
                <p className="text-sm text-gray-500 italic">
                  Examples: "I need wheelchair-accessible accommodations", "I prefer female tour guides", 
                  "I want to attend a local festival", "I'm traveling with a pet", etc.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-800 mb-2">Review Your Trip Details</h3>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li><strong>Destination:</strong> {destination}</li>
                  <li><strong>Duration:</strong> {duration} days</li>
                  <li><strong>Budget Level:</strong> {budget}</li>
                  <li><strong>Travel Companion:</strong> {travelCompanion}</li>
                  {startDate && endDate && (
                    <li><strong>Dates:</strong> {format(startDate, 'MMM d, yyyy')} to {format(endDate, 'MMM d, yyyy')}</li>
                  )}
                  {selectedActivities.length > 0 && (
                    <li><strong>Activities:</strong> {selectedActivities.join(', ')}</li>
                  )}
                  {/* Add more key details as needed */}
                </ul>
              </div>
            </div>
            <div className="pt-6 flex justify-between">
              <Button
                type="button"
                className="h-12 text-lg"
                variant="outline"
                onClick={prevStep}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="h-12 text-lg bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate My Trip"}
              </Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-6 py-8">
        {userData && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <img
                src={userData.picture}
                alt="Google Profile"
                className="rounded-full w-12 h-12 mr-4"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  Welcome, {userData.name}!
                </h2>
                <p className="text-gray-600">{userData.email}</p>
              </div>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="w-full bg-gray-200 h-2 mb-4 rounded-full">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span className={currentStep >= 1 ? "text-red-600 font-medium" : ""}>Basics</span>
            <span className={currentStep >= 2 ? "text-red-600 font-medium" : ""}>Budget</span>
            <span className={currentStep >= 3 ? "text-red-600 font-medium" : ""}>Activities</span>
            <span className={currentStep >= 4 ? "text-red-600 font-medium" : ""}>Dining</span>
            <span className={currentStep >= 5 ? "text-red-600 font-medium" : ""}>Review</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {renderStep()}
        </form>
      </main>
    </div>
  );
};

export default CreateTripPage;