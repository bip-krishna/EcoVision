import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: string;
}

export default function AchievementCard({ title, description, icon, unlocked, date }: AchievementCardProps) {
  return (
    <View style={[styles.card, !unlocked && styles.lockedCard]}>
      <Text style={styles.icon}>{unlocked ? icon : "🔒"}</Text>
      <View style={styles.content}>
        <Text style={[styles.title, !unlocked && styles.lockedText]}>{title}</Text>
        <Text style={[styles.description, !unlocked && styles.lockedText]}>{description}</Text>
        {unlocked && date && (
          <Text style={styles.date}>
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        )}
      </View>
      {unlocked && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✓</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
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
    alignItems: "center",
  },
  lockedCard: {
    opacity: 0.6,
    backgroundColor: "#F5F5F5",
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  lockedText: {
    color: "#999",
  },
  date: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  badge: {
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});
