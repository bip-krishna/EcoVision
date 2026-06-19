import AsyncStorage from "@react-native-async-storage/async-storage";
import { postScan, ScanResponse } from "./api";

const HISTORY_KEY = "ecovision_scan_history";

export interface ScanResult {
  id: string;
  object: string;
  category: string;
  impact: string;
  suggestion: string;
  co2Saved: number;
  date: string;
  imageUri?: string;
}

export async function scanWaste(imageUri: string): Promise<ScanResult> {
  const response = await postScan(imageUri);
  const result: ScanResult = {
    id: Date.now().toString(),
    object: response.object,
    category: response.category,
    impact: response.impact,
    suggestion: response.suggestion,
    co2Saved: response.co2Saved,
    date: new Date().toISOString(),
    imageUri,
  };
  await saveScanResult(result);
  return result;
}

export async function saveScanResult(result: ScanResult): Promise<void> {
  try {
    const history = await getScanHistory();
    history.unshift(result);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  } catch (error) {
    console.error("Failed to save scan result:", error);
  }
}

export async function getScanHistory(): Promise<ScanResult[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to get scan history:", error);
    return [];
  }
}
