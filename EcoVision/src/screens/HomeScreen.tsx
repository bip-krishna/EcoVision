import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import EcoScore from "../components/EcoScore";
import CarbonCard from "../components/CarbonCard";
import ChallengeCard from "../components/ChallengeCard";
import AchievementCard from "../components/AchievementCard";
import { getLastAssessment, AssessmentResult } from "../services/assessment";
import { getChallenges, getAchievements, Achievement } from "../services/coach";
import { Challenge } from "../data/challenges";

export default function HomeScreen({ navigation }: any) {
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [assess, chals, achievs] = await Promise.all([
      getLastAssessment(),
      getChallenges(),
      getAchievements(),
    ]);
    setAssessment(assess);
    setChallenge(chals.length > 0 ? chals[0] : null);
    setAchievement(achievs.length > 0 ? achievs[0] : null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (!assessment) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.welcomeContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeEmoji}>🌍</Text>
          <Text style={styles.welcomeTitle}>Welcome to EcoVision</Text>
          <Text style={styles.welcomeText}>
            Track your carbon footprint, scan waste, and get AI-powered tips to live more sustainably.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Assessment")}
          >
            <Text style={styles.primaryButtonText}>Start Assessment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Scan")}
          >
            <Text style={styles.secondaryButtonText}>Scan Waste</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.headerSection}>
        <Text style={styles.greeting}>Your Eco Score</Text>
        <EcoScore score={assessment.score} size="large" />
        <Text style={styles.scoreLabel}>
          {assessment.score >= 70
            ? "Great job! 🌱"
            : assessment.score >= 40
            ? "Room for improvement 🌿"
            : "Let's get started! 🌍"}
        </Text>
      </View>

      <CarbonCard
        title="Carbon Footprint"
        value={assessment.footprint}
        unit="kg CO₂/month"
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Assessment")}
        >
          <Text style={styles.primaryButtonText}>Assess Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Scan")}
        >
          <Text style={styles.secondaryButtonText}>Scan Waste</Text>
        </TouchableOpacity>
      </View>

      {challenge && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Challenge</Text>
          <ChallengeCard challenge={challenge} />
        </View>
      )}

      {achievement && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Achievement</Text>
          <AchievementCard
            title={achievement.title}
            description={achievement.description}
            icon={achievement.icon}
            unlocked={achievement.unlocked}
            date={achievement.date}
          />
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
  welcomeContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2E7D32",
    marginBottom: 12,
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  headerSection: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 12,
  },
  buttonRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginVertical: 8,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2E7D32",
  },
  secondaryButtonText: {
    color: "#2E7D32",
    fontSize: 15,
    fontWeight: "700",
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginLeft: 16,
    marginBottom: 8,
  },
});
