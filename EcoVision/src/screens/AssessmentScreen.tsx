import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import EcoScore from "../components/EcoScore";
import ChartCard from "../components/ChartCard";
import { submitAssessment, calculateFootprint, AssessmentResult } from "../services/assessment";

const transportOptions = [
  { key: "bike", label: "Bike", emoji: "🚲" },
  { key: "public", label: "Public Transport", emoji: "🚌" },
  { key: "car", label: "Car", emoji: "🚗" },
  { key: "plane", label: "Frequent Flyer", emoji: "✈️" },
] as const;

const dietOptions = [
  { key: "vegan", label: "Vegan", emoji: "🌱" },
  { key: "vegetarian", label: "Vegetarian", emoji: "🥦" },
  { key: "mixed", label: "Mixed", emoji: "🍽️" },
  { key: "meatHeavy", label: "Meat-heavy", emoji: "🥩" },
] as const;

const shoppingOptions = [
  { key: "minimal", label: "Minimal", emoji: "✨" },
  { key: "low", label: "Low", emoji: "🛍️" },
  { key: "medium", label: "Medium", emoji: "🛒" },
  { key: "high", label: "High", emoji: "🛑" },
] as const;

const TOTAL_STEPS = 4;

export default function AssessmentScreen({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [transport, setTransport] = useState<string>("bike");
  const [diet, setDiet] = useState<string>("mixed");
  const [energy, setEnergy] = useState(10);
  const [shopping, setShopping] = useState<string>("medium");
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [calculating, setCalculating] = useState(false);

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCalculate = async () => {
    setCalculating(true);
    const local = calculateFootprint(
      transport as any,
      diet as any,
      energy,
      shopping as any
    );
    const fullResult: AssessmentResult = {
      ...local,
      date: new Date().toISOString(),
      suggestions: [],
    };
    try {
      const serverResult = await submitAssessment({
        transport,
        food: diet,
        energy,
        shopping,
      });
      setResult(serverResult);
    } catch {
      setResult(fullResult);
    }
    setCalculating(false);
  };

  const handleSaveAndGoHome = async () => {
    if (result) {
      const { score, footprint, breakdown } = result;
      const local = calculateFootprint(
        transport as any,
        diet as any,
        energy,
        shopping as any
      );
      await submitAssessment({
        transport,
        food: diet,
        energy,
        shopping,
      });
    }
    navigation.navigate("Home");
  };

  if (result) {
    const chartData = [
      { label: "Transport", value: result.breakdown.transport },
      { label: "Food", value: result.breakdown.food },
      { label: "Energy", value: result.breakdown.energy },
      { label: "Shopping", value: result.breakdown.shopping },
    ];

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.resultContainer}>
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Your Results</Text>
          <EcoScore score={result.score} size="large" />
          <Text style={styles.resultScoreText}>
            {result.score >= 70
              ? "Excellent! You're a sustainability champion! 🌟"
              : result.score >= 40
              ? "Good start! There's room to improve. 🌿"
              : "Time to make some changes! 🌍"}
          </Text>
          <Text style={styles.footprintText}>
            {result.footprint} kg CO₂ / month
          </Text>
        </View>

        <ChartCard data={chartData} title="Footprint Breakdown (kg CO₂)" />

        {result.suggestions.length > 0 && (
          <View style={styles.suggestionsCard}>
            <Text style={styles.suggestionsTitle}>Tips</Text>
            {result.suggestions.map((s, i) => (
              <View key={i} style={styles.suggestionItem}>
                <Text style={styles.suggestionBullet}>•</Text>
                <Text style={styles.suggestionText}>{s}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.primaryButton} onPress={handleSaveAndGoHome}>
          <Text style={styles.primaryButtonText}>Save & Go Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => { setResult(null); setStep(1); }}>
          <Text style={styles.secondaryButtonText}>Retake</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    );
  }

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <View key={i} style={styles.stepRow}>
          <View
            style={[
              styles.stepDot,
              i + 1 === step && styles.stepDotActive,
              i + 1 < step && styles.stepDotCompleted,
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                (i + 1 === step || i + 1 < step) && styles.stepNumberActive,
              ]}
            >
              {i + 1}
            </Text>
          </View>
          {i < TOTAL_STEPS - 1 && (
            <View
              style={[
                styles.stepLine,
                i + 1 < step && styles.stepLineActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.formContainer}>
      {renderStepIndicator()}

      <Text style={styles.stepTitle}>
        Step {step}/{TOTAL_STEPS}
      </Text>

      {step === 1 && (
        <View style={styles.stepCard}>
          <Text style={styles.questionText}>How do you usually travel?</Text>
          {transportOptions.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.optionCard,
                transport === opt.key && styles.optionCardSelected,
              ]}
              onPress={() => setTransport(opt.key)}
            >
              <Text style={styles.optionEmoji}>{opt.emoji}</Text>
              <Text
                style={[
                  styles.optionLabel,
                  transport === opt.key && styles.optionLabelSelected,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepCard}>
          <Text style={styles.questionText}>What's your diet like?</Text>
          {dietOptions.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.optionCard,
                diet === opt.key && styles.optionCardSelected,
              ]}
              onPress={() => setDiet(opt.key)}
            >
              <Text style={styles.optionEmoji}>{opt.emoji}</Text>
              <Text
                style={[
                  styles.optionLabel,
                  diet === opt.key && styles.optionLabelSelected,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepCard}>
          <Text style={styles.questionText}>Daily energy usage (kWh)</Text>
          <Text style={styles.sliderValue}>{energy} kWh/day</Text>
          <View style={styles.energySelector}>
            <TouchableOpacity
              style={styles.energyButton}
              onPress={() => setEnergy(Math.max(1, energy - 1))}
            >
              <Text style={styles.energyButtonText}>−</Text>
            </TouchableOpacity>
            <View style={styles.energyBar}>
              <View style={[styles.energyFill, { width: `${(energy / 20) * 100}%` }]} />
            </View>
            <TouchableOpacity
              style={styles.energyButton}
              onPress={() => setEnergy(Math.min(20, energy + 1))}
            >
              <Text style={styles.energyButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>Low (1 kWh)</Text>
            <Text style={styles.sliderLabel}>High (20 kWh)</Text>
          </View>
          <View style={styles.energyPresets}>
            {[3, 6, 10, 15].map((val) => (
              <TouchableOpacity
                key={val}
                style={[
                  styles.presetChip,
                  energy === val && styles.presetChipActive,
                ]}
                onPress={() => setEnergy(val)}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    energy === val && styles.presetChipTextActive,
                  ]}
                >
                  {val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {step === 4 && (
        <View style={styles.stepCard}>
          <Text style={styles.questionText}>How much do you shop?</Text>
          {shoppingOptions.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.optionCard,
                shopping === opt.key && styles.optionCardSelected,
              ]}
              onPress={() => setShopping(opt.key)}
            >
              <Text style={styles.optionEmoji}>{opt.emoji}</Text>
              <Text
                style={[
                  styles.optionLabel,
                  shopping === opt.key && styles.optionLabelSelected,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.navButtons}>
        {step > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        {step < TOTAL_STEPS ? (
          <TouchableOpacity
            style={[styles.nextButton, step === 1 && { flex: 1 }]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.calculateButton}
            onPress={handleCalculate}
            disabled={calculating}
          >
            <Text style={styles.calculateButtonText}>
              {calculating ? "Calculating..." : "Calculate"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  resultContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  stepDotActive: {
    backgroundColor: "#2E7D32",
  },
  stepDotCompleted: {
    backgroundColor: "#81C784",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#999",
  },
  stepNumberActive: {
    color: "#FFFFFF",
  },
  stepLine: {
    width: 30,
    height: 3,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: "#81C784",
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  stepCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionCardSelected: {
    backgroundColor: "#E8F5E9",
    borderColor: "#2E7D32",
  },
  optionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  optionLabelSelected: {
    color: "#2E7D32",
    fontWeight: "700",
  },
  energySelector: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
    gap: 12,
  },
  energyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2E7D32",
  },
  energyButtonText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2E7D32",
  },
  energyBar: {
    flex: 1,
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
  },
  energyFill: {
    height: "100%",
    backgroundColor: "#2E7D32",
    borderRadius: 5,
  },
  sliderValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2E7D32",
    textAlign: "center",
    marginVertical: 8,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#999",
  },
  energyPresets: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  presetChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  presetChipActive: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  presetChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  presetChipTextActive: {
    color: "#FFFFFF",
  },
  navButtons: {
    flexDirection: "row",
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2E7D32",
  },
  backButtonText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "700",
  },
  nextButton: {
    flex: 1,
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  calculateButton: {
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
  calculateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#333",
    marginBottom: 20,
  },
  resultScoreText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  footprintText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E7D32",
    marginTop: 4,
  },
  suggestionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  suggestionItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  suggestionBullet: {
    fontSize: 16,
    color: "#2E7D32",
    marginRight: 8,
    lineHeight: 20,
  },
  suggestionText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 2,
    borderColor: "#2E7D32",
  },
  secondaryButtonText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "700",
  },
});
