// constants.ts
import { Users, Heart } from "lucide-react";
import React from "react";

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

// Configuration Constants
export const BUDGET_OPTIONS: BudgetOption[] = [
  { level: "Low", range: "0 - 1000 NRP" },
  { level: "Medium", range: "1000 - 2500 NRP" },
  { level: "High", range: "2500+ NRP" },
];

export const COMPANION_OPTIONS: CompanionOption[] = [
  { type: "Solo", icon: Users, description: "Traveling alone" },
  { type: "Family", icon: Users, description: "With family members" },
  { type: "Friends", icon: Users, description: "With a group of friends" },
  { type: "Couple", icon: Heart, description: "Romantic getaway" },
  { type: "Business", icon: Users, description: "Business trip" },
  { type: "Group Tour", icon: Users, description: "Organized tour group" },
];

export const ACTIVITIES = [
  "Cultural",
  "Adventure",
  "Relaxation",
  "Shopping",
  "Food & Dining",
  "Nature",
  "Historical",
  "Nightlife",
];
