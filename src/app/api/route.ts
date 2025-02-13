// src/app/api/plan-trip/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export async function POST(req: Request) {
  try {
    const { destination, duration, budget, travelCompanion, selectedActivities, specialRequirements } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chatSession = model.startChat({ generationConfig });

    const userPrompt = `
      I need you to plan a trip with the following details:
      - Destination: ${destination.label}
      - Duration: ${duration} days
      - Budget: ${budget}
      - Travel Group: ${travelCompanion}
      - Preferred Activities: ${selectedActivities.join(', ')}
      - Special Requirements: ${specialRequirements}

      Please provide a detailed trip plan including:
      1. Accommodation recommendations (with prices and ratings)
      2. Daily itinerary with activities matching preferences
      3. Restaurant suggestions
      4. Transportation options
      5. Estimated costs breakdown
      6. Local tips and customs
      7. Best time to visit
      8. Emergency contacts and important information

      Return the response in valid JSON format with these clearly structured fields.
    `;

    const result = await chatSession.sendMessage(userPrompt);
    const responseText = result.response.text();
    const tripPlan = JSON.parse(responseText);

    return Response.json({ success: true, data: tripPlan });
  } catch (error) {
    console.error('Error generating trip plan:', error);
    return Response.json(
      { success: false, error: 'Failed to generate trip plan' },
      { status: 500 }
    );
  }
}