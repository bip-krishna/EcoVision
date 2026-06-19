import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { scanWaste, getScanHistory, ScanResult } from "../services/scanner";
import { categoryColors } from "../data/carbonFactors";

export default function ScannerScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    const h = await getScanHistory();
    setHistory(h);
  }, []);

  React.useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access gallery is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setResult(null);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access camera is required.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setResult(null);
    }
  };

  const handleScan = async () => {
    if (!imageUri) return;
    setScanning(true);
    try {
      const scanResult = await scanWaste(imageUri);
      setResult(scanResult);
      await loadHistory();
    } catch (error) {
      alert("Scan failed. Please try again.");
    }
    setScanning(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const getCategoryColor = (category: string): string => {
    return categoryColors[category] || "#78909C";
  };

  const getImpactColor = (impact: string): string => {
    switch (impact.toLowerCase()) {
      case "critical":
        return "#D32F2F";
      case "high":
        return "#F57C00";
      case "medium":
        return "#F9A825";
      case "low":
        return "#388E3C";
      default:
        return "#666";
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.section}>
        <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
          <Text style={styles.photoButtonIcon}>📸</Text>
          <Text style={styles.photoButtonText}>Open Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
          <Text style={styles.galleryButtonIcon}>🖼️</Text>
          <Text style={styles.galleryButtonText}>Pick from Gallery</Text>
        </TouchableOpacity>
      </View>

      {imageUri && (
        <View style={styles.previewSection}>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          <TouchableOpacity
            style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
            onPress={handleScan}
            disabled={scanning}
          >
            <Text style={styles.scanButtonText}>
              {scanning ? "Analyzing..." : "Analyze Waste"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Scan Result</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Object:</Text>
            <Text style={styles.resultValue}>{result.object}</Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Category:</Text>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(result.category) + "20" },
              ]}
            >
              <View
                style={[
                  styles.categoryDot,
                  { backgroundColor: getCategoryColor(result.category) },
                ]}
              />
              <Text
                style={[
                  styles.categoryText,
                  { color: getCategoryColor(result.category) },
                ]}
              >
                {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
              </Text>
            </View>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Impact:</Text>
            <Text
              style={[
                styles.impactText,
                { color: getImpactColor(result.impact) },
              ]}
            >
              {result.impact}
            </Text>
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>CO₂ Saved:</Text>
            <Text style={styles.co2Text}>{result.co2Saved} kg</Text>
          </View>
          <View style={styles.suggestionBox}>
            <Text style={styles.suggestionIcon}>💡</Text>
            <Text style={styles.suggestionText}>{result.suggestion}</Text>
          </View>
        </View>
      )}

      {history.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scan History</Text>
          {history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View
                style={[
                  styles.historyDot,
                  { backgroundColor: getCategoryColor(item.category) },
                ]}
              />
              <View style={styles.historyContent}>
                <Text style={styles.historyObject}>{item.object}</Text>
                <Text style={styles.historyDate}>
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>
              <Text style={styles.historyCo2}>{item.co2Saved} kg</Text>
            </View>
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
  section: {
    padding: 16,
  },
  photoButton: {
    flexDirection: "row",
    backgroundColor: "#2E7D32",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  photoButtonIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  photoButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  galleryButton: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#2E7D32",
  },
  galleryButtonIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  galleryButtonText: {
    color: "#2E7D32",
    fontSize: 17,
    fontWeight: "700",
  },
  previewSection: {
    padding: 16,
    alignItems: "center",
  },
  preview: {
    width: "100%",
    height: 250,
    borderRadius: 16,
    marginBottom: 12,
  },
  scanButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
  },
  scanButtonDisabled: {
    opacity: 0.6,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    width: 90,
  },
  resultValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  impactText: {
    fontSize: 15,
    fontWeight: "700",
  },
  co2Text: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2E7D32",
  },
  suggestionBox: {
    flexDirection: "row",
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    alignItems: "flex-start",
  },
  suggestionIcon: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 1,
  },
  suggestionText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyObject: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  historyDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  historyCo2: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2E7D32",
  },
});
