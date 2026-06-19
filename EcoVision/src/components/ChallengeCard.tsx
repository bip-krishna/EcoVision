import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Challenge } from "../data/challenges";

interface ChallengeCardProps {
  challenge: Challenge;
  onComplete?: (id: string) => void;
}

export default function ChallengeCard({ challenge, onComplete }: ChallengeCardProps) {
  const isCompleted = challenge.progress >= 100;

  return (
    <View style={[styles.card, isCompleted && styles.completedCard]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{challenge.icon}</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>{challenge.title}</Text>
          <Text style={styles.description}>{challenge.description}</Text>
        </View>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>{challenge.points}pts</Text>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${challenge.progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{challenge.progress}%</Text>
      </View>
      {!isCompleted && onComplete && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => onComplete(challenge.id)}
        >
          <Text style={styles.completeButtonText}>Mark Complete</Text>
        </TouchableOpacity>
      )}
      {isCompleted && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>✓ Completed</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  completedCard: {
    opacity: 0.8,
    borderLeftWidth: 4,
    borderLeftColor: "#2E7D32",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  pointsBadge: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2E7D32",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    marginRight: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2E7D32",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    width: 36,
    textAlign: "right",
  },
  completeButton: {
    marginTop: 12,
    backgroundColor: "#2E7D32",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  completedBadge: {
    marginTop: 12,
    alignItems: "center",
  },
  completedText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E7D32",
  },
});
