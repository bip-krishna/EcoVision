import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  transportFactors,
  foodFactors,
  energyFactor,
  shoppingFactors,
} from "../data/carbonFactors";
import { postAssessment, AssessmentRequest, AssessmentResponse } from "./api";

const STORAGE_KEY = "ecovision_assessment";

export interface FootprintBreakdown {
  transport: number;
  food: number;
  energy: number;
  shopping: number;
}

export interface AssessmentResult {
  score: number;
  footprint: number;
  breakdown: FootprintBreakdown;
  date: string;
  suggestions: string[];
}

export function calculateFootprint(
  transport: keyof typeof transportFactors,
  food: keyof typeof foodFactors,
  energy: number,
  shopping: keyof typeof shoppingFactors
): { score: number; footprint: number; breakdown: FootprintBreakdown } {
  const transportVal = transportFactors[transport] * 2.5;
  const foodVal = foodFactors[food] * 7;
  const energyVal = energy * energyFactor * 30;
  const shoppingVal = shoppingFactors[shopping] * 4;

  const breakdown: FootprintBreakdown = {
    transport: Math.round(transportVal * 10) / 10,
    food: Math.round(foodVal * 10) / 10,
    energy: Math.round(energyVal * 10) / 10,
    shopping: Math.round(shoppingVal * 10) / 10,
  };

  const footprint = transportVal + foodVal + energyVal + shoppingVal;
  const score = Math.max(0, Math.min(100, Math.round(100 - (footprint / 50) * 100)));

  return {
    score,
    footprint: Math.round(footprint * 10) / 10,
    breakdown,
  };
}

export async function saveAssessmentResult(result: AssessmentResult): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch (error) {
    console.error("Failed to save assessment result:", error);
  }
}

export async function getLastAssessment(): Promise<AssessmentResult | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to get assessment result:", error);
    return null;
  }
}

export async function submitAssessment(data: AssessmentRequest): Promise<AssessmentResult> {
  const response = await postAssessment(data);
  const result: AssessmentResult = {
    score: response.score,
    footprint: response.footprint,
    breakdown: response.breakdown,
    date: new Date().toISOString(),
    suggestions: response.suggestions,
  };
  await saveAssessmentResult(result);
  return result;
}
