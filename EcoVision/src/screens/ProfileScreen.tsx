import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import EcoScore from "../components/EcoScore";
import AchievementCard from "../components/AchievementCard";
import { getLastAssessment } from "../services/assessment";
import { getScanHistory } from "../services/scanner";
import { getAchievements, getTotalPoints, Achievement } from "../services/coach";

const USERNAME_KEY = "ecovision_username";

export default function ProfileScreen() {
  const [username, setUsername] = useState("Eco Warrior");
  const [usernameInput, setUsernameInput] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [scanCount, setScanCount] = useState(0);
  const [assessmentCount, setAssessmentCount] = useState(0);
  const [score, setScore] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const savedUser = await AsyncStorage.getItem(USERNAME_KEY);
    if (savedUser) setUsername(savedUser);

    const points = await getTotalPoints();
    setTotalPoints(points);

    const scans = await getScanHistory();
    setScanCount(scans.length);

    const assess = await getLastAssessment();
    if (assess) {
      setScore(assess.score);
      setAssessmentCount(1);
    }

    const achievs = await getAchievements();
    setAchievements(achievs);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleSaveUsername = async () => {
    const name = usernameInput.trim() || "Eco Warrior";
    setUsername(name);
    setEditingUsername(false);
    await AsyncStorage.setItem(USERNAME_KEY, name);
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will reset all your progress, assessments, and scan history. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.multiRemove([
              "ecovision_assessment",
              "ecovision_scan_history",
              "ecovision_achievements",
              "ecovision_challenges",
            ]);
            setScore(0);
            setScanCount(0);
            setAssessmentCount(0);
            setTotalPoints(0);
            setAchievements([]);
            alert("Data cleared successfully.");
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const firstLetter = username.charAt(0).toUpperCase();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{firstLetter}</Text>
        </View>
        {editingUsername ? (
          <View style={styles.usernameEditRow}>
            <TextInput
              style={styles.usernameInput}
              value={usernameInput}
              onChangeText={setUsernameInput}
              placeholder="Enter username"
              placeholderTextColor="#999"
              autoFocus
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveUsername}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setUsernameInput(username);
              setEditingUsername(true);
            }}
          >
            <Text style={styles.username}>{username} ✏️</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🏆</Text>
          <Text style={styles.statValue}>{totalPoints}</Text>
          <Text style={styles.statLabel}>Eco Points</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>📸</Text>
          <Text style={styles.statValue}>{scanCount}</Text>
          <Text style={styles.statLabel}>Scans</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>📋</Text>
          <Text style={styles.statValue}>{assessmentCount}</Text>
          <Text style={styles.statLabel}>Assessments</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🎯</Text>
          <Text style={styles.statValue}>{achievements.length}</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </View>

      <View style={styles.scoreSection}>
        <Text style={styles.sectionTitle}>Your Eco Score</Text>
        <EcoScore score={score} size="large" />
      </View>

      {achievements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏅 Badges & Achievements</Text>
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

      <TouchableOpacity style={styles.clearButton} onPress={handleClearData}>
        <Text style={styles.clearButtonText}>Clear All Data</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  username: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  usernameEditRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 8,
  },
  usernameInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#2E7D32",
  },
  saveButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2E7D32",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#666",
    marginTop: 2,
  },
  scoreSection: {
    alignItems: "center",
    paddingVertical: 16,
  },
  section: {
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  clearButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 2,
    borderColor: "#D32F2F",
  },
  clearButtonText: {
    color: "#D32F2F",
    fontSize: 15,
    fontWeight: "700",
  },
});
