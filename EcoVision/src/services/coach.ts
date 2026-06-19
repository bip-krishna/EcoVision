import AsyncStorage from "@react-native-async-storage/async-storage";
import { postCoach, CoachRequest } from "./api";
import { challenges, Challenge } from "../data/challenges";

const ACHIEVEMENTS_KEY = "ecovision_achievements";
const CHALLENGES_KEY = "ecovision_challenges";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: string;
}

export async function getAdvice(score: number, category?: string): Promise<CoachRequest & { suggestions: string[]; tips: string[] }> {
  const response = await postCoach({ score, category });
  return { score, category, ...response };
}

export async function getChallenges(): Promise<Challenge[]> {
  try {
    const saved = await AsyncStorage.getItem(CHALLENGES_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    await AsyncStorage.setItem(CHALLENGES_KEY, JSON.stringify(challenges));
    return challenges;
  } catch {
    return challenges;
  }
}

export async function updateChallengeProgress(challengeId: string, progress: number): Promise<Challenge[]> {
  const current = await getChallenges();
  const updated = current.map((c) =>
    c.id === challengeId ? { ...c, progress: Math.min(100, progress) } : c
  );
  await AsyncStorage.setItem(CHALLENGES_KEY, JSON.stringify(updated));
  return updated;
}

export async function completeChallenge(challengeId: string): Promise<Challenge[]> {
  const current = await getChallenges();
  const challenge = current.find((c) => c.id === challengeId);
  if (challenge && challenge.progress < 100) {
    const achievement: Achievement = {
      id: `ach_${challengeId}_${Date.now()}`,
      title: challenge.title,
      description: `Completed: ${challenge.description}`,
      icon: challenge.icon,
      unlocked: true,
      date: new Date().toISOString(),
    };
    await saveAchievement(achievement);
  }
  return updateChallengeProgress(challengeId, 100);
}

export async function getAchievements(): Promise<Achievement[]> {
  try {
    const data = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveAchievement(achievement: Achievement): Promise<void> {
  try {
    const current = await getAchievements();
    current.unshift(achievement);
    await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(current.slice(0, 100)));
  } catch (error) {
    console.error("Failed to save achievement:", error);
  }
}

export async function getTotalPoints(): Promise<number> {
  const achievements = await getAchievements();
  return achievements.reduce((sum, a) => {
    const challenge = challenges.find((c) => c.title === a.title);
    return sum + (challenge ? challenge.points : 10);
  }, 0);
}
