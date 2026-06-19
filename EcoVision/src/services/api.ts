import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const BASE_URL = Platform.OS === "android"
  ? "http://10.0.2.2:8000"
  : "http://localhost:8000";

export interface AssessmentRequest {
  transport: string;
  food: string;
  energy: number;
  shopping: string;
}

export interface AssessmentResponse {
  score: number;
  footprint: number;
  breakdown: {
    transport: number;
    food: number;
    energy: number;
    shopping: number;
  };
  suggestions: string[];
}

export interface ScanResponse {
  object: string;
  category: string;
  impact: string;
  suggestion: string;
  co2Saved: number;
}

export interface CoachRequest {
  score: number;
  category?: string;
}

export interface CoachResponse {
  suggestions: string[];
  tips: string[];
}

function mockDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 800));
}

export async function postAssessment(data: AssessmentRequest): Promise<AssessmentResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/assessment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    await mockDelay();
    const transportVal = getTransportValue(data.transport);
    const foodVal = getFoodValue(data.food);
    const shoppingVal = getShoppingValue(data.shopping);

    const transport = transportVal * 2.5;
    const food = foodVal * 7;
    const energy = data.energy * 0.5 * 30;
    const shopping = shoppingVal * 4;
    const footprint = transport + food + energy + shopping;
    const score = Math.max(0, Math.min(100, 100 - (footprint / 50) * 100));

    return {
      score: Math.round(score),
      footprint: Math.round(footprint * 10) / 10,
      breakdown: {
        transport: Math.round(transport * 10) / 10,
        food: Math.round(food * 10) / 10,
        energy: Math.round(energy * 10) / 10,
        shopping: Math.round(shopping * 10) / 10,
      },
      suggestions: [
        "Consider using public transport more often",
        "Reduce meat consumption to lower your food footprint",
        "Switch to energy-efficient appliances",
        "Buy second-hand items to reduce shopping impact",
      ],
    };
  }
}

export async function postScan(imageUri: string): Promise<ScanResponse> {
  try {
    const formData = new FormData();
    const filename = imageUri.split("/").pop() || "photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("file", {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const response = await fetch(`${BASE_URL}/api/scan`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    await mockDelay();
    const mockItems: ScanResponse[] = [
      { object: "Plastic Bottle", category: "plastic", impact: "High", suggestion: "Rinse and place in recycling bin", co2Saved: 0.5 },
      { object: "Cardboard Box", category: "paper", impact: "Low", suggestion: "Flatten and recycle", co2Saved: 0.3 },
      { object: "Glass Jar", category: "glass", impact: "Low", suggestion: "Rinse and recycle", co2Saved: 0.4 },
      { object: "Aluminum Can", category: "metal", impact: "Medium", suggestion: "Crush and recycle", co2Saved: 0.6 },
      { object: "Banana Peel", category: "organic", impact: "Low", suggestion: "Compost in green bin", co2Saved: 0.1 },
    ];
    return mockItems[Math.floor(Math.random() * mockItems.length)];
  }
}

export async function postCoach(data: CoachRequest): Promise<CoachResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/coach`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    await mockDelay();
    const allSuggestions = [
      "Switch to LED bulbs to reduce energy consumption",
      "Start composting kitchen waste",
      "Use reusable shopping bags",
      "Take shorter showers to conserve water",
      "Walk or bike for short trips",
      "Buy local produce to reduce food miles",
    ];
    const shuffled = allSuggestions.sort(() => 0.5 - Math.random());
    return {
      suggestions: shuffled.slice(0, 4),
      tips: [
        "Unplug electronics when not in use",
        "Use a programmable thermostat",
        "Repair instead of replace items",
      ],
    };
  }
}

function getTransportValue(key: string): number {
  const map: { [key: string]: number } = { bike: 0, public: 1.5, car: 4.2, plane: 6.8 };
  return map[key] || 2;
}

function getFoodValue(key: string): number {
  const map: { [key: string]: number } = { vegan: 1.5, vegetarian: 2.0, mixed: 3.5, meatHeavy: 5.5 };
  return map[key] || 3;
}

function getShoppingValue(key: string): number {
  const map: { [key: string]: number } = { minimal: 0.5, low: 1.5, medium: 3.0, high: 5.0 };
  return map[key] || 2;
}
