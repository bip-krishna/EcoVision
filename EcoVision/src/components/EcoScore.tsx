import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface EcoScoreProps {
  score: number;
  size?: "small" | "large";
}

function getScoreColor(score: number): string {
  if (score >= 70) return "#2E7D32";
  if (score >= 40) return "#F9A825";
  return "#D32F2F";
}

export default function EcoScore({ score, size = "large" }: EcoScoreProps) {
  const diameter = size === "large" ? 120 : 60;
  const strokeWidth = size === "large" ? 10 : 6;
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const color = getScoreColor(progress);

  const fontSize = size === "large" ? 32 : 16;

  return (
    <View style={[styles.container, { width: diameter, height: diameter }]}>
      <Svg width={diameter} height={diameter}>
        <Circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${diameter / 2}, ${diameter / 2})`}
        />
      </Svg>
      <View style={styles.labelContainer}>
        <Text style={[styles.scoreText, { fontSize, color }]}>{progress}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  labelContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreText: {
    fontWeight: "800",
  },
});
