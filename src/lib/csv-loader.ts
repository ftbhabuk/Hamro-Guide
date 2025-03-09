// src/lib/csv-loader.ts
import axios from "axios";
import { parse } from "csv-parse/sync";

export interface NepalDestination {
  pID: number;
  pName: string;
  culture: number;
  adventure: number;
  wildlife: number;
  sightseeing: number;
  history: number;
  tags: string[];
  province: number;
  district: string;
  nearby_landmark: string;
  best_time_to_visit: string;
  things_to_do: string[];
  travel_tips: string[]; // Swapped travel_tips for local_specialties
}

const GOOGLE_DRIVE_FILE_ID = "1F62pqLXHZOFNOwKbzOdyEKAPhaP_Tz0i";
const GOOGLE_DRIVE_URL = `https://drive.google.com/uc?export=download&id=${GOOGLE_DRIVE_FILE_ID}`;

export async function loadDestinationsFromDrive(): Promise<NepalDestination[]> {
  try {
    const response = await axios.get(GOOGLE_DRIVE_URL, { responseType: "text" });
    const fileContent = response.data;

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    return records.map((record: Record<string, string>) => ({
      pID: parseInt(record.pID),
      pName: record.pName,
      culture: parseInt(record.culture),
      adventure: parseInt(record.adventure),
      wildlife: parseInt(record.wildlife),
      sightseeing: parseInt(record.sightseeing),
      history: parseInt(record.history),
      tags: record.tags?.replace(/"/g, "").split(",").map((tag: string) => tag.trim()) || [],
      province: parseInt(record.province),
      district: record.district,
      nearby_landmark: record.nearby_landmark,
      best_time_to_visit: record.best_time_to_visit,
      things_to_do: record.things_to_do?.split(",").map((item: string) => item.trim()) || [],
      local_specialties: record.local_specialties || "", // Updated to match your new column
    }));
  } catch (error) {
    console.error("Error fetching CSV from Google Drive:", error);
    return [];
  }
}