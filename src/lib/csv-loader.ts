// src/lib/csv-loader.ts
import fs from "fs";
import path from "path";
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
  travel_tips: string[];
}

export function loadDestinationsFromCSV(): NepalDestination[] {
  try {
    const csvFilePath = path.join(process.cwd(), "data", "nepal-destinations.csv");
    if (!fs.existsSync(csvFilePath)) {
      console.warn(`CSV file not found at: ${csvFilePath}`);
      return []; // Empty array as fallback; add sample data if you want
    }

    const fileContent = fs.readFileSync(csvFilePath, "utf8");
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
      tags: record.tags.replace(/"/g, "").split(",").map((tag: string) => tag.trim()),
      province: parseInt(record.province),
      district: record.district,
      nearby_landmark: record.nearby_landmark,
      best_time_to_visit: record.best_time_to_visit,
      things_to_do: record.things_to_do.split(",").map((item: string) => item.trim()),
      travel_tips: record.travel_tips.split(",").map((tip: string) => tip.trim()),
    }));
  } catch (error) {
    console.error("Error loading CSV data:", error);
    return [];
  }
}