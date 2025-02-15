import { GoogleGenerativeAI } from "@google/generative-ai";
import { nepalDatabase } from "@/lib/nepal-data";

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Helper function to find matching destination in database
function findNepalDestination(input: string) {
  if (!input) return null;

  const normalizedInput = input.toLowerCase();

  // Check main destinations
  for (const dest of nepalDatabase.destinations) {
    // Check main name
    if (normalizedInput.includes(dest.name.toLowerCase())) {
      return { name: dest.name, type: "main destination" };
    }

    // Check Nepali name if it exists
    if (
      dest.nepaliName &&
      normalizedInput.includes(dest.nepaliName.toLowerCase())
    ) {
      return { name: dest.name, type: "main destination" };
    }

    // Check local terms if they exist
    if (dest.localTerms) {
      for (const term of dest.localTerms) {
        if (normalizedInput.includes(term.toLowerCase())) {
          return { name: dest.name, type: "main destination" };
        }
      }
    }

    // Check sub-regions if they exist
    if (dest.subRegions) {
      for (const subRegion of dest.subRegions) {
        if (normalizedInput.includes(subRegion.name.toLowerCase())) {
          return {
            name: `${subRegion.name}, ${dest.name}`,
            type: "sub-region",
          };
        }
      }
    }

    // Check must-visit places
    if (dest.mustVisit) {
      for (const place of dest.mustVisit) {
        if (normalizedInput.includes(place.toLowerCase())) {
          return { name: `${place}, ${dest.name}`, type: "attraction" };
        }
      }
    }
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
      user: userData,
    } = await req.json();

    // Log the user data for debugging
    console.log("User Data received in /api:", userData);

    // Safely get user destination
    let userDestination = "";
    if (
      destination &&
      typeof destination === "object" &&
      "label" in destination
    ) {
      userDestination = destination.label as string;
    } else if (typeof destination === "string") {
      userDestination = destination;
    } else {
      // Handle case where destination is missing or invalid
      throw new Error("Invalid or missing destination");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chatSession = model.startChat({ generationConfig });

    // Try to match it with our Nepal database
    const matchedDestination = findNepalDestination(userDestination);

    // Safely check if this is about Nepal
    const isNepalDestination =
      matchedDestination !== null ||
      userDestination.toLowerCase().includes("nepal");

    // Get activities as a string, handling the case where it might be missing
    const activitiesString = Array.isArray(selectedActivities)
      ? selectedActivities.join(", ")
      : "";

    // Base prompt with STRONG emphasis on using the exact destination
    let userPrompt = `
      Act as a professional travel planner (like a local guide in Nepal).

      CRITICAL INSTRUCTION: You MUST create a trip plan for EXACTLY this
      destination: "${userDestination}".

      - Do NOT substitute it with a more popular destination.
      - Do NOT change the destination to a nearby city.
      - The trip MUST be to ${userDestination} EXACTLY as specified.

      Trip Details:
      - Destination: ${userDestination}
      - Duration: ${duration} days
      - Budget: ${budget}
      - Travel Group: ${travelCompanion}
      - Activities of Interest: ${activitiesString}
      - Special Requirements: ${specialRequirements}
    `;

    if (matchedDestination) {
      userPrompt += `

        I've identified that "${userDestination}" is in or near
        ${matchedDestination.name}. You MUST focus the trip on
        "${userDestination}" specifically, while you can use information about
        ${matchedDestination.name} to help with recommendations.
      `;
    }

    // Add Nepal-specific information if the destination is in Nepal
    if (isNepalDestination) {
      userPrompt += `
        Since this trip is to Nepal, use the following verified information:
        --- NEPAL VERIFIED DATA ---
        DESTINATIONS:
        ${JSON.stringify(nepalDatabase.destinations, null, 2)}
        RECOMMENDED HOTELS:
        ${JSON.stringify(nepalDatabase.hotels, null, 2)}
        LOCAL CUISINE:
        ${JSON.stringify(nepalDatabase.cuisine, null, 2)}
        TRANSPORTATION OPTIONS:
        ${JSON.stringify(nepalDatabase.transportation, null, 2)}
        CULTURAL NOTES:
        ${JSON.stringify(nepalDatabase.culturalNotes, null, 2)}
        SAFETY TIPS:
        ${JSON.stringify(nepalDatabase.safetyTips, null, 2)}
        EMERGENCY INFORMATION:
        ${JSON.stringify(nepalDatabase.emergencyInfo, null, 2)}
        --- END NEPAL VERIFIED DATA ---

        Important Nepal-specific guidelines:

        1. Incorporate the verified destinations, hotels, and cuisine in your
           plan.
        2. Consider seasonal factors for the itinerary.
        3. Include appropriate cultural notes and safety tips.
        4. Use the emergency information provided.
        5. Factor in transportation options and costs.

        If the user specified a small town, village, or local area in Nepal
        that's not in our database, please:

        1. Include it in the itinerary and make it the central focus.
        2. You can reference the nearest major destination in our database for
           context.
        3. Suggest authentic local experiences for that specific area.
        4. Include local transportation options to get there.
        5. Recommend local homestays or guesthouses if available.
        6. **If information about "${userDestination}" is limited in the
           provided data:
           - Prioritize suggesting general activities or attractions in the
             *region* rather than inventing specific details.
           - When recommending hotels or restaurants, if specific options for
             "${userDestination}" are unavailable in the provided data, suggest
             options in the nearest major town or city (e.g., Kathmandu,
             Pokhara).
           - If the database lacks specific details for "${userDestination}",
             focus on providing essential travel information like transportation
             options, safety tips, and cultural notes.
           - Do NOT invent specific details or attractions that are not
             verifiable.**
      `;
    } else {
      userPrompt += `
        **If "${userDestination}" is not found in the provided database:

        - Use your knowledge to provide a general overview of the area, but
          clearly state that the information is based on your general knowledge
          and may not be entirely accurate.
        - Prioritize suggesting transportation options to reach the area from the
          nearest major city in Nepal (e.g., Kathmandu, Pokhara).
        - Recommend local homestays or guesthouses if available.
        - Do NOT invent specific details or attractions that are not
          verifiable.**
      `;
    }

    // Add the response format requirements with hardcoded destination
    userPrompt += `
      Provide a comprehensive travel plan in a valid JSON format strictly
      following this structure:
      {
        "tripOverview": {
          "destination": "${userDestination}", // MUST be exactly this value, do
                                               // not change it
          "duration": number,
          "bestTimeToVisit": string,
          "weatherInfo": string,
          "budgetCategory": string,
          "totalEstimatedCost": number
        },
        "hotels": [
          {
            "name": string,
            "location": string, // This should include ${userDestination} for at
                                 // least one hotel
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
                "location": string, // Most activities should be in
                                     // ${userDestination}
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
            "location": string, // At least one restaurant should be in
                                 // ${userDestination}
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

      Important guidelines:

      1. All prices should be in USD.
      2. Use realistic prices and ratings.
      3. Include at least 2 hotel options.
      4. Provide a detailed day-by-day itinerary.
      5. Factor in travel time between locations.
      6. Consider the selected activities and special requirements.
      7. Include local emergency contacts.
      8. Ensure all arrays contain at least one item.
      9. All fields must be present and properly formatted.
      10. Ensure the JSON is valid and follows the exact structure provided.
      11. The destination MUST be "${userDestination}" exactly as provided by
          the user.

      Your response should be ONLY the JSON object, with no additional text or
      explanations.
    `;

    const result = await chatSession.sendMessage(userPrompt);
    const responseText = result.response.text();

    // Log the raw response for debugging
    console.log("Raw Gemini Response:", responseText);

    // Safety net for JSON parsing
    let fixedResponseText = responseText;
    try {
      // Try to fix common JSON errors
      fixedResponseText = responseText.replace(/,\s*}/g, "}"); // Remove trailing commas
      fixedResponseText = responseText.replace(/,\s*]/g, "]"); // Remove trailing commas
    } catch (fixError) {
      console.warn("Error trying to fix JSON:", fixError);
    }

    // Validate JSON structure and force correct destination if needed
    try {
      const tripPlan = JSON.parse(fixedResponseText);

      // Force the correct destination if Gemini ignored our instructions
      if (
        tripPlan.tripOverview &&
        tripPlan.tripOverview.destination !== userDestination
      ) {
        console.log(
          `Correcting destination from "${tripPlan.tripOverview.destination}" to "${userDestination}"`
        );
        tripPlan.tripOverview.destination = userDestination;
      }

      // Basic validation of required fields
      if (
        !tripPlan.tripOverview ||
        !tripPlan.hotels ||
        !tripPlan.dailyItinerary
      ) {
        throw new Error("Invalid response structure");
      }

      return Response.json({ success: true, data: tripPlan });
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      console.error("Response Text:", responseText); // Log the response text
      return Response.json(
        {
          success: false,
          error: "Failed to parse JSON response from the model.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating trip plan:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to generate trip plan. Please try again.",
      },
      { status: 500 }
    );
  }
}
