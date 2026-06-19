import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import EcoScore from "../components/EcoScore";
import ChallengeCard from "../components/ChallengeCard";
import AchievementCard from "../components/AchievementCard";
import {
  getAdvice,
  getChallenges,
  updateChallengeProgress,
  getAchievements,
  completeChallenge,
  Achievement,
} from "../services/coach";
import { getLastAssessment } from "../services/assessment";
import { Challenge } from "../data/challenges";

export default function CoachScreen() {
  const [score, setScore] = useState<number>(50);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [tips, setTips] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);
  const [adviceLoaded, setAdviceLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const assess = await getLastAssessment();
    if (assess) setScore(assess.score);

    const [chals, achievs] = await Promise.all([
      getChallenges(),
      getAchievements(),
    ]);
    setChallenges(chals);
    setAchievements(achievs);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleGetAdvice = async () => {
    setLoading(true);
    try {
      const result = await getAdvice(score);
      setSuggestions(result.suggestions);
      setTips(result.tips);
      setAdviceLoaded(true);
    } catch (error) {
      alert("Failed to get advice. Please try again.");
    }
    setLoading(false);
  };

  const handleCompleteChallenge = async (challengeId: string) => {
    const updated = await completeChallenge(challengeId);
    setChallenges(updated);
    const achievs = await getAchievements();
    setAchievements(achievs);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>AI Eco Coach</Text>
        <Text style={styles.headerSubtitle}>Your personal sustainability guide</Text>
        <EcoScore score={score} size="large" />
        <Text style={styles.scoreLabel}>Current Eco Score</Text>
      </View>

      {!adviceLoaded ? (
        <TouchableOpacity
          style={[styles.adviceButton, loading && styles.adviceButtonDisabled]}
          onPress={handleGetAdvice}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Text style={styles.adviceButtonIcon}>🧠</Text>
              <Text style={styles.adviceButtonText}>Get AI Advice</Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.refreshAdviceButton}
          onPress={handleGetAdvice}
          disabled={loading}
        >
          <Text style={styles.refreshAdviceText}>
            {loading ? "Loading..." : "🔄 Refresh Advice"}
          </Text>
        </TouchableOpacity>
      )}

      {suggestions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Suggestions</Text>
          {suggestions.map((s, i) => (
            <View key={i} style={styles.suggestionCard}>
              <Text style={styles.suggestionIcon}>💡</Text>
              <Text style={styles.suggestionText}>{s}</Text>
            </View>
          ))}
        </View>
      )}

      {tips.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Quick Tips</Text>
          {tips.map((t, i) => (
            <View key={i} style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>{t}</Text>
            </View>
          ))}
        </View>
      )}

      {challenges.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Eco Challenges</Text>
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onComplete={handleCompleteChallenge}
            />
          ))}
        </View>
      )}

      {achievements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Achievements</Text>
          {achievements.map((a) => (
            <AchievementCard
              key={a.id}
              title={a.title}
              description={a.description}
              icon={a.icon}
              unlocked={a.unlocked}
              date={a.date}
            />
          ))}
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  headerSection: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2E7D32",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginTop: 8,
  },
  adviceButton: {
    flexDirection: "row",
    backgroundColor: "#2E7D32",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  adviceButtonDisabled: {
    opacity: 0.7,
  },
  adviceButtonIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  adviceButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  refreshAdviceButton: {
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 8,
  },
  refreshAdviceText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2E7D32",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  suggestionCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "flex-start",
  },
  suggestionIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 1,
  },
  suggestionText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    lineHeight: 20,
  },
  tipItem: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 4,
  },
  tipBullet: {
    fontSize: 16,
    color: "#2E7D32",
    marginRight: 8,
    lineHeight: 20,
  },
  tipText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
    lineHeight: 20,
  },
});
