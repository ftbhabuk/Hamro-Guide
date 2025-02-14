// the fk is this page for lol delete it later on wft is this

// require("dotenv").config();
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const apiKey = process.env.GEMINI_API_KEY;
// if (!apiKey) {
//   console.error("Error: GEMINI_API_KEY is missing from environment variables.");
//   process.exit(1);
// }

// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   responseMimeType: "application/json",
// };

// async function planTrip(location, budget, numPeople) {
//   try {
//     const chatSession = model.startChat({ generationConfig });

//     const userPrompt = `
//       I need you to plan a trip with the following details:
//       - Location: ${location}
//       - Budget: ${budget}
//       - Number of people: ${numPeople}
      
//       The trip plan should include:
//       - Geo-coordinates of the destination
//       - Hotel recommendations with pricing, descriptions, and ratings
//       - Fun places to explore along the way
//       - Suggested time of visit
//       - Other necessary details for a well-organized trip

//       Return the response in **valid JSON format** with clearly structured fields.
//     `;

//     const result = await chatSession.sendMessage(userPrompt);
//     const responseText = result.response.text();

//     try {
//       const tripPlan = JSON.parse(responseText);
//       console.log("Generated Trip Plan:", JSON.stringify(tripPlan, null, 2));
//       return tripPlan;
//     } catch (error) {
//       console.error("Error: The model response was not valid JSON.");
//       console.error(responseText);
//       return null;
//     }
//   } catch (error) {
//     console.error("Error during API request:", error);
//   }
// }

