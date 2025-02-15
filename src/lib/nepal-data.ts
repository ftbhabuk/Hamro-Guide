// src/lib/nepal-data.ts - This file contains your Nepal database
export const nepalDatabase = {
    destinations: [
      {
        name: "Kathmandu",
        description: "Nepal's capital and cultural heart with numerous UNESCO World Heritage sites",
        mustVisit: ["Boudhanath Stupa", "Pashupatinath Temple", "Durbar Square", "Swayambhunath (Monkey Temple)"],
        bestTimeToVisit: "September to November, February to April",
        typicalCosts: {
          budget: "20-40 USD/day",
          midRange: "50-100 USD/day",
          luxury: "150+ USD/day"
        }
      },
      {
        name: "Pokhara",
        description: "Scenic lakeside city and gateway to the Annapurna Circuit",
        mustVisit: ["Phewa Lake", "World Peace Pagoda", "Sarangkot", "International Mountain Museum"],
        bestTimeToVisit: "September to November, February to April",
        typicalCosts: {
          budget: "15-35 USD/day",
          midRange: "40-90 USD/day",
          luxury: "120+ USD/day"
        }
      },
      {
        name: "Chitwan National Park",
        description: "UNESCO-listed nature reserve with rich wildlife including rhinos and tigers",
        mustVisit: ["Jungle Safari", "Elephant Breeding Center", "Canoeing on Rapti River", "Tharu Cultural Show"],
        bestTimeToVisit: "October to March",
        typicalCosts: {
          budget: "30-60 USD/day",
          midRange: "70-120 USD/day",
          luxury: "150+ USD/day"
        }
      },
      {
        name: "Lumbini",
        description: "Birthplace of Buddha and a major pilgrimage site",
        mustVisit: ["Maya Devi Temple", "Ashoka Pillar", "World Peace Pagoda", "Various International Monasteries"],
        bestTimeToVisit: "November to March",
        typicalCosts: {
          budget: "15-30 USD/day",
          midRange: "40-80 USD/day",
          luxury: "100+ USD/day"
        }
      }
    ],
    
    hotels: [
      {
        name: "Hotel Yak & Yeti",
        location: "Kathmandu",
        priceRange: "$$$",
        website: "https://www.yakandyeti.com/",
        highlights: ["Historic property", "Swimming pool", "Multiple restaurants", "Central location"]
      },
      {
        name: "Kathmandu Guest House",
        location: "Kathmandu",
        priceRange: "$$",
        website: "https://ktmgh.com/",
        highlights: ["Historic property", "Garden oasis", "Thamel location", "Beatles stayed here"]
      },
      {
        name: "Temple Tree Resort & Spa",
        location: "Pokhara",
        priceRange: "$$$",
        website: "https://templetreenepal.com/",
        highlights: ["Lake view", "Pool", "Spa", "Near Lakeside"]
      },
      {
        name: "Hotel Middle Path",
        location: "Pokhara",
        priceRange: "$$",
        website: "https://hotelmiddlepath.com/",
        highlights: ["Affordable luxury", "Restaurant", "Lakeside views", "Rooftop"]
      },
      {
        name: "Barahi Jungle Lodge",
        location: "Chitwan",
        priceRange: "$$$",
        website: "https://barahijunglelodge.com/",
        highlights: ["Luxury safari lodge", "River views", "All-inclusive packages", "Pool"]
      },
      {
        name: "Buddha Maya Garden Hotel",
        location: "Lumbini",
        priceRange: "$$",
        website: "https://buddhamayagarden.com/",
        highlights: ["Near sacred garden", "Peaceful setting", "Restaurant", "Garden"]
      }
    ],
    
    cuisine: [
      {
        dish: "Momos",
        description: "Steamed dumplings filled with meat or vegetables",
        mustTry: true
      },
      {
        dish: "Dal Bhat",
        description: "Traditional Nepali meal with rice, lentil soup, and various sides",
        mustTry: true
      },
      {
        dish: "Sel Roti",
        description: "Sweet ring-shaped rice bread/donut",
        mustTry: true
      },
      {
        dish: "Thukpa",
        description: "Noodle soup with meat and vegetables",
        mustTry: true
      },
      {
        dish: "Gundruk",
        description: "Fermented leafy green vegetable, a national dish",
        mustTry: true
      },
      {
        dish: "Chatamari",
        description: "Newari rice crepe, often called Nepali pizza",
        mustTry: true
      }
    ],
    
    transportation: {
      fromAirport: [
        {
          type: "Prepaid Taxi",
          cost: "7-10 USD (Kathmandu), 5-7 USD (Pokhara)",
          notes: "Official booths at airport exits"
        },
        {
          type: "Hotel Pickup",
          cost: "Usually free or 10-15 USD",
          notes: "Arrange in advance"
        }
      ],
      localOptions: [
        {
          type: "Local Bus",
          cost: "0.15-0.30 USD per ride",
          notes: "Crowded but authentic experience"
        },
        {
          type: "Taxi",
          cost: "2-5 USD for short trips",
          notes: "Negotiate fare before boarding"
        },
        {
          type: "Tourist Bus",
          cost: "10-25 USD between major cities",
          notes: "More comfortable for long journeys"
        }
      ]
    },
    
    culturalNotes: [
      "Remove shoes before entering temples or homes",
      "Walk clockwise around stupas and religious sites",
      "Ask permission before photographing people",
      "Dress modestly when visiting religious sites",
      "The traditional greeting is 'Namaste' with palms together",
      "Public displays of affection are not common"
    ],
    
    safetyTips: [
      "Register with your embassy if trekking in remote areas",
      "Use reputable trekking agencies for mountain expeditions",
      "Be aware of altitude sickness when going above 3000m",
      "Keep valuables secure, especially in touristy areas",
      "Always have travel insurance that covers medical evacuation",
      "Drink purified or bottled water only"
    ],
    
    emergencyInfo: {
      tourist_police: "01-4226359/4226403",
      ambulance: "102",
      fire: "101",
      hospitals: [
        {
          name: "CIWEC Hospital",
          location: "Kathmandu",
          phone: "+977 1-4424111",
          notes: "Specializes in travel medicine"
        },
        {
          name: "Manipal Teaching Hospital",
          location: "Pokhara",
          phone: "+977 61-526416",
          notes: "Large modern facility"
        }
      ]
    }
  };
  