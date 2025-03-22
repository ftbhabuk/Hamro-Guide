// src/app/api/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { loadDestinationsFromDrive, NepalDestination } from "@/lib/csv-loader";
import { getDestinationVectors, findSimilarDestinations } from "@/lib/vector-processing";

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Enhanced destination finding function using vector search
async function findNepalDestinations(input: string, destinations: NepalDestination[]) {
  if (!input) return null;

  // First try exact name matching (keep this for backward compatibility)
  const normalizedInput = input.toLowerCase();
  for (const dest of destinations) {
    if (normalizedInput.includes(dest.pName.toLowerCase())) {
      return { name: dest.pName, type: "main destination", data: dest, similarDestinations: [] };
    }
  }

  // Use vector search for semantic matching
  const vectorData = await getDestinationVectors(destinations);
  const similarDestinations = findSimilarDestinations(input, vectorData, 3);
  
  if (similarDestinations.length > 0 && similarDestinations[0].similarity > 0.3) {
    const mainMatch = similarDestinations[0].destination;
    const otherSimilar = similarDestinations.slice(1);
    
    return {
      name: mainMatch.pName,
      type: "vector matched",
      similarity: similarDestinations[0].similarity,
      data: mainMatch,
      similarDestinations: otherSimilar.map(item => ({
        name: item.destination.pName,
        similarity: item.similarity,
        data: item.destination
      }))
    };
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const {
      destination,
      duration,
      budget,
      travelCompanion,
      selectedActivities = [],
      specialRequirements = "",
      startDate,
      endDate,
      dateFlexibility,
      preferredSeason,
      currency,
      budgetIncludes,
      splurgeCategories = [],
      accommodationType,
      locationPreference,
      transportationTypes = [],
      activityIntensity,
      mustSeeAttractions,
      cuisineTypes = [],
      diningStyles = [],
      dietaryRestrictions = [],
      structuredVsFreeTime,
      morningVsEveningPerson,
      user: userData,
    } = await req.json();

    console.log("User Data received in /api:", userData);

    let userDestination = "";
    if (destination && typeof destination === "object" && "label" in destination) {
      userDestination = destination.label as string;
    } else if (typeof destination === "string") {
      userDestination = destination;
    } else {
      throw new Error("Invalid or missing destination");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chatSession = model.startChat({ generationConfig });

    const destinations = await loadDestinationsFromDrive(); // Fetch from Drive
    const destinationMatch = await findNepalDestinations(userDestination, destinations);

    const isNepalDestination =
      destinationMatch !== null || userDestination.toLowerCase().includes("nepal");

    const activitiesString = Array.isArray(selectedActivities)
      ? selectedActivities.join(", ")
      : "";

    let userPrompt = `
      Act as a professional travel planner specializing in Nepal.

      CRITICAL INSTRUCTION: You MUST create a trip plan for EXACTLY this
      destination: "${userDestination}". Do NOT substitute it or change it.

      Trip Details:
      - Destination: ${userDestination}
      - Duration: ${duration} days
      - Budget: ${budget}
      - Travel Group: ${travelCompanion}
      - Activities of Interest: ${activitiesString}
      - Special Requirements: ${specialRequirements}
      - Start Date: ${startDate}
      - End Date: ${endDate}
      - Date Flexibility: ${dateFlexibility}
      - Preferred Season: ${preferredSeason}
      - Currency: ${currency}
      - Budget Includes: ${budgetIncludes}
      - Splurge Categories: ${splurgeCategories.join(", ")}
      - Accommodation Type: ${accommodationType}
      - Location Preference: ${locationPreference}
      - Transportation Types: ${transportationTypes.join(", ")}
      - Activity Intensity: ${activityIntensity}
      - Must See Attractions: ${mustSeeAttractions}
      - Cuisine Types: ${cuisineTypes.join(", ")}
      - Dining Styles: ${diningStyles.join(", ")}
      - Dietary Restrictions: ${dietaryRestrictions.join(", ")}
      - Structured vs Free Time: ${structuredVsFreeTime}
      - Morning vs Evening Person: ${morningVsEveningPerson}
    `;

    if (destinationMatch && destinationMatch.data) {
      const destData = destinationMatch.data;
      userPrompt += `
        MATCHED DESTINATION DETAILS:
        - Name: ${destData.pName}
        - District: ${destData.district}
        - Province: ${destData.province}
        - Ratings (0-5): Culture: ${destData.culture}, Adventure: ${destData.adventure}, Wildlife: ${destData.wildlife}, Sightseeing: ${destData.sightseeing}, History: ${destData.history}
        - Tags: ${destData.tags.join(", ")}
        - Nearby Landmark: ${destData.nearby_landmark}
        - Best Time to Visit: ${destData.best_time_to_visit}
        - Things to Do: ${(destData.things_to_do || []).join(", ") || "Not specified"}
        - Travel Tips: ${(destData.travel_tips || []).join(", ") || "Not specified"}
        - Local Specialty: Not specified
        - Match Type: ${destinationMatch.type}
        ${destinationMatch.similarity ? `- Match Confidence: ${(destinationMatch.similarity * 100).toFixed(1)}%` : ''}
    
        Use this data to craft a rich trip plan:
        - Prioritize "Things to Do" matching user activities.
        - Use numeric ratings to align with preferences.
        - Include the Nearby Landmark if it fits.
        - Weave Travel Tips into essentialInfo.
      `;

      // Add similar destinations if available
      if (destinationMatch.similarDestinations && destinationMatch.similarDestinations.length > 0) {
        userPrompt += `
        SIMILAR DESTINATIONS YOU MAY WANT TO INCLUDE:
        ${destinationMatch.similarDestinations.map((sim, idx) => 
          `${idx+1}. ${sim.name} (${(sim.similarity * 100).toFixed(1)}% similar)
           - District: ${sim.data.district}
           - Province: ${sim.data.province}
           - Tags: ${sim.data.tags.join(", ")}
           - Things to Do: ${sim.data.things_to_do.join(", ")}
          `).join("\n")}
          
        Consider including 1-2 of these similar destinations as day trips or secondary stops if:
        - They are geographically close to the main destination
        - They complement the user's preferred activities
        - The trip duration allows for multiple destinations
        `;
      }
    }

    if (isNepalDestination) {
      const nearbyPlaces = destinationMatch
        ? destinations
            .filter(
              (d) =>
                (d.province === destinationMatch.data.province ||
                  d.district === destinationMatch.data.district) &&
                d.pName !== destinationMatch.data.pName
            )
            .slice(0, 2)
        : [];

      userPrompt += `
        NEPAL DATA:
        - Nearby Places (if matched): ${nearbyPlaces.length ? JSON.stringify(nearbyPlaces, null, 2) : "None identified"}
        - Emergency Info: Police: 100, Ambulance: 102, Tourist Police (Kathmandu): +977 1 4226359
        - Cultural Notes: Remove shoes at temples, Dress modestly, Use right hand
        - Safety Tips: Drink bottled water, Carry flashlight, Watch altitude
        
        Guidelines for Local Places:
        1. Use the matched destination's data for activities, timing, and tips.
        2. Suggest visiting Nearby Places or the Nearby Landmark if relevant.
        3. If "${userDestination}" isn't in the data, use the nearest matching district or province info and focus on general Nepal experiences.
      `;
    } else {
      userPrompt += `
        If "${userDestination}" isn't in the data:
        - Provide a general overview based on your knowledge.
        - Suggest transport from Kathmandu or Pokhara.
        - Avoid inventing unverifiable details.
      `;
    }

    userPrompt += `
      Provide a travel plan in valid JSON format:
      {
        "tripOverview": {
          "destination": "${userDestination}",
          "duration": number,
          "bestTimeToVisit": string,
          "weatherInfo": string,
          "budgetCategory": string,
          "totalEstimatedCost": number
        },
        "hotels": [
          {
            "name": string,
            "location": string,
            "pricePerNight": number,
            "rating": number,
            "amenities": string[],
            "bookingUrl": string,
            "notes": string
          }
        ],
        "dailyItinerary": [
          {
            "day": number,
            "date": string,
            "activities": [
              {
                "time": string,
                "activity": string,
                "location": string,
                "duration": string,
                "cost": number,
                "notes": string
              }
            ]
          }
        ],
        "restaurants": [
          {
            "name": string,
            "cuisine": string,
            "location": string,
            "priceRange": string,
            "mustTryDishes": string[],
            "rating": number
          }
        ],
        "transportation": {
          "fromAirport": {
            "options": string[],
            "estimatedCosts": number[]
          },
          "localTransport": {
            "options": string[],
            "estimatedCosts": number[]
          }
        },
        "costBreakdown": {
          "accommodation": number,
          "activities": number,
          "transportation": number,
          "food": number,
          "miscellaneous": number
        },
        "essentialInfo": {
          "emergencyContacts": {
            "police": string,
            "ambulance": string,
            "nearestHospital": string
          },
          "localCustoms": string[],
          "packingList": string[],
          "visaRequirements": string,
          "safetyTips": string[]
        }
      }

      Guidelines:
      1. Prices in USD.
      2. At least 2 hotels, realistic prices/ratings.
      3. Detailed daily itinerary using Things to Do and Nearby Places.
      4. Use numeric ratings to match user preferences.
      5. Include the Nearby Landmark if relevant.
      6. Incorporate Travel Tips in essentialInfo.
      7. Return ONLY the JSON object, no extra text.
    `;

    const result = await chatSession.sendMessage(userPrompt);
    const responseText = result.response.text();

    console.log("Raw Gemini Response:", responseText);

    let fixedResponseText = responseText;
    try {
      fixedResponseText = responseText.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
    } catch (fixError) {
      console.warn("Error trying to fix JSON:", fixError);
    }

    try {
      const tripPlan = JSON.parse(fixedResponseText);
      if (tripPlan.tripOverview && tripPlan.tripOverview.destination !== userDestination) {
        console.log(
          `Correcting destination from "${tripPlan.tripOverview.destination}" to "${userDestination}"`
        );
        tripPlan.tripOverview.destination = userDestination;
      }
      if (!tripPlan.tripOverview || !tripPlan.hotels || !tripPlan.dailyItinerary) {
        throw new Error("Invalid response structure");
      }
      return Response.json({ success: true, data: tripPlan });
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      console.error("Response Text:", responseText);
      return Response.json(
        { success: false, error: "Failed to parse JSON response from the model." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating trip plan:", error);
    return Response.json(
      { success: false, error: "Failed to generate trip plan. Please try again." },
      { status: 500 }
    );
  }
}