import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import EcoScore from "../components/EcoScore";
import CarbonCard from "../components/CarbonCard";
import ChartCard from "../components/ChartCard";
import { getLastAssessment } from "../services/assessment";

interface SimOption {
  key: string;
  label: string;
  emoji: string;
  enabled: boolean;
  saving: number;
}

export default function SimulatorScreen() {
  const [currentFootprint, setCurrentFootprint] = useState(30);
  const [currentScore, setCurrentScore] = useState(50);

  const [options, setOptions] = useState<SimOption[]>([
    { key: "bike", label: "Switch to bike", emoji: "🚲", enabled: false, saving: 6.5 },
    { key: "vegetarian", label: "Go vegetarian", emoji: "🥗", enabled: false, saving: 8.0 },
    { key: "energy", label: "Reduce energy by 50%", emoji: "💡", enabled: false, saving: 3.5 },
    { key: "minimal", label: "Shop minimal", emoji: "✨", enabled: false, saving: 5.0 },
  ]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const assess = await getLastAssessment();
    if (assess) {
      setCurrentFootprint(assess.footprint);
      setCurrentScore(assess.score);
    }
  };

  const toggleOption = (key: string) => {
    setOptions((prev) =>
      prev.map((o) => (o.key === key ? { ...o, enabled: !o.enabled } : o))
    );
  };

  const totalSavings = options
    .filter((o) => o.enabled)
    .reduce((sum, o) => sum + o.saving, 0);

  const projectedFootprint = Math.max(0, currentFootprint - totalSavings);
  const projectedScore = Math.min(
    100,
    Math.round(currentScore + (totalSavings / currentFootprint) * 100 * 0.8)
  );

  const beforeData = [
    { label: "Current", value: currentFootprint },
    { label: "Projected", value: projectedFootprint },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>🌱 Carbon Simulator</Text>
        <Text style={styles.headerSubtitle}>
          See how green choices reduce your footprint
        </Text>
      </View>

      <CarbonCard
        title="Current Footprint"
        value={currentFootprint}
        unit="kg CO₂/month"
        color="#F57C00"
      />

      <View style={styles.optionsSection}>
        <Text style={styles.sectionTitle}>Toggle Improvements</Text>
        {options.map((option) => (
          <View key={option.key} style={styles.optionRow}>
            <Text style={styles.optionEmoji}>{option.emoji}</Text>
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Text style={styles.optionSaving}>Saves {option.saving} kg</Text>
            </View>
            <Switch
              value={option.enabled}
              onValueChange={() => toggleOption(option.key)}
              trackColor={{ false: "#E0E0E0", true: "#81C784" }}
              thumbColor={option.enabled ? "#2E7D32" : "#F5F5F5"}
            />
          </View>
        ))}
      </View>

      <CarbonCard
        title="Projected Footprint"
        value={projectedFootprint}
        unit="kg CO₂/month"
        color={projectedFootprint < currentFootprint ? "#2E7D32" : "#666"}
      />

      <ChartCard data={beforeData} title="Before vs After (kg CO₂)" color="#2E7D32" />

      <View style={styles.scoreSection}>
        <Text style={styles.sectionTitle}>Projected Eco Score</Text>
        <EcoScore score={projectedScore} size="large" />
        <Text style={styles.scoreChange}>
          {projectedScore > currentScore
            ? `+${projectedScore - currentScore} point improvement! 🎉`
            : "Toggle options above to see improvement"}
        </Text>
      </View>

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
    padding: 20,
    alignItems: "center",
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
    textAlign: "center",
  },
  optionsSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  optionRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  optionEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  optionSaving: {
    fontSize: 13,
    color: "#2E7D32",
    fontWeight: "600",
    marginTop: 2,
  },
  scoreSection: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  scoreChange: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginTop: 12,
    textAlign: "center",
  },
});
