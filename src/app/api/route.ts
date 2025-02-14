// src/app/api/plan-trip/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const generationConfig = {
  temperature: 0.7, // Lowered for more consistent outputs
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

    const userPrompt = `
      Act as a professional travel planner. Create a detailed trip plan for the following requirements:

      Trip Details:
      - Destination: ${destination.label}
      - Duration: ${duration} days
      - Budget: ${budget}
      - Travel Group: ${travelCompanion}
      - Activities of Interest: ${selectedActivities.join(", ")}
      - Special Requirements: ${specialRequirements}

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
