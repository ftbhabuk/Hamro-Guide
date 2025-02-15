// Updated route.ts file with database integration
import { GoogleGenerativeAI } from "@google/generative-ai";
import { nepalDatabase } from "@/lib/nepal-data";

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export async function POST(req: Request) {
  try {
    const {
      destination,
      duration,
      budget,
      travelCompanion,
      selectedActivities,
      specialRequirements,
    } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chatSession = model.startChat({ generationConfig });

    // Check if destination is in Nepal
    const isNepalDestination = destination?.label?.toLowerCase().includes("nepal");

    // Base prompt
    let userPrompt = `
      Act as a professional travel planner. Create a detailed trip plan for the following requirements:

      Trip Details:
      - Destination: ${destination.label}
      - Duration: ${duration} days
      - Budget: ${budget}
      - Travel Group: ${travelCompanion}
      - Activities of Interest: ${selectedActivities.join(", ")}
      - Special Requirements: ${specialRequirements}
    `;
    
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
      1. Incorporate the verified destinations, hotels, and cuisine in your plan
      2. Consider seasonal factors for the itinerary
      3. Include appropriate cultural notes and safety tips
      4. Use the emergency information provided
      5. Factor in transportation options and costs
      `;
    }
    
    // Add the response format requirements
    userPrompt += `
      
      Provide a comprehensive travel plan in a valid JSON format strictly following this structure:

      {
        "tripOverview": {
          "destination": string,
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

      Important guidelines:
      1. All prices should be in USD
      2. Use realistic prices and ratings
      3. Include at least 2 hotel options
      4. Provide a detailed day-by-day itinerary
      5. Factor in travel time between locations
      6. Consider the selected activities and special requirements
      7. Include local emergency contacts
      8. Ensure all arrays contain at least one item
      9. All fields must be present and properly formatted
      10. Ensure the JSON is valid and follows the exact structure provided

      Your response should be ONLY the JSON object, with no additional text or explanations.
    `;

    const result = await chatSession.sendMessage(userPrompt);
    const responseText = result.response.text();

    // Log the raw response for debugging
    console.log("Raw Gemini Response:", responseText);

    // Validate JSON structure
    const tripPlan = JSON.parse(responseText);

    // Basic validation of required fields
    if (
      !tripPlan.tripOverview ||
      !tripPlan.hotels ||
      !tripPlan.dailyItinerary
    ) {
      throw new Error("Invalid response structure");
    }

    return Response.json({ success: true, data: tripPlan });
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